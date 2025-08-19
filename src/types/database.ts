// src/types/database.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          org_id: string;
          email: string;
          full_name: string | null;
          role: string;
          created_at: string;
          updated_at: string;
          is_super_admin: boolean;
          status: string;
          department_id: string | null;
          access_json: any;
        };
        Insert: {
          id: string;
          org_id: string;
          email: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
          is_super_admin?: boolean;
          status?: string;
          department_id?: string | null;
          access_json?: any;
        };
        Update: {
          id?: string;
          org_id?: string;
          email?: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
          is_super_admin?: boolean;
          status?: string;
          department_id?: string | null;
          access_json?: any;
        };
      };
      user_roles: {
        Row: {
          id: string;
          profile_id: string;
          role_id: string;
          assigned_by: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          role_id: string;
          assigned_by: string;
          assigned_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          role_id?: string;
          assigned_by?: string;
          assigned_at?: string;
        };
      };
      user_module_access: {
        Row: {
          id: string;
          profile_id: string;
          org_id: string;
          module_key: string;
          has_access: boolean;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          org_id: string;
          module_key: string;
          has_access?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          org_id?: string;
          module_key?: string;
          has_access?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
        };
      };
    };
    Enums: {
      user_status: 'active' | 'inactive' | 'deactivated' | 'invited';
      app_role: 'org_admin' | 'org_user' | 'super_admin';
      invitation_status: 'pending' | 'accepted' | 'expired' | 'revoked';
      feature_permission: 'read' | 'write' | 'delete' | 'manage';
    };
  };
}