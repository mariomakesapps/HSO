export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      collection_bookmarks: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_bookmarks_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_comments: {
        Row: {
          body: string
          collection_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          collection_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          collection_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_comments_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_items: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          note: string
          opportunity_id: string
          position: number
          updated_at: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          note?: string
          opportunity_id: string
          position?: number
          updated_at?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          note?: string
          opportunity_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_likes: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_likes_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_links: {
        Row: {
          collection_id: string
          created_at: string
          expires_at: string | null
          id: string
          permission: Database["public"]["Enums"]["collection_permission"]
          share_token: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["collection_permission"]
          share_token?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["collection_permission"]
          share_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_links_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_shares: {
        Row: {
          collection_id: string
          created_at: string
          id: string
          permission: Database["public"]["Enums"]["collection_permission"]
          shared_with_user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          id?: string
          permission?: Database["public"]["Enums"]["collection_permission"]
          shared_with_user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          id?: string
          permission?: Database["public"]["Enums"]["collection_permission"]
          shared_with_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_shares_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          categories: string[]
          cover_gradient: string
          cover_image: string | null
          created_at: string
          description: string
          id: string
          intended_majors: string[]
          is_published: boolean
          owner_id: string
          tags: string[]
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["collection_visibility"]
        }
        Insert: {
          categories?: string[]
          cover_gradient?: string
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          intended_majors?: string[]
          is_published?: boolean
          owner_id: string
          tags?: string[]
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["collection_visibility"]
        }
        Update: {
          categories?: string[]
          cover_gradient?: string
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          intended_majors?: string[]
          is_published?: boolean
          owner_id?: string
          tags?: string[]
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["collection_visibility"]
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          reason: string
          related_url: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          reason: string
          related_url?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          reason?: string
          related_url?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      opportunity_submissions: {
        Row: {
          category: string
          cost: string | null
          created_at: string
          deadline: string | null
          description: string
          format: string | null
          grades: number[] | null
          id: string
          org: string
          status: string
          submitter_email: string
          title: string
          url: string
        }
        Insert: {
          category: string
          cost?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          format?: string | null
          grades?: number[] | null
          id?: string
          org: string
          status?: string
          submitter_email: string
          title: string
          url: string
        }
        Update: {
          category?: string
          cost?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          format?: string | null
          grades?: number[] | null
          id?: string
          org?: string
          status?: string
          submitter_email?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      reminder_preferences: {
        Row: {
          created_at: string
          id: string
          intervals: number[]
          opportunity_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intervals?: number[]
          opportunity_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intervals?: number[]
          opportunity_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: []
      }
      shared_collections: {
        Row: {
          created_at: string
          emoji: string
          id: string
          name: string
          opportunity_ids: string[]
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji?: string
          id?: string
          name: string
          opportunity_ids?: string[]
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          name?: string
          opportunity_ids?: string[]
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          role: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          role?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_collection: {
        Args: { p_collection_id: string }
        Returns: boolean
      }
      can_view_collection: {
        Args: { p_collection_id: string }
        Returns: boolean
      }
      create_collection_share_link: {
        Args: {
          p_collection_id: string
          p_expires_at?: string
          p_permission?: Database["public"]["Enums"]["collection_permission"]
        }
        Returns: {
          collection_id: string
          created_at: string
          expires_at: string | null
          id: string
          permission: Database["public"]["Enums"]["collection_permission"]
          share_token: string
        }
        SetofOptions: {
          from: "*"
          to: "collection_links"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_collection_by_share_token: {
        Args: { p_share_token: string }
        Returns: {
          categories: string[]
          cover_gradient: string
          cover_image: string
          created_at: string
          description: string
          id: string
          intended_majors: string[]
          is_published: boolean
          owner_id: string
          owner_username: string
          permission: Database["public"]["Enums"]["collection_permission"]
          tags: string[]
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["collection_visibility"]
        }[]
      }
      get_collection_items_by_share_token: {
        Args: { p_share_token: string }
        Returns: {
          collection_id: string
          created_at: string
          item_id: string
          item_position: number
          note: string
          opportunity_id: string
          updated_at: string
        }[]
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      collection_permission: "view" | "edit"
      collection_visibility:
        | "only_me"
        | "anyone_with_link"
        | "specific_people"
        | "public"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      collection_permission: ["view", "edit"],
      collection_visibility: [
        "only_me",
        "anyone_with_link",
        "specific_people",
        "public",
      ],
    },
  },
} as const
