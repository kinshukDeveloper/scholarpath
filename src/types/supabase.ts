export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          result_at: string | null
          scholarship_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          result_at?: string | null
          scholarship_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          result_at?: string | null
          scholarship_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_avatar: string | null
          author_name: string | null
          category: string | null
          content: string | null
          cover_url: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_avatar?: string | null
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          documents?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_avatar?: string | null
          author_name?: string | null
          category?: string | null
          content?: string | null
          cover_url?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          documents?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          scholarship_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          scholarship_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          scholarship_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          replied_at: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          replied_at?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          replied_at?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      featured_listings: {
        Row: {
          amount_paid: number | null
          contact_email: string | null
          contact_name: string | null
          created_at: string | null
          ends_at: string
          id: string
          plan_type: string | null
          razorpay_id: string | null
          scholarship_id: string
          starts_at: string
          status: Database["public"]["Enums"]["listing_status"] | null
        }
        Insert: {
          amount_paid?: number | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          ends_at: string
          id?: string
          plan_type?: string | null
          razorpay_id?: string | null
          scholarship_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["listing_status"] | null
        }
        Update: {
          amount_paid?: number | null
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          ends_at?: string
          id?: string
          plan_type?: string | null
          razorpay_id?: string | null
          scholarship_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["listing_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_listings_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subs: {
        Row: {
          confirm_token: string | null
          created_at: string | null
          email: string
          id: string
          is_confirmed: boolean | null
          unsubscribed_at: string | null
        }
        Insert: {
          confirm_token?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_confirmed?: boolean | null
          unsubscribed_at?: string | null
        }
        Update: {
          confirm_token?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_confirmed?: boolean | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_emoji: string | null
          avatar_url: string | null
          category: string | null
          created_at: string | null
          date_of_birth: string | null
          education_level: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          income_annual: number | null
          income_range: string | null
          is_premium: boolean | null
          notification_prefs: Json | null
          onboarded: boolean | null
          phone: string | null
          plan: string | null
          plan_expires_at: string | null
          premium_until: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_emoji?: string | null
          avatar_url?: string | null
          category?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education_level?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          income_annual?: number | null
          income_range?: string | null
          is_premium?: boolean | null
          notification_prefs?: Json | null
          onboarded?: boolean | null
          phone?: string | null
          plan?: string | null
          plan_expires_at?: string | null
          premium_until?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_emoji?: string | null
          avatar_url?: string | null
          category?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education_level?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          income_annual?: number | null
          income_range?: string | null
          is_premium?: boolean | null
          notification_prefs?: Json | null
          onboarded?: boolean | null
          phone?: string | null
          plan?: string | null
          plan_expires_at?: string | null
          premium_until?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          channel: string | null
          created_at: string | null
          id: string
          remind_at: string
          scholarship_id: string
          sent: boolean | null
          sent_at: string | null
          user_id: string
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          id?: string
          remind_at: string
          scholarship_id: string
          sent?: boolean | null
          sent_at?: string | null
          user_id: string
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          id?: string
          remind_at?: string
          scholarship_id?: string
          sent?: boolean | null
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarships: {
        Row: {
          amount: number
          amount_type: string
          application_count: number | null
          apply_url: string | null
          category: string[] | null
          created_at: string | null
          deadline: string
          description: string | null
          education_level: string[] | null
          eligibility: string | null
          gender: string | null
          id: string
          income_max: number | null
          is_active: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          max_income: number | null
          min_percentage: number | null
          official_url: string | null
          open_date: string | null
          provider: string
          slug: string | null
          state: string | null
          tags: string[] | null
          documents: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          amount: number
          amount_type?: string
          application_count?: number | null
          apply_url?: string | null
          category?: string[] | null
          created_at?: string | null
          deadline: string
          description?: string | null
          education_level?: string[] | null
          eligibility?: string | null
          gender?: string | null
          id?: string
          income_max?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          max_income?: number | null
          min_percentage?: number | null
          official_url?: string | null
          open_date?: string | null
          provider: string
          slug?: string | null
          state?: string | null
          tags?: string[] | null
          documents?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          amount?: number
          amount_type?: string
          application_count?: number | null
          apply_url?: string | null
          category?: string[] | null
          created_at?: string | null
          deadline?: string
          description?: string | null
          education_level?: string[] | null
          eligibility?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          max_income?: number | null
          min_percentage?: number | null
          official_url?: string | null
          open_date?: string | null
          provider?: string
          slug?: string | null
          state?: string | null
          tags?: string[] | null
          documents?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: { scholarship_uuid: string }
        Returns: undefined
      }
      show_limit: { Args: Record<PropertyKey, never>; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      listing_status: "pending" | "active" | "expired"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      listing_status: ["pending", "active", "expired"],
      user_role: ["user", "admin"],
    },
  },
} as const
