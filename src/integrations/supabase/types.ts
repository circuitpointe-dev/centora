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
      calendar_events: {
        Row: {
          color: string | null
          created_at: string
          created_by: string
          date: string
          id: string
          org_id: string
          title: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by: string
          date: string
          id?: string
          org_id: string
          title: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          org_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      donor_contacts: {
        Row: {
          created_at: string
          donor_id: string
          email: string
          full_name: string
          id: string
          is_primary: boolean | null
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          donor_id: string
          email: string
          full_name: string
          id?: string
          is_primary?: boolean | null
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          donor_id?: string
          email?: string
          full_name?: string
          id?: string
          is_primary?: boolean | null
          phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_contacts_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_documents: {
        Row: {
          donor_id: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          donor_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          donor_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_documents_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_focus_areas: {
        Row: {
          created_at: string
          donor_id: string
          focus_area_id: string
          id: string
        }
        Insert: {
          created_at?: string
          donor_id: string
          focus_area_id: string
          id?: string
        }
        Update: {
          created_at?: string
          donor_id?: string
          focus_area_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_focus_areas_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donor_focus_areas_focus_area_id_fkey"
            columns: ["focus_area_id"]
            isOneToOne: false
            referencedRelation: "focus_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          affiliation: string | null
          created_at: string
          created_by: string
          funding_end_date: string | null
          funding_start_date: string | null
          id: string
          last_donation_date: string | null
          name: string
          notes: string | null
          org_id: string
          organization_url: string | null
          status: Database["public"]["Enums"]["donor_status"]
          total_donations: number | null
          updated_at: string
        }
        Insert: {
          affiliation?: string | null
          created_at?: string
          created_by: string
          funding_end_date?: string | null
          funding_start_date?: string | null
          id?: string
          last_donation_date?: string | null
          name: string
          notes?: string | null
          org_id: string
          organization_url?: string | null
          status?: Database["public"]["Enums"]["donor_status"]
          total_donations?: number | null
          updated_at?: string
        }
        Update: {
          affiliation?: string | null
          created_at?: string
          created_by?: string
          funding_end_date?: string | null
          funding_start_date?: string | null
          id?: string
          last_donation_date?: string | null
          name?: string
          notes?: string | null
          org_id?: string
          organization_url?: string | null
          status?: Database["public"]["Enums"]["donor_status"]
          total_donations?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      focus_areas: {
        Row: {
          amount: number
          color: string
          created_at: string
          created_by: string
          currency: string
          description: string | null
          funding_end_date: string
          funding_start_date: string
          id: string
          interest_tags: string[] | null
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          color: string
          created_at?: string
          created_by: string
          currency?: string
          description?: string | null
          funding_end_date: string
          funding_start_date: string
          id?: string
          interest_tags?: string[] | null
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          color?: string
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          funding_end_date?: string
          funding_start_date?: string
          id?: string
          interest_tags?: string[] | null
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_modules: {
        Row: {
          created_at: string
          module: Database["public"]["Enums"]["module_key"]
          org_id: string
        }
        Insert: {
          created_at?: string
          module: Database["public"]["Enums"]["module_key"]
          org_id: string
        }
        Update: {
          created_at?: string
          module?: Database["public"]["Enums"]["module_key"]
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_modules_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          phone: string | null
          postal_code: string | null
          primary_currency: string
          state: string | null
          type: Database["public"]["Enums"]["organization_type"]
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          phone?: string | null
          postal_code?: string | null
          primary_currency?: string
          state?: string | null
          type: Database["public"]["Enums"]["organization_type"]
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          primary_currency?: string
          state?: string | null
          type?: Database["public"]["Enums"]["organization_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          org_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          org_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_update_member_role: {
        Args: {
          _member_id: string
          _new_role: Database["public"]["Enums"]["app_role"]
          _org_id: string
        }
        Returns: boolean
      }
      create_donor_with_details: {
        Args:
          | {
              _org_id: string
              _created_by: string
              _name: string
              _affiliation?: string
              _organization_url?: string
              _funding_start_date?: string
              _funding_end_date?: string
              _notes?: string
              _contacts?: Json
              _focus_area_ids?: string[]
            }
          | {
              _org_id: string
              _created_by: string
              _name: string
              _affiliation?: string
              _organization_url?: string
              _funding_start_date?: string
              _funding_end_date?: string
              _notes?: string
              _contacts?: string
              _focus_area_ids?: string[]
            }
        Returns: string
      }
      get_org_member_count: {
        Args: { _org_id: string }
        Returns: number
      }
      get_org_member_list: {
        Args: { _org_id: string }
        Returns: {
          id: string
          full_name: string
          role: Database["public"]["Enums"]["app_role"]
          created_at: string
        }[]
      }
      is_org_admin: {
        Args: { _org_id: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "org_admin" | "org_member"
      donor_status: "active" | "inactive" | "potential"
      module_key:
        | "fundraising"
        | "grants"
        | "documents"
        | "programme"
        | "procurement"
        | "inventory"
        | "finance"
        | "learning"
        | "hr"
        | "users"
      organization_type: "NGO" | "DONOR"
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
      app_role: ["org_admin", "org_member"],
      donor_status: ["active", "inactive", "potential"],
      module_key: [
        "fundraising",
        "grants",
        "documents",
        "programme",
        "procurement",
        "inventory",
        "finance",
        "learning",
        "hr",
        "users",
      ],
      organization_type: ["NGO", "DONOR"],
    },
  },
} as const
