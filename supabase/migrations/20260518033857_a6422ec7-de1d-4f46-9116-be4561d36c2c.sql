create extension if not exists pgcrypto;

do $$ begin
  create type public.collection_visibility as enum ('only_me', 'anyone_with_link', 'specific_people', 'public');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.collection_permission as enum ('view', 'edit');
exception when duplicate_object then null; end $$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  role text not null default 'student',
  created_at timestamptz not null default now()
);
alter table public.users enable row level security;
drop policy if exists "Profiles are public" on public.users;
create policy "Profiles are public" on public.users for select to anon, authenticated using (true);
drop policy if exists "Users update own profile" on public.users;
create policy "Users update own profile" on public.users for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare base_username text; final_username text;
begin
  base_username := lower(regexp_replace(coalesce(nullif(new.raw_user_meta_data->>'username',''), split_part(new.email,'@',1), 'hso_user'), '[^a-zA-Z0-9_]+', '_', 'g'));
  final_username := trim(both '_' from base_username);
  if final_username = '' then final_username := 'hso_user'; end if;
  final_username := left(final_username, 28) || '_' || left(new.id::text, 6);
  insert into public.users (id, username, avatar_url) values (new.id, final_username, new.raw_user_meta_data->>'avatar_url') on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  cover_image text,
  cover_gradient text not null default 'linear-gradient(135deg, #ff765c 0%, #2fbf82 100%)',
  visibility public.collection_visibility not null default 'only_me',
  is_published boolean not null default false,
  tags text[] not null default '{}',
  intended_majors text[] not null default '{}',
  categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists collections_owner_idx on public.collections(owner_id);
create index if not exists collections_public_idx on public.collections(is_published, visibility, updated_at desc);
create index if not exists collections_tags_idx on public.collections using gin(tags);
create index if not exists collections_majors_idx on public.collections using gin(intended_majors);
create index if not exists collections_categories_idx on public.collections using gin(categories);

create table if not exists public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  opportunity_id text not null,
  note text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection_id, opportunity_id)
);
create index if not exists collection_items_collection_idx on public.collection_items(collection_id, position);
create index if not exists collection_items_opportunity_idx on public.collection_items(opportunity_id);

create table if not exists public.collection_shares (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  shared_with_user_id uuid not null references auth.users(id) on delete cascade,
  permission public.collection_permission not null default 'view',
  created_at timestamptz not null default now(),
  unique (collection_id, shared_with_user_id)
);
create index if not exists collection_shares_user_idx on public.collection_shares(shared_with_user_id);

create table if not exists public.collection_links (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  share_token text not null unique default replace(replace(encode(gen_random_bytes(24), 'base64'), '+', '-'), '/', '_'),
  permission public.collection_permission not null default 'view',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists collection_links_collection_idx on public.collection_links(collection_id);

create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);
create index if not exists saved_opportunities_user_idx on public.saved_opportunities(user_id);

create table if not exists public.collection_likes (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (collection_id, user_id)
);

create table if not exists public.collection_bookmarks (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (collection_id, user_id)
);

create table if not exists public.collection_comments (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists collections_updated_at on public.collections;
create trigger collections_updated_at before update on public.collections for each row execute function public.set_updated_at();
drop trigger if exists collection_items_updated_at on public.collection_items;
create trigger collection_items_updated_at before update on public.collection_items for each row execute function public.set_updated_at();
drop trigger if exists collection_comments_updated_at on public.collection_comments;
create trigger collection_comments_updated_at before update on public.collection_comments for each row execute function public.set_updated_at();

create or replace function public.can_view_collection(p_collection_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.collections c
    where c.id = p_collection_id
      and (c.owner_id = auth.uid()
           or (c.visibility = 'public' and c.is_published = true)
           or exists (select 1 from public.collection_shares s where s.collection_id = c.id and s.shared_with_user_id = auth.uid()))
  );
$$;

create or replace function public.can_edit_collection(p_collection_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.collections c
    where c.id = p_collection_id
      and (c.owner_id = auth.uid()
           or exists (select 1 from public.collection_shares s where s.collection_id = c.id and s.shared_with_user_id = auth.uid() and s.permission = 'edit'))
  );
$$;

alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.collection_shares enable row level security;
alter table public.collection_links enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.collection_likes enable row level security;
alter table public.collection_bookmarks enable row level security;
alter table public.collection_comments enable row level security;

drop policy if exists "Collections are visible to allowed users" on public.collections;
create policy "Collections are visible to allowed users" on public.collections for select to anon, authenticated using (public.can_view_collection(id));
drop policy if exists "Users create own collections" on public.collections;
create policy "Users create own collections" on public.collections for insert to authenticated with check (auth.uid() = owner_id);
drop policy if exists "Owners and editors update collections" on public.collections;
create policy "Owners and editors update collections" on public.collections for update to authenticated using (public.can_edit_collection(id)) with check (public.can_edit_collection(id));
drop policy if exists "Only owners delete collections" on public.collections;
create policy "Only owners delete collections" on public.collections for delete to authenticated using (auth.uid() = owner_id);

drop policy if exists "Visible collection items are readable" on public.collection_items;
create policy "Visible collection items are readable" on public.collection_items for select to anon, authenticated using (public.can_view_collection(collection_id));
drop policy if exists "Editors insert collection items" on public.collection_items;
create policy "Editors insert collection items" on public.collection_items for insert to authenticated with check (public.can_edit_collection(collection_id));
drop policy if exists "Editors update collection items" on public.collection_items;
create policy "Editors update collection items" on public.collection_items for update to authenticated using (public.can_edit_collection(collection_id)) with check (public.can_edit_collection(collection_id));
drop policy if exists "Editors delete collection items" on public.collection_items;
create policy "Editors delete collection items" on public.collection_items for delete to authenticated using (public.can_edit_collection(collection_id));

drop policy if exists "Owners and recipients read shares" on public.collection_shares;
create policy "Owners and recipients read shares" on public.collection_shares for select to authenticated using (shared_with_user_id = auth.uid() or exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid()));
drop policy if exists "Owners manage shares" on public.collection_shares;
create policy "Owners manage shares" on public.collection_shares for all to authenticated using (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid())) with check (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid()));

drop policy if exists "Owners read links" on public.collection_links;
create policy "Owners read links" on public.collection_links for select to authenticated using (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid()));
drop policy if exists "Owners manage links" on public.collection_links;
create policy "Owners manage links" on public.collection_links for all to authenticated using (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid())) with check (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid()));

drop policy if exists "Users read own saved opportunities" on public.saved_opportunities;
create policy "Users read own saved opportunities" on public.saved_opportunities for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users insert own saved opportunities" on public.saved_opportunities;
create policy "Users insert own saved opportunities" on public.saved_opportunities for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users delete own saved opportunities" on public.saved_opportunities;
create policy "Users delete own saved opportunities" on public.saved_opportunities for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Visible collection likes are readable" on public.collection_likes;
create policy "Visible collection likes are readable" on public.collection_likes for select to anon, authenticated using (public.can_view_collection(collection_id));
drop policy if exists "Users like collections" on public.collection_likes;
create policy "Users like collections" on public.collection_likes for insert to authenticated with check (auth.uid() = user_id and public.can_view_collection(collection_id));
drop policy if exists "Users remove own likes" on public.collection_likes;
create policy "Users remove own likes" on public.collection_likes for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Visible collection bookmarks are readable" on public.collection_bookmarks;
create policy "Visible collection bookmarks are readable" on public.collection_bookmarks for select to authenticated using (auth.uid() = user_id or public.can_view_collection(collection_id));
drop policy if exists "Users bookmark collections" on public.collection_bookmarks;
create policy "Users bookmark collections" on public.collection_bookmarks for insert to authenticated with check (auth.uid() = user_id and public.can_view_collection(collection_id));
drop policy if exists "Users remove own collection bookmarks" on public.collection_bookmarks;
create policy "Users remove own collection bookmarks" on public.collection_bookmarks for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Visible comments are readable" on public.collection_comments;
create policy "Visible comments are readable" on public.collection_comments for select to anon, authenticated using (public.can_view_collection(collection_id));
drop policy if exists "Users comment on visible collections" on public.collection_comments;
create policy "Users comment on visible collections" on public.collection_comments for insert to authenticated with check (auth.uid() = user_id and public.can_view_collection(collection_id));
drop policy if exists "Users update own comments" on public.collection_comments;
create policy "Users update own comments" on public.collection_comments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users delete own comments" on public.collection_comments;
create policy "Users delete own comments" on public.collection_comments for delete to authenticated using (auth.uid() = user_id);

create or replace function public.create_collection_share_link(p_collection_id uuid, p_permission public.collection_permission default 'view', p_expires_at timestamptz default null)
returns public.collection_links language plpgsql security definer set search_path = public as $$
declare created_link public.collection_links;
begin
  if not exists (select 1 from public.collections where id = p_collection_id and owner_id = auth.uid()) then
    raise exception 'Only the collection owner can create share links.';
  end if;
  update public.collections set visibility = 'anyone_with_link', is_published = false where id = p_collection_id;
  insert into public.collection_links (collection_id, permission, expires_at) values (p_collection_id, p_permission, p_expires_at) returning * into created_link;
  return created_link;
end; $$;

create or replace function public.get_collection_by_share_token(p_share_token text)
returns table (id uuid, owner_id uuid, title text, description text, cover_image text, cover_gradient text, visibility public.collection_visibility, is_published boolean, tags text[], intended_majors text[], categories text[], created_at timestamptz, updated_at timestamptz, owner_username text, permission public.collection_permission)
language sql stable security definer set search_path = public as $$
  select c.id, c.owner_id, c.title, c.description, c.cover_image, c.cover_gradient, c.visibility, c.is_published, c.tags, c.intended_majors, c.categories, c.created_at, c.updated_at, u.username as owner_username, l.permission
  from public.collection_links l
  join public.collections c on c.id = l.collection_id
  left join public.users u on u.id = c.owner_id
  where l.share_token = p_share_token and (l.expires_at is null or l.expires_at > now())
  limit 1;
$$;

create or replace function public.get_collection_items_by_share_token(p_share_token text)
returns table (item_id uuid, collection_id uuid, opportunity_id text, note text, item_position integer, created_at timestamptz, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select i.id as item_id, i.collection_id, i.opportunity_id, i.note, i.position as item_position, i.created_at, i.updated_at
  from public.collection_links l
  join public.collection_items i on i.collection_id = l.collection_id
  where l.share_token = p_share_token and (l.expires_at is null or l.expires_at > now())
  order by i.position asc, i.created_at asc;
$$;