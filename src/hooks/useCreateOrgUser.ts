// src/hooks/useCreateOrgUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { typedSupabase } from "@/lib/superbase-client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface CreateUserPayload {
  org_id: string;
  email: string;
  full_name: string;
  department_id: string | null;
  role_ids: string[];
  access_json: Record<string, any>;
}

export const useCreateOrgUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const { data: { user: currentUser } } = await typedSupabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Check if user already exists
      const { data: existingUser } = await typedSupabase
        .from('profiles')
        .select('id')
        .eq('email', payload.email)
        .single();

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create the user account with default password
      const { data: authData, error: authError } = await typedSupabase.auth.admin.createUser({
        email: payload.email,
        password: "P@$$w0rd",
        email_confirm: true,
        user_metadata: {
          full_name: payload.full_name,
          org_id: payload.org_id,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      const userId = authData.user.id;
      const now = new Date().toISOString();

      // Create the profile
      const { error: profileError } = await typedSupabase
        .from('profiles')
        .insert({
          id: userId,
          org_id: payload.org_id,
          email: payload.email,
          full_name: payload.full_name,
          department_id: payload.department_id,
          role: 'org_user',
          status: 'active',
          access_json: payload.access_json,
          created_at: now,
          updated_at: now,
          is_super_admin: false,
        });

      if (profileError) throw profileError;

      // Link roles to user
      if (payload.role_ids.length > 0) {
        const userRoles = payload.role_ids.map(role_id => ({
          id: uuidv4(),
          profile_id: userId,
          role_id,
          assigned_by: currentUser.id,
          assigned_at: now,
        }));

        const { error: rolesError } = await typedSupabase
          .from('user_roles')
          .insert(userRoles);

        if (rolesError) throw rolesError;
      }

      // Create module access records
      const moduleAccessRecords = Object.entries(payload.access_json || {})
        .filter(([_, moduleData]) => moduleData?._module !== undefined)
        .map(([moduleKey, moduleData]) => ({
          id: uuidv4(),
          profile_id: userId,
          org_id: payload.org_id,
          module_key: moduleKey,
          has_access: Boolean(moduleData?._module),
          created_by: currentUser.id,
          created_at: now,
          updated_at: now,
        }));

      if (moduleAccessRecords.length > 0) {
        const { error: moduleAccessError } = await typedSupabase
          .from('user_module_access')
          .insert(moduleAccessRecords);

        if (moduleAccessError) throw moduleAccessError;
      }

      return userId;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully. Default password: P@$$w0rd",
      });
      queryClient.invalidateQueries({ queryKey: ['orgUsers'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};