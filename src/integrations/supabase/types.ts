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
      announcements: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          message: string
          org_id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          message: string
          org_id: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          message?: string
          org_id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_line_items: {
        Row: {
          account_id: string | null
          allocated_amount: number
          budget_id: string
          category: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          org_id: string
          remaining_amount: number | null
          spent_amount: number
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          allocated_amount: number
          budget_id: string
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          org_id: string
          remaining_amount?: number | null
          spent_amount?: number
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          allocated_amount?: number
          budget_id?: string
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          org_id?: string
          remaining_amount?: number | null
          spent_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_line_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_line_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          allocated_budget: number
          budget_name: string
          created_at: string
          created_by: string
          currency: string
          end_date: string
          fiscal_year: number
          id: string
          org_id: string
          spent_amount: number
          start_date: string
          status: string
          total_budget: number
          updated_at: string
        }
        Insert: {
          allocated_budget?: number
          budget_name: string
          created_at?: string
          created_by: string
          currency?: string
          end_date: string
          fiscal_year: number
          id?: string
          org_id: string
          spent_amount?: number
          start_date: string
          status?: string
          total_budget: number
          updated_at?: string
        }
        Update: {
          allocated_budget?: number
          budget_name?: string
          created_at?: string
          created_by?: string
          currency?: string
          end_date?: string
          fiscal_year?: number
          id?: string
          org_id?: string
          spent_amount?: number
          start_date?: string
          status?: string
          total_budget?: number
          updated_at?: string
        }
        Relationships: []
      }
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
      document_shares: {
        Row: {
          access_token: string | null
          created_at: string
          created_by: string
          document_id: string
          expires_at: string | null
          id: string
          permission_level: string
          shared_with_email: string
          shared_with_name: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          created_by: string
          document_id: string
          expires_at?: string | null
          id?: string
          permission_level?: string
          shared_with_email: string
          shared_with_name?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string
          created_by?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          permission_level?: string
          shared_with_email?: string
          shared_with_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_signatures: {
        Row: {
          created_at: string
          created_by: string
          document_id: string
          expires_at: string | null
          id: string
          signature_data: Json | null
          signed_at: string | null
          signer_email: string
          signer_name: string | null
          status: Database["public"]["Enums"]["signature_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          document_id: string
          expires_at?: string | null
          id?: string
          signature_data?: Json | null
          signed_at?: string | null
          signer_email: string
          signer_name?: string | null
          status?: Database["public"]["Enums"]["signature_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          signature_data?: Json | null
          signed_at?: string | null
          signer_email?: string
          signer_name?: string | null
          status?: Database["public"]["Enums"]["signature_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_signatures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tag_associations: {
        Row: {
          created_at: string
          document_id: string
          id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          id?: string
          tag_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_tag_associations_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_tag_associations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "document_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tags: {
        Row: {
          bg_color: string
          color: string
          created_at: string
          created_by: string
          id: string
          name: string
          org_id: string
          text_color: string
        }
        Insert: {
          bg_color?: string
          color?: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          org_id: string
          text_color?: string
        }
        Update: {
          bg_color?: string
          color?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          org_id?: string
          text_color?: string
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          changes_description: string | null
          created_at: string
          created_by: string
          document_id: string
          file_path: string
          id: string
          version: string
        }
        Insert: {
          changes_description?: string | null
          created_at?: string
          created_by: string
          document_id: string
          file_path: string
          id?: string
          version: string
        }
        Update: {
          changes_description?: string | null
          created_at?: string
          created_by?: string
          document_id?: string
          file_path?: string
          id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          created_by: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_template: boolean | null
          mime_type: string | null
          org_id: string
          status: Database["public"]["Enums"]["document_status"]
          template_category: string | null
          title: string
          updated_at: string
          updated_by: string | null
          version: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_template?: boolean | null
          mime_type?: string | null
          org_id: string
          status?: Database["public"]["Enums"]["document_status"]
          template_category?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_template?: boolean | null
          mime_type?: string | null
          org_id?: string
          status?: Database["public"]["Enums"]["document_status"]
          template_category?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      email_verifications: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          updated_at: string
          verification_code: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          updated_at?: string
          verification_code: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          updated_at?: string
          verification_code?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      esignature_fields: {
        Row: {
          created_at: string
          created_by: string
          document_id: string
          field_label: string
          field_type: string
          field_value: string | null
          height: number
          id: string
          is_required: boolean
          page_number: number
          position_x: number
          position_y: number
          updated_at: string
          width: number
        }
        Insert: {
          created_at?: string
          created_by: string
          document_id: string
          field_label: string
          field_type: string
          field_value?: string | null
          height?: number
          id?: string
          is_required?: boolean
          page_number?: number
          position_x: number
          position_y: number
          updated_at?: string
          width?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          document_id?: string
          field_label?: string
          field_type?: string
          field_value?: string | null
          height?: number
          id?: string
          is_required?: boolean
          page_number?: number
          position_x?: number
          position_y?: number
          updated_at?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "esignature_fields_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
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
      finance_team_members: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          department: string | null
          email: string
          full_name: string
          hire_date: string | null
          id: string
          org_id: string
          position: string
          salary: number | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          currency?: string
          department?: string | null
          email: string
          full_name: string
          hire_date?: string | null
          id?: string
          org_id: string
          position: string
          salary?: number | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          department?: string | null
          email?: string
          full_name?: string
          hire_date?: string | null
          id?: string
          org_id?: string
          position?: string
          salary?: number | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      financial_accounts: {
        Row: {
          account_code: string
          account_name: string
          account_type: string
          balance: number
          created_at: string
          created_by: string
          currency: string
          description: string | null
          id: string
          is_active: boolean
          org_id: string
          updated_at: string
        }
        Insert: {
          account_code: string
          account_name: string
          account_type: string
          balance?: number
          created_at?: string
          created_by: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          org_id: string
          updated_at?: string
        }
        Update: {
          account_code?: string
          account_name?: string
          account_type?: string
          balance?: number
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean
          org_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_projects: {
        Row: {
          budget_allocated: number
          budget_spent: number
          created_at: string
          created_by: string
          currency: string
          description: string | null
          end_date: string | null
          id: string
          manager_name: string | null
          org_id: string
          project_code: string
          project_name: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          budget_allocated?: number
          budget_spent?: number
          created_at?: string
          created_by: string
          currency?: string
          description?: string | null
          end_date?: string | null
          id?: string
          manager_name?: string | null
          org_id: string
          project_code: string
          project_name: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          budget_allocated?: number
          budget_spent?: number
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          end_date?: string | null
          id?: string
          manager_name?: string | null
          org_id?: string
          project_code?: string
          project_name?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_reports: {
        Row: {
          created_at: string
          created_by: string
          file_path: string | null
          generated_data: Json | null
          id: string
          org_id: string
          report_name: string
          report_period_end: string
          report_period_start: string
          report_type: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          file_path?: string | null
          generated_data?: Json | null
          id?: string
          org_id: string
          report_name: string
          report_period_end: string
          report_period_start: string
          report_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          file_path?: string | null
          generated_data?: Json | null
          id?: string
          org_id?: string
          report_name?: string
          report_period_end?: string
          report_period_start?: string
          report_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          created_by: string
          credit_account_id: string | null
          currency: string
          debit_account_id: string | null
          description: string
          id: string
          org_id: string
          project_id: string | null
          reference_number: string | null
          transaction_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          created_by: string
          credit_account_id?: string | null
          currency?: string
          debit_account_id?: string | null
          description: string
          id?: string
          org_id: string
          project_id?: string | null
          reference_number?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          created_by?: string
          credit_account_id?: string | null
          currency?: string
          debit_account_id?: string | null
          description?: string
          id?: string
          org_id?: string
          project_id?: string | null
          reference_number?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_credit_account_id_fkey"
            columns: ["credit_account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_debit_account_id_fkey"
            columns: ["debit_account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      grant_compliance: {
        Row: {
          created_at: string | null
          created_by: string
          due_date: string
          evidence_document: string | null
          grant_id: string
          id: string
          requirement: string
          status: Database["public"]["Enums"]["compliance_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          due_date: string
          evidence_document?: string | null
          grant_id: string
          id?: string
          requirement: string
          status?: Database["public"]["Enums"]["compliance_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          due_date?: string
          evidence_document?: string | null
          grant_id?: string
          id?: string
          requirement?: string
          status?: Database["public"]["Enums"]["compliance_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grant_compliance_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grant_compliance_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
        ]
      }
      grant_disbursements: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string
          currency: string
          disbursed_on: string | null
          due_date: string
          grant_id: string
          id: string
          milestone: string
          status: Database["public"]["Enums"]["disbursement_status"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by: string
          currency?: string
          disbursed_on?: string | null
          due_date: string
          grant_id: string
          id?: string
          milestone: string
          status?: Database["public"]["Enums"]["disbursement_status"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string
          currency?: string
          disbursed_on?: string | null
          due_date?: string
          grant_id?: string
          id?: string
          milestone?: string
          status?: Database["public"]["Enums"]["disbursement_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grant_disbursements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grant_disbursements_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
        ]
      }
      grant_reports: {
        Row: {
          created_at: string | null
          created_by: string
          due_date: string
          file_name: string | null
          file_path: string | null
          grant_id: string
          id: string
          report_type: string
          status: Database["public"]["Enums"]["report_status"]
          submitted: boolean | null
          submitted_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          due_date: string
          file_name?: string | null
          file_path?: string | null
          grant_id: string
          id?: string
          report_type: string
          status?: Database["public"]["Enums"]["report_status"]
          submitted?: boolean | null
          submitted_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          due_date?: string
          file_name?: string | null
          file_path?: string | null
          grant_id?: string
          id?: string
          report_type?: string
          status?: Database["public"]["Enums"]["report_status"]
          submitted?: boolean | null
          submitted_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grant_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grant_reports_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
        ]
      }
      grantee_submissions: {
        Row: {
          created_at: string | null
          created_by: string | null
          document_path: string | null
          feedback: string | null
          grant_id: string | null
          id: string
          organization_name: string
          status: string
          submission_type: string
          submitted_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          document_path?: string | null
          feedback?: string | null
          grant_id?: string | null
          id?: string
          organization_name: string
          status?: string
          submission_type: string
          submitted_date?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          document_path?: string | null
          feedback?: string | null
          grant_id?: string | null
          id?: string
          organization_name?: string
          status?: string
          submission_type?: string
          submitted_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grantee_submissions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grantee_submissions_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string
          currency: string
          description: string | null
          donor_name: string
          end_date: string
          grant_name: string
          id: string
          next_report_due: string | null
          org_id: string
          program_area: string | null
          region: string | null
          start_date: string
          status: Database["public"]["Enums"]["grant_status"]
          track_status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by: string
          currency?: string
          description?: string | null
          donor_name: string
          end_date: string
          grant_name: string
          id?: string
          next_report_due?: string | null
          org_id: string
          program_area?: string | null
          region?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["grant_status"]
          track_status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string
          currency?: string
          description?: string | null
          donor_name?: string
          end_date?: string
          grant_name?: string
          id?: string
          next_report_due?: string | null
          org_id?: string
          program_area?: string | null
          region?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["grant_status"]
          track_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grants_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grants_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_read: boolean
          message: string
          org_id: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_read?: boolean
          message: string
          org_id: string
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_read?: boolean
          message?: string
          org_id?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      policy_acknowledgments: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          document_id: string
          id: string
          ip_address: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          document_id: string
          id?: string
          ip_address?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          document_id?: string
          id?: string
          ip_address?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_policy_acknowledgments_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_acknowledgments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_documents: {
        Row: {
          acknowledgment_required: boolean | null
          created_at: string
          department: string | null
          document_id: string
          effective_date: string
          expires_date: string | null
          id: string
          policy_content: Json | null
          updated_at: string
        }
        Insert: {
          acknowledgment_required?: boolean | null
          created_at?: string
          department?: string | null
          document_id: string
          effective_date: string
          expires_date?: string | null
          id?: string
          policy_content?: Json | null
          updated_at?: string
        }
        Update: {
          acknowledgment_required?: boolean | null
          created_at?: string
          department?: string | null
          document_id?: string
          effective_date?: string
          expires_date?: string | null
          id?: string
          policy_content?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_policy_documents_document_id"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_json: Json
          avatar_url: string | null
          created_at: string
          department_id: string | null
          email: string
          full_name: string | null
          id: string
          is_super_admin: boolean
          org_id: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          access_json?: Json
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          full_name?: string | null
          id: string
          is_super_admin?: boolean
          org_id: string
          phone?: string | null
          role: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          access_json?: Json
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_super_admin?: boolean
          org_id?: string
          phone?: string | null
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
      proposal_attachments: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          proposal_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          proposal_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          proposal_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_attachments_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_comments: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          proposal_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          proposal_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          proposal_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_comments_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_team_members: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          proposal_id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          proposal_id: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          proposal_id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_team_members_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_versions: {
        Row: {
          changes_description: string | null
          created_at: string
          created_by: string
          id: string
          proposal_id: string
          version_number: string
        }
        Insert: {
          changes_description?: string | null
          created_at?: string
          created_by: string
          id?: string
          proposal_id: string
          version_number: string
        }
        Update: {
          changes_description?: string | null
          created_at?: string
          created_by?: string
          id?: string
          proposal_id?: string
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposal_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_versions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          attachments: Json | null
          budget_amount: number | null
          budget_currency: string | null
          comments: Json | null
          created_at: string
          created_by: string
          due_date: string | null
          duedate: string | null
          id: string
          logframe_fields: Json | null
          name: string
          narrative_fields: Json | null
          opportunity_id: string | null
          org_id: string
          overview_fields: Json | null
          reviewer: string | null
          status: string
          submission_status: string | null
          team: Json | null
          title: string | null
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          budget_amount?: number | null
          budget_currency?: string | null
          comments?: Json | null
          created_at?: string
          created_by: string
          due_date?: string | null
          duedate?: string | null
          id?: string
          logframe_fields?: Json | null
          name: string
          narrative_fields?: Json | null
          opportunity_id?: string | null
          org_id: string
          overview_fields?: Json | null
          reviewer?: string | null
          status?: string
          submission_status?: string | null
          team?: Json | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          budget_amount?: number | null
          budget_currency?: string | null
          comments?: Json | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          duedate?: string | null
          id?: string
          logframe_fields?: Json | null
          name?: string
          narrative_fields?: Json | null
          opportunity_id?: string | null
          org_id?: string
          overview_fields?: Json | null
          reviewer?: string | null
          status?: string
          submission_status?: string | null
          team?: Json | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
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
      role_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          modules: string[] | null
          org_id: string
          profile_id: string
          requested_role: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          modules?: string[] | null
          org_id: string
          profile_id: string
          requested_role: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          modules?: string[] | null
          org_id?: string
          profile_id?: string
          requested_role?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      submission_tracker: {
        Row: {
          completed_date: string | null
          created_at: string
          created_by: string
          due_date: string | null
          id: string
          milestone_name: string
          notes: string | null
          proposal_id: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          created_by: string
          due_date?: string | null
          id?: string
          milestone_name: string
          notes?: string | null
          proposal_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          id?: string
          milestone_name?: string
          notes?: string | null
          proposal_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_tracker_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_tracker_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
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
      admin_update_member_role: {
        Args: {
          _member_id: string
          _new_role: Database["public"]["Enums"]["app_role"]
          _org_id: string
        }
        Returns: boolean
      }
      admin_update_user: {
        Args: {
          _department_id?: string
          _full_name?: string
          _profile_id: string
          _status?: string
        }
        Returns: boolean
      }
      admin_update_user_status: {
        Args: { _profile_id: string; _status: string }
        Returns: boolean
      }
      can_access_donor_document: {
        Args: { file_path: string }
        Returns: boolean
      }
      cleanup_expired_verifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      count_org_users: {
        Args:
          | { _department?: string; _search?: string; _status?: string }
          | { _search?: string }
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
        Args: {
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
        Returns: {
          active_users: number
          deactivated_users: number
          inactive_users: number
          pending_invitations: number
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
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      list_org_users: {
        Args:
          | {
              _department?: string
              _page?: number
              _page_size?: number
              _search?: string
              _status?: string
            }
          | { _page?: number; _page_size?: number; _search?: string }
        Returns: {
          department: string
          email: string
          full_name: string
          id: string
          modules: string[]
          roles: string[]
          status: string
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
      compliance_status: "completed" | "in_progress" | "overdue"
      disbursement_status: "pending" | "released" | "cancelled"
      document_category:
        | "policies"
        | "finance"
        | "contracts"
        | "m-e"
        | "uncategorized"
        | "templates"
        | "compliance"
      document_status:
        | "draft"
        | "active"
        | "archived"
        | "expired"
        | "pending_approval"
      donor_status: "active" | "inactive" | "potential"
      feature_permission: "read" | "write" | "admin"
      funding_cycle_status: "ongoing" | "upcoming" | "closed"
      grant_status: "active" | "closed" | "pending" | "cancelled"
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
      report_status: "submitted" | "overdue" | "upcoming" | "in_progress"
      signature_status: "pending" | "signed" | "declined" | "expired"
      task_priority: "low" | "medium" | "high"
      template_status: "active" | "draft" | "archived"
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
      compliance_status: ["completed", "in_progress", "overdue"],
      disbursement_status: ["pending", "released", "cancelled"],
      document_category: [
        "policies",
        "finance",
        "contracts",
        "m-e",
        "uncategorized",
        "templates",
        "compliance",
      ],
      document_status: [
        "draft",
        "active",
        "archived",
        "expired",
        "pending_approval",
      ],
      donor_status: ["active", "inactive", "potential"],
      feature_permission: ["read", "write", "admin"],
      funding_cycle_status: ["ongoing", "upcoming", "closed"],
      grant_status: ["active", "closed", "pending", "cancelled"],
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
      report_status: ["submitted", "overdue", "upcoming", "in_progress"],
      signature_status: ["pending", "signed", "declined", "expired"],
      task_priority: ["low", "medium", "high"],
      template_status: ["active", "draft", "archived"],
      user_status: ["active", "inactive", "deactivated"],
    },
  },
} as const
