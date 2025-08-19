import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AddUserPayload } from "@/components/users/AddUserForm";
import type { Database } from "@/integrations/supabase/types";

export type CreateAndActivateInput = {
  org_id: string; // kept for call sites; not sent to RPC
} & Pick<
  AddUserPayload,
  "fullName" | "email" | "department" | "roles" | "access" | "message"
>;

// Use proper types from generated Supabase types
type CreateInviteArgs = Database['public']['Functions']['create_user_invitation']['Args'];
type CreateInviteReturns = Database['public']['Functions']['create_user_invitation']['Returns'];
type AcceptInviteArgs = Database['public']['Functions']['accept_invitation']['Args'];
type AcceptInviteReturns = Database['public']['Functions']['accept_invitation']['Returns'];

function extractToken(result: CreateInviteReturns): string | null {
  if (!result || !Array.isArray(result) || result.length === 0) return null;
  return result[0]?.token || null;
}

export function useCreateAndActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAndActivateInput) => {
      const {
        org_id,
        email,
        fullName,
        department,
        roles,
        access,
      } = input;

      // 1) Create invitation with proper types
      const createArgs: CreateInviteArgs = {
        _org_id: org_id,
        _email: email,
        _full_name: fullName,
        _department_id: department || null,
        _role_ids: roles ?? [],
        _access: access ?? {},
        _invited_by: undefined, // Let RPC use auth.uid()
      };

      const { data: inviteData, error: inviteErr } = await supabase.rpc(
        "create_user_invitation",
        createArgs
      );

      if (inviteErr) {
        throw new Error(inviteErr.message || "Failed to create invitation");
      }

      const token = extractToken(inviteData);

      if (!token) {
        throw new Error(
          "create_user_invitation did not return a token"
        );
      }

      // 2) Accept invitation with token
      const acceptArgs: AcceptInviteArgs = {
        _token: token,
      };

      const { data: acceptData, error: acceptErr } = await supabase.rpc(
        "accept_invitation", 
        acceptArgs
      );

      if (acceptErr) {
        throw new Error(acceptErr.message || "Failed to accept invitation");
      }

      return {
        invitation: inviteData,
        profile: acceptData,
      };
    },

    onSuccess: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["org-users"] }),
        queryClient.invalidateQueries({ queryKey: ["org-users-count"] }),
        queryClient.invalidateQueries({ queryKey: ["user-stats"] }),
      ]);
    },
  });
}
