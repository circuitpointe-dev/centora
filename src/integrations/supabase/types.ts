export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      organization_modules: {
        Row: {
          id: string
          is_active: boolean | null
          module_name: string
          organization_id: string | null
          selected_at: string | null
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          module_name: string
          organization_id?: string | null
          selected_at?: string | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          module_name?: string
          organization_id?: string | null
          selected_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_modules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_pricing: {
        Row: {
          id: string
          organization_id: string | null
          pricing_tier_id: string | null
          selected_at: string | null
        }
        Insert: {
          id?: string
          organization_id?: string | null
          pricing_tier_id?: string | null
          selected_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          pricing_tier_id?: string | null
          selected_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_pricing_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_pricing_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "pricing_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string
          contact_phone: string
          created_at: string | null
          id: string
          name: string
          primary_currency: string
          status: Database["public"]["Enums"]["organization_status"] | null
          type: Database["public"]["Enums"]["organization_type"]
          updated_at: string | null
        }
        Insert: {
          address: string
          contact_phone: string
          created_at?: string | null
          id?: string
          name: string
          primary_currency: string
          status?: Database["public"]["Enums"]["organization_status"] | null
          type: Database["public"]["Enums"]["organization_type"]
          updated_at?: string | null
        }
        Update: {
          address?: string
          contact_phone?: string
          created_at?: string | null
          id?: string
          name?: string
          primary_currency?: string
          status?: Database["public"]["Enums"]["organization_status"] | null
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          created_at: string | null
          description: string
          display_name: string
          features: Json
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description: string
          display_name: string
          features: Json
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string
          display_name?: string
          features?: Json
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          organization_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          organization_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          organization_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_progress: {
        Row: {
          created_at: string | null
          email: string
          form_data: Json | null
          id: string
          organization_name: string | null
          step_completed: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          form_data?: Json | null
          id?: string
          organization_name?: string | null
          step_completed?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          form_data?: Json | null
          id?: string
          organization_name?: string | null
          step_completed?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_dev_users: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      register_organization_and_user: {
        Args: {
          p_organization_name: string
          p_organization_type: Database["public"]["Enums"]["organization_type"]
          p_organization_address: string
          p_primary_currency: string
          p_contact_phone: string
          p_full_name: string
          p_email: string
          p_password: string
          p_selected_modules: string[]
          p_pricing_tier_name: string
        }
        Returns: Json
      }
      save_registration_progress: {
        Args: { p_email: string; p_step: number; p_form_data: Json }
        Returns: Json
      }
    }
    Enums: {
      organization_status: "pending_verification" | "active" | "suspended"
      organization_type: "NGO" | "Donor"
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
      organization_status: ["pending_verification", "active", "suspended"],
      organization_type: ["NGO", "Donor"],
    },
  },
} as const
