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
      departments: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      donor_engagements: {
        Row: {
          created_at: string
          created_by: string
          description: string
          donor_id: string
          engagement_date: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          donor_id: string
          engagement_date?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          donor_id?: string
          engagement_date?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
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
      donor_funding_cycles: {
        Row: {
          color: string
          created_at: string
          created_by: string
          description: string | null
          donor_id: string
          end_month: number
          id: string
          name: string
          org_id: string
          start_month: number
          status: Database["public"]["Enums"]["funding_cycle_status"]
          updated_at: string
          year: number
        }
        Insert: {
          color?: string
          created_at?: string
          created_by: string
          description?: string | null
          donor_id: string
          end_month: number
          id?: string
          name: string
          org_id: string
          start_month: number
          status?: Database["public"]["Enums"]["funding_cycle_status"]
          updated_at?: string
          year: number
        }
        Update: {
          color?: string
          created_at?: string
          created_by?: string
          description?: string | null
          donor_id?: string
          end_month?: number
          id?: string
          name?: string
          org_id?: string
          start_month?: number
          status?: Database["public"]["Enums"]["funding_cycle_status"]
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      donor_funding_periods: {
        Row: {
          created_at: string
          created_by: string
          donor_id: string
          end_date: string
          id: string
          name: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          donor_id: string
          end_date: string
          id?: string
          name?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          donor_id?: string
          end_date?: string
          id?: string
          name?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      donor_giving_records: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          currency: string
          donor_id: string
          id: string
          month: number
          updated_at: string
          year: number
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          currency?: string
          donor_id: string
          id?: string
          month: number
          updated_at?: string
          year: number
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          currency?: string
          donor_id?: string
          id?: string
          month?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      donor_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string
          donor_id: string
          id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          donor_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          donor_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      donors: {
        Row: {
          affiliation: string | null
          created_at: string
          created_by: string
          currency: string
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
          currency?: string
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
          currency?: string
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
      features: {
        Row: {
          created_at: string | null
          feature_key: string
          feature_name: string
          id: string
          module: string
          permissions: string[]
        }
        Insert: {
          created_at?: string | null
          feature_key: string
          feature_name: string
          id?: string
          module: string
          permissions?: string[]
        }
        Update: {
          created_at?: string | null
          feature_key?: string
          feature_name?: string
          id?: string
          module?: string
          permissions?: string[]
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
      opportunities: {
        Row: {
          amount: number | null
          assigned_to: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string
          currency: string
          deadline: string
          donor_id: string
          end_date: string | null
          id: string
          notes: string | null
          org_id: string
          pipeline: string | null
          sector: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          assigned_to?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by: string
          currency?: string
          deadline: string
          donor_id: string
          end_date?: string | null
          id?: string
          notes?: string | null
          org_id: string
          pipeline?: string | null
          sector?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          assigned_to?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          deadline?: string
          donor_id?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          org_id?: string
          pipeline?: string | null
          sector?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_opportunities_donor_id"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_attachments: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          opportunity_id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          opportunity_id: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          opportunity_id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_attachments_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          opportunity_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          opportunity_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          opportunity_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_notes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_tasks: {
        Row: {
          assigned_to: string | null
          completed: boolean | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          opportunity_id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          opportunity_id: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          opportunity_id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
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
          department_id: string | null
          email: string
          full_name: string | null
          id: string
          is_super_admin: boolean
          org_id: string
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email: string
          full_name?: string | null
          id: string
          is_super_admin?: boolean
          org_id: string
          role: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_super_admin?: boolean
          org_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          module_key: string
          org_id: string
          permissions: Database["public"]["Enums"]["feature_permission"][]
          role_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          module_key: string
          org_id: string
          permissions?: Database["public"]["Enums"]["feature_permission"][]
          role_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          module_key?: string
          org_id?: string
          permissions?: Database["public"]["Enums"]["feature_permission"][]
          role_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          access: Json | null
          created_at: string
          department_id: string | null
          email: string
          expires_at: string
          full_name: string
          id: string
          invited_by: string
          org_id: string
          redeemed_at: string | null
          role_ids: string[]
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
          updated_at: string
        }
        Insert: {
          access?: Json | null
          created_at?: string
          department_id?: string | null
          email: string
          expires_at?: string
          full_name: string
          id?: string
          invited_by: string
          org_id: string
          redeemed_at?: string | null
          role_ids?: string[]
          status?: Database["public"]["Enums"]["invitation_status"]
          token: string
          updated_at?: string
        }
        Update: {
          access?: Json | null
          created_at?: string
          department_id?: string | null
          email?: string
          expires_at?: string
          full_name?: string
          id?: string
          invited_by?: string
          org_id?: string
          redeemed_at?: string | null
          role_ids?: string[]
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_access: {
        Row: {
          created_at: string
          created_by: string
          has_access: boolean
          id: string
          module_key: string
          org_id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          has_access?: boolean
          id?: string
          module_key: string
          org_id: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          has_access?: boolean
          id?: string
          module_key?: string
          org_id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string
          created_by: string
          feature_id: string
          id: string
          module_key: string
          org_id: string
          permissions: string[]
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          feature_id: string
          id?: string
          module_key: string
          org_id: string
          permissions?: string[]
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          feature_id?: string
          id?: string
          module_key?: string
          org_id?: string
          permissions?: string[]
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string
          id: string
          profile_id: string
          role_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          id?: string
          profile_id: string
          role_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          id?: string
          profile_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { _token: string } | { _token: string; _user_id?: string }
        Returns: string
      }
      admin_update_member_role: {
        Args: {
          _member_id: string
          _new_role: Database["public"]["Enums"]["app_role"]
          _org_id: string
        }
        Returns: boolean
      }
      can_access_donor_document: {
        Args: { file_path: string }
        Returns: boolean
      }
      count_org_users: {
        Args: { _search?: string }
        Returns: number
      }
      create_department: {
        Args: { _description?: string; _name: string }
        Returns: string
      }
      create_donor_with_details: {
        Args:
          | {
              _affiliation?: string
              _contacts?: string
              _created_by: string
              _currency?: string
              _focus_area_ids?: string[]
              _funding_periods?: string
              _name: string
              _notes?: string
              _org_id: string
              _organization_url?: string
              _status?: Database["public"]["Enums"]["donor_status"]
            }
          | {
              _affiliation?: string
              _contacts?: string
              _created_by: string
              _focus_area_ids?: string[]
              _funding_end_date?: string
              _funding_start_date?: string
              _name: string
              _notes?: string
              _org_id: string
              _organization_url?: string
            }
          | {
              _affiliation?: string
              _contacts?: string
              _created_by: string
              _focus_area_ids?: string[]
              _funding_periods?: string
              _name: string
              _notes?: string
              _org_id: string
              _organization_url?: string
              _status?: Database["public"]["Enums"]["donor_status"]
            }
        Returns: string
      }
      create_role: {
        Args: { _description?: string; _name: string }
        Returns: string
      }
      create_user_invitation: {
        Args:
          | {
              _access: Json
              _department_id: string
              _email: string
              _full_name: string
              _invited_by: string
              _org_id: string
              _role_ids: string[]
            }
          | {
              _access?: Json
              _department_id?: string
              _email: string
              _full_name: string
              _invited_by?: string
              _org_id: string
              _role_ids?: string[]
              _ttl?: unknown
            }
          | {
              _access?: Json
              _department_id?: string
              _email: string
              _full_name: string
              _role_ids?: string[]
            }
        Returns: {
          id: string
          token: string
        }[]
      }
      current_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_departments: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
        }[]
      }
      get_effective_permissions: {
        Args: { _profile_id: string }
        Returns: Json
      }
      get_last_donation_info: {
        Args: { donor_uuid: string }
        Returns: {
          amount: number
          currency: string
          donation_date: string
        }[]
      }
      get_org_member_count: {
        Args: { _org_id: string }
        Returns: number
      }
      get_org_member_list: {
        Args: { _org_id: string }
        Returns: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      get_org_modules_with_features: {
        Args: Record<PropertyKey, never>
        Returns: {
          features: Json
          module: string
          module_name: string
        }[]
      }
      get_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
        }[]
      }
      get_user_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_org_admin: {
        Args: { _org_id: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      list_org_users: {
        Args: { _page?: number; _page_size?: number; _search?: string }
        Returns: {
          department: string
          email: string
          full_name: string
          id: string
          modules: string[]
          roles: string[]
          status: Database["public"]["Enums"]["user_status"]
        }[]
      }
      org_match: {
        Args: { check_org_id: string }
        Returns: boolean
      }
      set_user_access_map: {
        Args: { _access_map: Json; _profile_id: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: {
          _feature_id?: string
          _module_key: string
          _permission?: string
          _profile_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "org_admin" | "org_member"
      donor_status: "active" | "inactive" | "potential"
      feature_permission: "read" | "write" | "admin"
      funding_cycle_status: "ongoing" | "upcoming" | "closed"
      invitation_status: "pending" | "accepted" | "rejected" | "expired"
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
      opportunity_status:
        | "To Review"
        | "In Progress"
        | "Submitted"
        | "Awarded"
        | "Declined"
      opportunity_type: "RFP" | "LOI" | "CFP"
      organization_type: "NGO" | "DONOR"
      task_priority: "low" | "medium" | "high"
      user_status: "active" | "inactive" | "deactivated"
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
      feature_permission: ["read", "write", "admin"],
      funding_cycle_status: ["ongoing", "upcoming", "closed"],
      invitation_status: ["pending", "accepted", "rejected", "expired"],
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
      opportunity_status: [
        "To Review",
        "In Progress",
        "Submitted",
        "Awarded",
        "Declined",
      ],
      opportunity_type: ["RFP", "LOI", "CFP"],
      organization_type: ["NGO", "DONOR"],
      task_priority: ["low", "medium", "high"],
      user_status: ["active", "inactive", "deactivated"],
    },
  },
} as const
