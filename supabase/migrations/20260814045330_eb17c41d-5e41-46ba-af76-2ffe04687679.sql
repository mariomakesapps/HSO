drop policy if exists "Owners insert collections" on public.collections;
create policy "Owners insert collections" on public.collections
  for insert to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "Owners update collections" on public.collections;
create policy "Owners update collections" on public.collections
  for update to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Owners delete collections" on public.collections;
create policy "Owners delete collections" on public.collections
  for delete to authenticated
  using (auth.uid() = owner_id);

grant select, insert, update, delete on public.collections to authenticated;
grant select on public.collections to anon;
grant all on public.collections to service_role;