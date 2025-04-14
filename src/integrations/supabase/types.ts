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
      budget_items: {
        Row: {
          amount: number
          club_id: string
          created_at: string
          date: string
          description: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          amount: number
          club_id: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          amount?: number
          club_id?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string
          id: string
          joined_at: string
          member_id: string
        }
        Insert: {
          club_id: string
          id?: string
          joined_at?: string
          member_id: string
        }
        Update: {
          club_id?: string
          id?: string
          joined_at?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          category: Database["public"]["Enums"]["club_category"]
          cover_image_url: string | null
          created_at: string
          description: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          organizer_id: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["club_category"]
          cover_image_url?: string | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          organizer_id: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["club_category"]
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          organizer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          attended: boolean | null
          event_id: string
          id: string
          participant_id: string
          registration_date: string
        }
        Insert: {
          attended?: boolean | null
          event_id: string
          id?: string
          participant_id: string
          registration_date?: string
        }
        Update: {
          attended?: boolean | null
          event_id?: string
          id?: string
          participant_id?: string
          registration_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          club_id: string
          created_at: string
          description: string
          end_date: string
          id: string
          image_url: string | null
          is_active: boolean
          location: string
          max_participants: number | null
          registration_deadline: string | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          club_id: string
          created_at?: string
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location: string
          max_participants?: number | null
          registration_deadline?: string | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          club_id?: string
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string
          max_participants?: number | null
          registration_deadline?: string | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id: string
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      club_category: "cultural" | "technical" | "sports" | "academic" | "other"
      user_role: "student" | "organizer" | "admin"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      club_category: ["cultural", "technical", "sports", "academic", "other"],
      user_role: ["student", "organizer", "admin"],
    },
  },
} as const
