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
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          actor_name: string | null
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          target_user_email: string | null
          target_user_id: string | null
          target_user_name: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          target_user_email?: string | null
          target_user_id?: string | null
          target_user_name?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          target_user_email?: string | null
          target_user_id?: string | null
          target_user_name?: string | null
        }
        Relationships: []
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
      client_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          org_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          org_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          org_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_roles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          document_id: string | null
          document_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          org_id: string
          status: string
          updated_at: string
          user_agent: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          document_id?: string | null
          document_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          org_id: string
          status: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          document_id?: string | null
          document_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          org_id?: string
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_audit_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          actual_date: string | null
          carrier: string | null
          created_at: string
          delivery_notes: string | null
          delivery_number: string
          id: string
          org_id: string
          po_id: string
          received_by: string | null
          scheduled_date: string
          status: Database["public"]["Enums"]["delivery_status"]
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_date?: string | null
          carrier?: string | null
          created_at?: string
          delivery_notes?: string | null
          delivery_number: string
          id?: string
          org_id: string
          po_id: string
          received_by?: string | null
          scheduled_date: string
          status?: Database["public"]["Enums"]["delivery_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_date?: string | null
          carrier?: string | null
          created_at?: string
          delivery_notes?: string | null
          delivery_number?: string
          id?: string
          org_id?: string
          po_id?: string
          received_by?: string | null
          scheduled_date?: string
          status?: Database["public"]["Enums"]["delivery_status"]
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_items: {
        Row: {
          condition_notes: string | null
          created_at: string
          delivery_id: string
          id: string
          po_item_id: string
          quantity_received: number
        }
        Insert: {
          condition_notes?: string | null
          created_at?: string
          delivery_id: string
          id?: string
          po_item_id: string
          quantity_received?: number
        }
        Update: {
          condition_notes?: string | null
          created_at?: string
          delivery_id?: string
          id?: string
          po_item_id?: string
          quantity_received?: number
        }
        Relationships: [
          {
            foreignKeyName: "delivery_items_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_items_po_item_id_fkey"
            columns: ["po_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_order_items"
            referencedColumns: ["id"]
          },
        ]
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
      document_settings: {
        Row: {
          allow_bulk_operations: boolean
          allow_sharing: boolean
          allow_template_creation: boolean
          allowed_formats: string
          audit_logging: boolean
          auto_save: boolean
          cloud_sync: boolean
          created_at: string
          daily_backup: boolean
          default_access_level: string
          file_encryption: boolean
          id: string
          max_file_size: number
          org_id: string
          require_upload_approval: boolean
          retention_period: number
          updated_at: string
          virus_scanning: boolean
        }
        Insert: {
          allow_bulk_operations?: boolean
          allow_sharing?: boolean
          allow_template_creation?: boolean
          allowed_formats?: string
          audit_logging?: boolean
          auto_save?: boolean
          cloud_sync?: boolean
          created_at?: string
          daily_backup?: boolean
          default_access_level?: string
          file_encryption?: boolean
          id?: string
          max_file_size?: number
          org_id: string
          require_upload_approval?: boolean
          retention_period?: number
          updated_at?: string
          virus_scanning?: boolean
        }
        Update: {
          allow_bulk_operations?: boolean
          allow_sharing?: boolean
          allow_template_creation?: boolean
          allowed_formats?: string
          audit_logging?: boolean
          auto_save?: boolean
          cloud_sync?: boolean
          created_at?: string
          daily_backup?: boolean
          default_access_level?: string
          file_encryption?: boolean
          id?: string
          max_file_size?: number
          org_id?: string
          require_upload_approval?: boolean
          retention_period?: number
          updated_at?: string
          virus_scanning?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "document_settings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
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
          cover_image: string | null
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
          cover_image?: string | null
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
          cover_image?: string | null
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
      donor_compliance_issues: {
        Row: {
          created_at: string
          description: string
          due_date: string | null
          grant_id: string
          id: string
          issue_type: string
          org_id: string
          project_id: string | null
          resolution_notes: string | null
          responsible_officer: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          due_date?: string | null
          grant_id: string
          id?: string
          issue_type: string
          org_id: string
          project_id?: string | null
          resolution_notes?: string | null
          responsible_officer?: string | null
          severity: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          due_date?: string | null
          grant_id?: string
          id?: string
          issue_type?: string
          org_id?: string
          project_id?: string | null
          resolution_notes?: string | null
          responsible_officer?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_compliance_issues_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "donor_grants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donor_compliance_issues_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donor_compliance_issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "donor_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_compliance_notes: {
        Row: {
          audit_status: string
          compliance_date: string
          created_at: string
          document_id: string
          grant_id: string
          id: string
          notes: string
          org_id: string
          responsible_officer: string
          updated_at: string
        }
        Insert: {
          audit_status?: string
          compliance_date: string
          created_at?: string
          document_id: string
          grant_id: string
          id?: string
          notes: string
          org_id: string
          responsible_officer: string
          updated_at?: string
        }
        Update: {
          audit_status?: string
          compliance_date?: string
          created_at?: string
          document_id?: string
          grant_id?: string
          id?: string
          notes?: string
          org_id?: string
          responsible_officer?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_compliance_notes_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "donor_grants"
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
        Relationships: [
          {
            foreignKeyName: "donor_funding_cycles_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
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
      donor_grants: {
        Row: {
          compliance_requirements: Json | null
          created_at: string
          currency: string
          description: string | null
          donor_id: string | null
          donor_name: string
          end_date: string
          grant_amount: number
          grant_name: string
          grant_number: string
          id: string
          org_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          compliance_requirements?: Json | null
          created_at?: string
          currency?: string
          description?: string | null
          donor_id?: string | null
          donor_name: string
          end_date: string
          grant_amount?: number
          grant_name: string
          grant_number: string
          id?: string
          org_id: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          compliance_requirements?: Json | null
          created_at?: string
          currency?: string
          description?: string | null
          donor_id?: string | null
          donor_name?: string
          end_date?: string
          grant_amount?: number
          grant_name?: string
          grant_number?: string
          id?: string
          org_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_grants_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donor_grants_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      donor_projects: {
        Row: {
          budget_amount: number
          created_at: string
          description: string | null
          end_date: string
          grant_id: string
          id: string
          org_id: string
          project_code: string
          project_manager: string | null
          project_name: string
          spent_amount: number
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          budget_amount?: number
          created_at?: string
          description?: string | null
          end_date: string
          grant_id: string
          id?: string
          org_id: string
          project_code: string
          project_manager?: string | null
          project_name: string
          spent_amount?: number
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          budget_amount?: number
          created_at?: string
          description?: string | null
          end_date?: string
          grant_id?: string
          id?: string
          org_id?: string
          project_code?: string
          project_manager?: string | null
          project_name?: string
          spent_amount?: number
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_projects_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "donor_grants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donor_projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_vendor_spend: {
        Row: {
          amount_spent: number
          compliance_status: string
          created_at: string
          currency: string
          description: string | null
          id: string
          org_id: string
          project_id: string
          spend_date: string
          updated_at: string
          vendor_id: string | null
          vendor_name: string
        }
        Insert: {
          amount_spent?: number
          compliance_status?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          org_id: string
          project_id: string
          spend_date: string
          updated_at?: string
          vendor_id?: string | null
          vendor_name: string
        }
        Update: {
          amount_spent?: number
          compliance_status?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          org_id?: string
          project_id?: string
          spend_date?: string
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "donor_vendor_spend_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donor_vendor_spend_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "donor_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donor_vendor_spend_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
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
      hr_board_members: {
        Row: {
          appointment_date: string | null
          attendance_percentage: number | null
          compliance_status: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          independence: string | null
          last_name: string
          org_id: string | null
          phone: string | null
          profile_id: string | null
          role: string
          status: string | null
          tenure_years: number | null
          term_end_date: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date?: string | null
          attendance_percentage?: number | null
          compliance_status?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          independence?: string | null
          last_name: string
          org_id?: string | null
          phone?: string | null
          profile_id?: string | null
          role: string
          status?: string | null
          tenure_years?: number | null
          term_end_date?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string | null
          attendance_percentage?: number | null
          compliance_status?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          independence?: string | null
          last_name?: string
          org_id?: string | null
          phone?: string | null
          profile_id?: string | null
          role?: string
          status?: string | null
          tenure_years?: number | null
          term_end_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_board_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_committee_members: {
        Row: {
          committee_id: string | null
          id: string
          joined_date: string | null
          member_id: string | null
          role: string | null
        }
        Insert: {
          committee_id?: string | null
          id?: string
          joined_date?: string | null
          member_id?: string | null
          role?: string | null
        }
        Update: {
          committee_id?: string | null
          id?: string
          joined_date?: string | null
          member_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_hr_committee_members_committee"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "hr_committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_hr_committee_members_member"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "hr_board_members"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_committees: {
        Row: {
          chairperson_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          org_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          chairperson_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          org_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          chairperson_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          org_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_hr_committees_chairperson"
            columns: ["chairperson_id"]
            isOneToOne: false
            referencedRelation: "hr_board_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_committees_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_number: string | null
          document_type: string
          document_url: string | null
          employee_id: string | null
          expiry_date: string | null
          id: string
          is_expiring_soon: boolean | null
          issue_date: string | null
          org_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_number?: string | null
          document_type: string
          document_url?: string | null
          employee_id?: string | null
          expiry_date?: string | null
          id?: string
          is_expiring_soon?: boolean | null
          issue_date?: string | null
          org_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_number?: string | null
          document_type?: string
          document_url?: string | null
          employee_id?: string | null
          expiry_date?: string | null
          id?: string
          is_expiring_soon?: boolean | null
          issue_date?: string | null
          org_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_documents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employees: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          employee_id: string
          employment_type: string | null
          first_name: string
          hire_date: string | null
          id: string
          last_name: string
          org_id: string | null
          phone: string | null
          position: string | null
          profile_id: string | null
          status: string | null
          termination_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_id: string
          employment_type?: string | null
          first_name: string
          hire_date?: string | null
          id?: string
          last_name: string
          org_id?: string | null
          phone?: string | null
          position?: string | null
          profile_id?: string | null
          status?: string | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_id?: string
          employment_type?: string | null
          first_name?: string
          hire_date?: string | null
          id?: string
          last_name?: string
          org_id?: string | null
          phone?: string | null
          position?: string | null
          profile_id?: string | null
          status?: string | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employees_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_learning_courses: {
        Row: {
          category: string | null
          course_name: string
          course_type: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          enrollment_open: boolean | null
          id: string
          level: string | null
          org_id: string | null
          provider: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          course_name: string
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          enrollment_open?: boolean | null
          id?: string
          level?: string | null
          org_id?: string | null
          provider?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          course_name?: string
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          enrollment_open?: boolean | null
          id?: string
          level?: string | null
          org_id?: string | null
          provider?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_learning_courses_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_onboarding_checklists: {
        Row: {
          blockers: number | null
          created_at: string | null
          employee_id: string | null
          id: string
          manager: string | null
          org_id: string | null
          progress: number | null
          role: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          blockers?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          manager?: string | null
          org_id?: string | null
          progress?: number | null
          role?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          blockers?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          manager?: string | null
          org_id?: string | null
          progress?: number | null
          role?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_onboarding_checklists_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_onboarding_checklists_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_performance_goals: {
        Row: {
          company_okr: string | null
          created_at: string | null
          current_value: string | null
          cycle: string | null
          description: string | null
          employee_id: string | null
          id: string
          next_check_in: string | null
          org_id: string | null
          owner_name: string | null
          progress: number | null
          status: string | null
          target_value: string | null
          title: string
          type: string | null
          updated_at: string | null
          weight: string | null
        }
        Insert: {
          company_okr?: string | null
          created_at?: string | null
          current_value?: string | null
          cycle?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          next_check_in?: string | null
          org_id?: string | null
          owner_name?: string | null
          progress?: number | null
          status?: string | null
          target_value?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          weight?: string | null
        }
        Update: {
          company_okr?: string | null
          created_at?: string | null
          current_value?: string | null
          cycle?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          next_check_in?: string | null
          org_id?: string | null
          owner_name?: string | null
          progress?: number | null
          status?: string | null
          target_value?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_performance_goals_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_policies: {
        Row: {
          category: string | null
          created_at: string | null
          document_url: string | null
          id: string
          org_id: string | null
          title: string
          updated_at: string | null
          updated_at_date: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          document_url?: string | null
          id?: string
          org_id?: string | null
          title: string
          updated_at?: string | null
          updated_at_date?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          document_url?: string | null
          id?: string
          org_id?: string | null
          title?: string
          updated_at?: string | null
          updated_at_date?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_policies_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_policy_acknowledgments: {
        Row: {
          acknowledged_at: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          last_reminded_at: string | null
          org_id: string | null
          policy_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          last_reminded_at?: string | null
          org_id?: string | null
          policy_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          last_reminded_at?: string | null
          org_id?: string | null
          policy_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_policy_acknowledgments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_policy_acknowledgments_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "hr_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_reference_check_details: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          rating: number | null
          received_date: string | null
          referee_company: string | null
          referee_email: string | null
          referee_name: string
          referee_phone: string | null
          referee_relationship: string | null
          reference_check_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          received_date?: string | null
          referee_company?: string | null
          referee_email?: string | null
          referee_name: string
          referee_phone?: string | null
          referee_relationship?: string | null
          reference_check_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          received_date?: string | null
          referee_company?: string | null
          referee_email?: string | null
          referee_name?: string
          referee_phone?: string | null
          referee_relationship?: string | null
          reference_check_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_hr_reference_check_details_ref"
            columns: ["reference_check_id"]
            isOneToOne: false
            referencedRelation: "hr_reference_checks"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_reference_checks: {
        Row: {
          application_id: string | null
          candidate_email: string
          candidate_name: string
          created_at: string | null
          department: string | null
          flags: number | null
          id: string
          org_id: string | null
          refs_received: number | null
          refs_verified: number | null
          requisition: string | null
          status: string | null
          total_refs_requested: number | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          candidate_email: string
          candidate_name: string
          created_at?: string | null
          department?: string | null
          flags?: number | null
          id?: string
          org_id?: string | null
          refs_received?: number | null
          refs_verified?: number | null
          requisition?: string | null
          status?: string | null
          total_refs_requested?: number | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          candidate_email?: string
          candidate_name?: string
          created_at?: string | null
          department?: string | null
          flags?: number | null
          id?: string
          org_id?: string | null
          refs_received?: number | null
          refs_verified?: number | null
          requisition?: string | null
          status?: string | null
          total_refs_requested?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_reference_checks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_salary_benchmarks: {
        Row: {
          created_at: string | null
          id: string
          internal_band: string | null
          location: string | null
          market_p25: string | null
          market_p50: string | null
          market_p75: string | null
          org_id: string | null
          role_level: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          internal_band?: string | null
          location?: string | null
          market_p25?: string | null
          market_p50?: string | null
          market_p75?: string | null
          org_id?: string | null
          role_level: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          internal_band?: string | null
          location?: string | null
          market_p25?: string | null
          market_p50?: string | null
          market_p75?: string | null
          org_id?: string | null
          role_level?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_salary_benchmarks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_salary_simulations: {
        Row: {
          compa_ratio: number | null
          created_at: string | null
          current_salary: number | null
          employee_id: string | null
          id: string
          internal_band: string | null
          location: string | null
          market_p50: string | null
          org_id: string | null
          proposed_salary: number | null
          role_level: string | null
        }
        Insert: {
          compa_ratio?: number | null
          created_at?: string | null
          current_salary?: number | null
          employee_id?: string | null
          id?: string
          internal_band?: string | null
          location?: string | null
          market_p50?: string | null
          org_id?: string | null
          proposed_salary?: number | null
          role_level?: string | null
        }
        Update: {
          compa_ratio?: number | null
          created_at?: string | null
          current_salary?: number | null
          employee_id?: string | null
          id?: string
          internal_band?: string | null
          location?: string | null
          market_p50?: string | null
          org_id?: string | null
          proposed_salary?: number | null
          role_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_salary_simulations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_salary_simulations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_training_records: {
        Row: {
          certificate_url: string | null
          completion_percentage: number | null
          completion_status: string | null
          created_at: string | null
          employee_id: string | null
          end_date: string | null
          id: string
          org_id: string | null
          provider: string | null
          start_date: string | null
          training_name: string
          training_type: string | null
          updated_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          completion_percentage?: number | null
          completion_status?: string | null
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          org_id?: string | null
          provider?: string | null
          start_date?: string | null
          training_name: string
          training_type?: string | null
          updated_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          completion_percentage?: number | null
          completion_status?: string | null
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          org_id?: string | null
          provider?: string | null
          start_date?: string | null
          training_name?: string
          training_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_training_records_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_volunteers: {
        Row: {
          assignments_count: number | null
          availability: string[] | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          join_date: string | null
          last_name: string
          org_id: string | null
          phone: string | null
          profile_id: string | null
          skills: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assignments_count?: number | null
          availability?: string[] | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          join_date?: string | null
          last_name: string
          org_id?: string | null
          phone?: string | null
          profile_id?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assignments_count?: number | null
          availability?: string[] | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          join_date?: string | null
          last_name?: string
          org_id?: string | null
          phone?: string | null
          profile_id?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_volunteers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          org_id: string
          paid_amount: number | null
          payment_terms: number | null
          po_id: string | null
          remaining_amount: number | null
          status: Database["public"]["Enums"]["invoice_status"]
          total_amount: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          currency?: string
          due_date: string
          id?: string
          invoice_date: string
          invoice_number: string
          notes?: string | null
          org_id: string
          paid_amount?: number | null
          payment_terms?: number | null
          po_id?: string | null
          remaining_amount?: number | null
          status?: Database["public"]["Enums"]["invoice_status"]
          total_amount: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          org_id?: string
          paid_amount?: number | null
          payment_terms?: number | null
          po_id?: string | null
          remaining_amount?: number | null
          status?: Database["public"]["Enums"]["invoice_status"]
          total_amount?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
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
      procurement_approval_rules: {
        Row: {
          approver_sequence: string[] | null
          condition: string | null
          created_at: string
          entity_type: string
          escalation_sla: string | null
          id: string
          org_id: string
          rule_code: string
          status: string | null
          updated_at: string
        }
        Insert: {
          approver_sequence?: string[] | null
          condition?: string | null
          created_at?: string
          entity_type: string
          escalation_sla?: string | null
          id?: string
          org_id: string
          rule_code: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          approver_sequence?: string[] | null
          condition?: string | null
          created_at?: string
          entity_type?: string
          escalation_sla?: string | null
          id?: string
          org_id?: string
          rule_code?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      procurement_approvals: {
        Row: {
          amount: number
          approval_comment: string | null
          approved_at: string | null
          approved_by: string | null
          attachments: string[] | null
          created_at: string | null
          currency: string
          date_submitted: string
          department: string | null
          description: string
          display_id: string
          due_date: string | null
          id: string
          org_id: string
          priority: string
          rejection_reason: string | null
          requestor_id: string
          requestor_name: string
          risk_level: string
          status: string
          type: string
          updated_at: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          approval_comment?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attachments?: string[] | null
          created_at?: string | null
          currency?: string
          date_submitted?: string
          department?: string | null
          description: string
          display_id: string
          due_date?: string | null
          id?: string
          org_id: string
          priority?: string
          rejection_reason?: string | null
          requestor_id: string
          requestor_name: string
          risk_level: string
          status?: string
          type: string
          updated_at?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          approval_comment?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attachments?: string[] | null
          created_at?: string | null
          currency?: string
          date_submitted?: string
          department?: string | null
          description?: string
          display_id?: string
          due_date?: string | null
          id?: string
          org_id?: string
          priority?: string
          rejection_reason?: string | null
          requestor_id?: string
          requestor_name?: string
          risk_level?: string
          status?: string
          type?: string
          updated_at?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procurement_approvals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurement_approvals_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurement_approvals_requestor_id_fkey"
            columns: ["requestor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_deliveries: {
        Row: {
          amount: number | null
          attachments: string[] | null
          confirmed_at: string | null
          confirmed_by: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          created_by: string
          currency: string
          delivery_address: string | null
          delivery_date: string
          description: string | null
          expected_date: string | null
          id: string
          notes: string | null
          org_id: string
          po_number: string | null
          priority: string
          reference: string
          status: string
          tracking_number: string | null
          updated_at: string
          vendor_name: string
        }
        Insert: {
          amount?: number | null
          attachments?: string[] | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by: string
          currency?: string
          delivery_address?: string | null
          delivery_date: string
          description?: string | null
          expected_date?: string | null
          id?: string
          notes?: string | null
          org_id: string
          po_number?: string | null
          priority?: string
          reference: string
          status?: string
          tracking_number?: string | null
          updated_at?: string
          vendor_name: string
        }
        Update: {
          amount?: number | null
          attachments?: string[] | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          delivery_address?: string | null
          delivery_date?: string
          description?: string | null
          expected_date?: string | null
          id?: string
          notes?: string | null
          org_id?: string
          po_number?: string | null
          priority?: string
          reference?: string
          status?: string
          tracking_number?: string | null
          updated_at?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "procurement_deliveries_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurement_deliveries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurement_deliveries_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_documents: {
        Row: {
          amount: number | null
          archived_at: string | null
          archived_by: string | null
          created_at: string
          currency: string | null
          description: string | null
          document_date: string | null
          document_number: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number
          fiscal_year: string | null
          id: string
          mime_type: string
          org_id: string
          project_name: string | null
          status: Database["public"]["Enums"]["document_status"]
          title: string
          updated_at: string
          uploaded_at: string
          uploaded_by: string
          vendor_name: string | null
        }
        Insert: {
          amount?: number | null
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          document_date?: string | null
          document_number?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number
          fiscal_year?: string | null
          id?: string
          mime_type: string
          org_id: string
          project_name?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          title: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
          vendor_name?: string | null
        }
        Update: {
          amount?: number | null
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          document_date?: string | null
          document_number?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number
          fiscal_year?: string | null
          id?: string
          mime_type?: string
          org_id?: string
          project_name?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          title?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procurement_documents_archived_by_fkey"
            columns: ["archived_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurement_documents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurement_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_plan_items: {
        Row: {
          budget_source: string | null
          created_at: string
          description: string | null
          est_cost: number | null
          id: string
          item: string
          org_id: string
          plan_id: string | null
          planned_date: string | null
          status: string | null
        }
        Insert: {
          budget_source?: string | null
          created_at?: string
          description?: string | null
          est_cost?: number | null
          id?: string
          item: string
          org_id: string
          plan_id?: string | null
          planned_date?: string | null
          status?: string | null
        }
        Update: {
          budget_source?: string | null
          created_at?: string
          description?: string | null
          est_cost?: number | null
          id?: string
          item?: string
          org_id?: string
          plan_id?: string | null
          planned_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procurement_plan_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "procurement_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_plans: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          org_id: string
          pending_items: number | null
          title: string
          total_items: number | null
          total_planned_spend: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          org_id: string
          pending_items?: number | null
          title: string
          total_items?: number | null
          total_planned_spend?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          org_id?: string
          pending_items?: number | null
          title?: string
          total_items?: number | null
          total_planned_spend?: number | null
        }
        Relationships: []
      }
      procurement_requisition_activity: {
        Row: {
          created_at: string
          event: string
          id: string
          org_id: string
          requisition_id: string
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          org_id: string
          requisition_id: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          org_id?: string
          requisition_id?: string
        }
        Relationships: []
      }
      procurement_requisition_documents: {
        Row: {
          created_at: string
          id: string
          org_id: string
          requisition_id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          requisition_id: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          requisition_id?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      procurement_requisition_workflow: {
        Row: {
          acted_at: string | null
          created_at: string
          id: string
          label: string
          org_id: string
          requisition_id: string
          sequence: number
          status: string
        }
        Insert: {
          acted_at?: string | null
          created_at?: string
          id?: string
          label: string
          org_id: string
          requisition_id: string
          sequence: number
          status?: string
        }
        Update: {
          acted_at?: string | null
          created_at?: string
          id?: string
          label?: string
          org_id?: string
          requisition_id?: string
          sequence?: number
          status?: string
        }
        Relationships: []
      }
      procurement_requisitions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachments: string[] | null
          budget_source: string | null
          category: string | null
          created_at: string
          currency: string
          date_submitted: string
          department: string | null
          description: string | null
          due_date: string | null
          estimated_cost: number
          id: string
          item_name: string
          justification: string | null
          notes: string | null
          org_id: string
          priority: string
          quantity: number
          req_id: string
          requested_by: string
          status: string
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attachments?: string[] | null
          budget_source?: string | null
          category?: string | null
          created_at?: string
          currency?: string
          date_submitted?: string
          department?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost: number
          id?: string
          item_name: string
          justification?: string | null
          notes?: string | null
          org_id: string
          priority?: string
          quantity: number
          req_id: string
          requested_by: string
          status?: string
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attachments?: string[] | null
          budget_source?: string | null
          category?: string | null
          created_at?: string
          currency?: string
          date_submitted?: string
          department?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number
          id?: string
          item_name?: string
          justification?: string | null
          notes?: string | null
          org_id?: string
          priority?: string
          quantity?: number
          req_id?: string
          requested_by?: string
          status?: string
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procurement_requisitions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          activities: Json | null
          attachments: Json | null
          budget_amount: number | null
          budget_currency: string | null
          budget_narrative: string | null
          comments: Json | null
          content: Json | null
          cover_image: string | null
          created_at: string
          created_by: string
          due_date: string | null
          duedate: string | null
          executive_summary: string | null
          id: string
          logframe_fields: Json | null
          methodology: string | null
          monitoring_evaluation: string | null
          name: string
          narrative_fields: Json | null
          objectives: Json | null
          opportunity_id: string | null
          org_id: string
          overview_fields: Json | null
          problem_statement: string | null
          reviewer: string | null
          risks_mitigation: string | null
          status: string
          submission_status: string | null
          sustainability: string | null
          team: Json | null
          title: string | null
          updated_at: string
        }
        Insert: {
          activities?: Json | null
          attachments?: Json | null
          budget_amount?: number | null
          budget_currency?: string | null
          budget_narrative?: string | null
          comments?: Json | null
          content?: Json | null
          cover_image?: string | null
          created_at?: string
          created_by: string
          due_date?: string | null
          duedate?: string | null
          executive_summary?: string | null
          id?: string
          logframe_fields?: Json | null
          methodology?: string | null
          monitoring_evaluation?: string | null
          name: string
          narrative_fields?: Json | null
          objectives?: Json | null
          opportunity_id?: string | null
          org_id: string
          overview_fields?: Json | null
          problem_statement?: string | null
          reviewer?: string | null
          risks_mitigation?: string | null
          status?: string
          submission_status?: string | null
          sustainability?: string | null
          team?: Json | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          activities?: Json | null
          attachments?: Json | null
          budget_amount?: number | null
          budget_currency?: string | null
          budget_narrative?: string | null
          comments?: Json | null
          content?: Json | null
          cover_image?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          duedate?: string | null
          executive_summary?: string | null
          id?: string
          logframe_fields?: Json | null
          methodology?: string | null
          monitoring_evaluation?: string | null
          name?: string
          narrative_fields?: Json | null
          objectives?: Json | null
          opportunity_id?: string | null
          org_id?: string
          overview_fields?: Json | null
          problem_statement?: string | null
          reviewer?: string | null
          risks_mitigation?: string | null
          status?: string
          submission_status?: string | null
          sustainability?: string | null
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
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          item_description: string
          po_id: string
          quantity: number
          received_quantity: number | null
          specifications: string | null
          total_price: number | null
          unit_of_measure: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_description: string
          po_id: string
          quantity?: number
          received_quantity?: number | null
          specifications?: string | null
          total_price?: number | null
          unit_of_measure?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          item_description?: string
          po_id?: string
          quantity?: number
          received_quantity?: number | null
          specifications?: string | null
          total_price?: number | null
          unit_of_measure?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery_date: string | null
          approved_by: string | null
          created_at: string
          created_by: string
          currency: string
          description: string | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          org_id: string
          po_date: string
          po_number: string
          priority: Database["public"]["Enums"]["priority_level"]
          requisition_id: string | null
          status: Database["public"]["Enums"]["po_status"]
          terms_and_conditions: string | null
          title: string
          total_amount: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          actual_delivery_date?: string | null
          approved_by?: string | null
          created_at?: string
          created_by: string
          currency?: string
          description?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          org_id: string
          po_date?: string
          po_number: string
          priority?: Database["public"]["Enums"]["priority_level"]
          requisition_id?: string | null
          status?: Database["public"]["Enums"]["po_status"]
          terms_and_conditions?: string | null
          title: string
          total_amount?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          actual_delivery_date?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          description?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          org_id?: string
          po_date?: string
          po_number?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          requisition_id?: string | null
          status?: Database["public"]["Enums"]["po_status"]
          terms_and_conditions?: string | null
          title?: string
          total_amount?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_requisition_id_fkey"
            columns: ["requisition_id"]
            isOneToOne: false
            referencedRelation: "requisitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      requisition_items: {
        Row: {
          created_at: string
          id: string
          item_description: string
          quantity: number
          requisition_id: string
          specifications: string | null
          total_price: number | null
          unit_of_measure: string | null
          unit_price: number
          vendor_suggestions: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_description: string
          quantity?: number
          requisition_id: string
          specifications?: string | null
          total_price?: number | null
          unit_of_measure?: string | null
          unit_price: number
          vendor_suggestions?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_description?: string
          quantity?: number
          requisition_id?: string
          specifications?: string | null
          total_price?: number | null
          unit_of_measure?: string | null
          unit_price?: number
          vendor_suggestions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requisition_items_requisition_id_fkey"
            columns: ["requisition_id"]
            isOneToOne: false
            referencedRelation: "requisitions"
            referencedColumns: ["id"]
          },
        ]
      }
      requisitions: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          created_at: string
          currency: string
          department: string | null
          description: string | null
          id: string
          notes: string | null
          org_id: string
          priority: Database["public"]["Enums"]["priority_level"]
          requested_by: string
          requested_date: string
          required_date: string | null
          requisition_number: string
          status: Database["public"]["Enums"]["requisition_status"]
          title: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          currency?: string
          department?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          org_id: string
          priority?: Database["public"]["Enums"]["priority_level"]
          requested_by: string
          requested_date?: string
          required_date?: string | null
          requisition_number: string
          status?: Database["public"]["Enums"]["requisition_status"]
          title: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          currency?: string
          department?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          org_id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          requested_by?: string
          requested_date?: string
          required_date?: string | null
          requisition_number?: string
          status?: Database["public"]["Enums"]["requisition_status"]
          title?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requisitions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisitions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisitions_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      spend_analysis_categories: {
        Row: {
          budget_amount: number
          category_name: string
          created_at: string
          id: string
          org_id: string
          period_end: string
          period_start: string
          spent_amount: number
          updated_at: string
        }
        Insert: {
          budget_amount?: number
          category_name: string
          created_at?: string
          id?: string
          org_id: string
          period_end: string
          period_start: string
          spent_amount?: number
          updated_at?: string
        }
        Update: {
          budget_amount?: number
          category_name?: string
          created_at?: string
          id?: string
          org_id?: string
          period_end?: string
          period_start?: string
          spent_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spend_analysis_categories_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      spend_analysis_periods: {
        Row: {
          created_at: string
          growth_percentage: number
          id: string
          org_id: string
          period_end: string
          period_name: string
          period_start: string
          previous_period_spend: number
          total_spend: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          growth_percentage?: number
          id?: string
          org_id: string
          period_end: string
          period_name: string
          period_start: string
          previous_period_spend?: number
          total_spend?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          growth_percentage?: number
          id?: string
          org_id?: string
          period_end?: string
          period_name?: string
          period_start?: string
          previous_period_spend?: number
          total_spend?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spend_analysis_periods_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      spend_analysis_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          department: string | null
          description: string | null
          id: string
          org_id: string
          project_id: string | null
          status: string
          transaction_date: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          currency?: string
          department?: string | null
          description?: string | null
          id?: string
          org_id: string
          project_id?: string | null
          status?: string
          transaction_date: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          department?: string | null
          description?: string | null
          id?: string
          org_id?: string
          project_id?: string | null
          status?: string
          transaction_date?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spend_analysis_transactions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spend_analysis_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "spend_analysis_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      spend_analysis_vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          last_transaction_date: string | null
          org_id: string
          phone: string | null
          status: string
          total_spend: number
          updated_at: string
          vendor_code: string
          vendor_name: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_transaction_date?: string | null
          org_id: string
          phone?: string | null
          status?: string
          total_spend?: number
          updated_at?: string
          vendor_code: string
          vendor_name: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_transaction_date?: string | null
          org_id?: string
          phone?: string | null
          status?: string
          total_spend?: number
          updated_at?: string
          vendor_code?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "spend_analysis_vendors_org_id_fkey"
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
      system_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
      vendor_contracts: {
        Row: {
          contract_code: string
          created_at: string
          currency: string | null
          end_date: string | null
          id: string
          org_id: string
          start_date: string | null
          status: string | null
          terms: string | null
          title: string
          updated_at: string
          value: number | null
          vendor_id: string
        }
        Insert: {
          contract_code: string
          created_at?: string
          currency?: string | null
          end_date?: string | null
          id?: string
          org_id: string
          start_date?: string | null
          status?: string | null
          terms?: string | null
          title: string
          updated_at?: string
          value?: number | null
          vendor_id: string
        }
        Update: {
          contract_code?: string
          created_at?: string
          currency?: string | null
          end_date?: string | null
          id?: string
          org_id?: string
          start_date?: string | null
          status?: string | null
          terms?: string | null
          title?: string
          updated_at?: string
          value?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_contracts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_documents: {
        Row: {
          expires_at: string | null
          id: string
          org_id: string
          status: string | null
          title: string
          type: string | null
          uploaded_at: string
          url: string
          vendor_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          org_id: string
          status?: string | null
          title: string
          type?: string | null
          uploaded_at?: string
          url: string
          vendor_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          org_id?: string
          status?: string | null
          title?: string
          type?: string | null
          uploaded_at?: string
          url?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_performance: {
        Row: {
          cost_score: number | null
          created_at: string
          delivery_score: number | null
          id: string
          notes: string | null
          org_id: string
          overall_score: number | null
          period_end: string
          period_start: string
          quality_score: number | null
          vendor_id: string
        }
        Insert: {
          cost_score?: number | null
          created_at?: string
          delivery_score?: number | null
          id?: string
          notes?: string | null
          org_id: string
          overall_score?: number | null
          period_end: string
          period_start: string
          quality_score?: number | null
          vendor_id: string
        }
        Update: {
          cost_score?: number | null
          created_at?: string
          delivery_score?: number | null
          id?: string
          notes?: string | null
          org_id?: string
          overall_score?: number | null
          period_end?: string
          period_start?: string
          quality_score?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_performance_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string | null
          country: string | null
          created_at: string
          created_by: string
          currency: string
          email: string | null
          id: string
          is_active: boolean
          notes: string | null
          org_id: string
          payment_terms: number | null
          phone: string | null
          postal_code: string | null
          rating: number | null
          state: string | null
          tax_id: string | null
          updated_at: string
          vendor_name: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by: string
          currency?: string
          email?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          org_id: string
          payment_terms?: number | null
          phone?: string | null
          postal_code?: string | null
          rating?: number | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          vendor_name: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          email?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          org_id?: string
          payment_terms?: number | null
          phone?: string | null
          postal_code?: string | null
          rating?: number | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_org_id_fkey"
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
      cleanup_expired_verifications: { Args: never; Returns: undefined }
      count_org_users:
        | { Args: { _search?: string }; Returns: number }
        | {
            Args: { _department?: string; _search?: string; _status?: string }
            Returns: number
          }
      create_department: {
        Args: { _description?: string; _name: string }
        Returns: string
      }
      create_donor_with_details:
        | {
            Args: {
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
            Returns: string
          }
        | {
            Args: {
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
            Returns: string
          }
        | {
            Args: {
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
      current_org_id: { Args: never; Returns: string }
      generate_procurement_display_id: { Args: never; Returns: string }
      get_departments: {
        Args: never
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
      get_org_member_count: { Args: { _org_id: string }; Returns: number }
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
        Args: never
        Returns: {
          features: Json
          module: string
          module_name: string
        }[]
      }
      get_roles: {
        Args: never
        Returns: {
          created_at: string
          description: string
          id: string
          name: string
        }[]
      }
      get_user_org_id: { Args: { _user_id: string }; Returns: string }
      get_user_stats: {
        Args: never
        Returns: {
          active_users: number
          deactivated_users: number
          inactive_users: number
          pending_invitations: number
        }[]
      }
      is_org_admin: { Args: { _org_id: string }; Returns: boolean }
      is_org_member: { Args: { _org_id: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      is_user_org_admin: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_user_super_admin: { Args: { _user_id: string }; Returns: boolean }
      list_org_users:
        | {
            Args: { _page?: number; _page_size?: number; _search?: string }
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
        | {
            Args: {
              _department?: string
              _page?: number
              _page_size?: number
              _search?: string
              _status?: string
            }
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
      org_match: { Args: { check_org_id: string }; Returns: boolean }
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
      delivery_status:
        | "scheduled"
        | "in_transit"
        | "delivered"
        | "overdue"
        | "cancelled"
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
      document_type:
        | "Contract"
        | "Invoice"
        | "GRN"
        | "PO"
        | "Tender"
        | "Quote"
        | "Compliance"
        | "Receipt"
        | "Other"
      donor_status: "active" | "inactive" | "potential"
      feature_permission: "read" | "write" | "admin"
      funding_cycle_status: "ongoing" | "upcoming" | "closed"
      grant_status: "active" | "closed" | "pending" | "cancelled"
      invitation_status: "pending" | "accepted" | "rejected" | "expired"
      invoice_status:
        | "draft"
        | "pending"
        | "approved"
        | "paid"
        | "rejected"
        | "overdue"
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
      po_status:
        | "draft"
        | "sent"
        | "acknowledged"
        | "partially_received"
        | "received"
        | "cancelled"
      priority_level: "low" | "medium" | "high" | "urgent"
      procurement_document_status: "active" | "archived" | "expired" | "draft"
      procurement_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "rejected"
        | "in_progress"
        | "completed"
        | "cancelled"
      report_status: "submitted" | "overdue" | "upcoming" | "in_progress"
      requisition_status:
        | "draft"
        | "submitted"
        | "approved"
        | "rejected"
        | "in_progress"
        | "completed"
        | "cancelled"
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
      delivery_status: [
        "scheduled",
        "in_transit",
        "delivered",
        "overdue",
        "cancelled",
      ],
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
      document_type: [
        "Contract",
        "Invoice",
        "GRN",
        "PO",
        "Tender",
        "Quote",
        "Compliance",
        "Receipt",
        "Other",
      ],
      donor_status: ["active", "inactive", "potential"],
      feature_permission: ["read", "write", "admin"],
      funding_cycle_status: ["ongoing", "upcoming", "closed"],
      grant_status: ["active", "closed", "pending", "cancelled"],
      invitation_status: ["pending", "accepted", "rejected", "expired"],
      invoice_status: [
        "draft",
        "pending",
        "approved",
        "paid",
        "rejected",
        "overdue",
      ],
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
      po_status: [
        "draft",
        "sent",
        "acknowledged",
        "partially_received",
        "received",
        "cancelled",
      ],
      priority_level: ["low", "medium", "high", "urgent"],
      procurement_document_status: ["active", "archived", "expired", "draft"],
      procurement_status: [
        "draft",
        "pending_approval",
        "approved",
        "rejected",
        "in_progress",
        "completed",
        "cancelled",
      ],
      report_status: ["submitted", "overdue", "upcoming", "in_progress"],
      requisition_status: [
        "draft",
        "submitted",
        "approved",
        "rejected",
        "in_progress",
        "completed",
        "cancelled",
      ],
      signature_status: ["pending", "signed", "declined", "expired"],
      task_priority: ["low", "medium", "high"],
      template_status: ["active", "draft", "archived"],
      user_status: ["active", "inactive", "deactivated"],
    },
  },
} as const
