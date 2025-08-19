import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AddUserPayload } from "@/components/users/AddUserForm";

export type CreateAndActivateInput = {
  org_id: string; // kept for call sites; not sent to RPC
} & Pick<
  AddUserPayload,
  "fullName" | "email" | "department" | "roles" | "access" | "message"
>;

// RPC returns can vary; be defensive
type CreateInviteReturn =
  | { token?: string; invitation_token?: string; id?: string; invitation_id?: string }
  | string
  | null;
type AcceptInviteReturn = unknown;

function extractToken(result: CreateInviteReturn): string | null {
  if (!result) return null;
  if (typeof result === "string") return result;
  return result.token || result.invitation_token || null;
}
function extractId(result: CreateInviteReturn): string | null {
  if (!result) return null;
  if (typeof result === "string") return null; // treat string as token, not id
  return result.invitation_id || result.id || null;
}

export function useCreateAndActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAndActivateInput) => {
      const {
        // org_id is intentionally unused; RPCs infer org from session
        email,
        fullName,
        department,
        roles,
        access,
        message,
      } = input;

      // 1) Create invitation (underscore param names to match your RPC)
      const { data: inviteData, error: inviteErr } = await supabase.rpc(
        "create_user_invitation",
        {
          _email: email,
          _full_name: fullName,
          _department_id: department || null,
          _role_ids: roles ?? [],
          _access: access ?? {},
          // if your RPC supports message, add it here:
          _message: message ?? null,
        } as Record<string, unknown>
      );

      if (inviteErr) {
        throw new Error(inviteErr.message || "Failed to create invitation");
      }

      const token = extractToken(inviteData as CreateInviteReturn);
      const id = extractId(inviteData as CreateInviteReturn);

      if (!token && !id) {
        throw new Error(
          "create_user_invitation did not return a token or invitation id"
        );
      }

      // 2) Accept invitation (prefer token; fall back to invitation_id)
      let acceptData: AcceptInviteReturn | null = null;
      let acceptErrMsg: string | null = null;

      if (token) {
        const { data, error } = await supabase.rpc("accept_invitation", {
          _token: token,
        });
        acceptData = data;
        acceptErrMsg = error?.message ?? null;
      } else if (id) {
        const { data, error } = await supabase.rpc("accept_invitation", {
          _invitation_id: id,
        });
        acceptData = data;
        acceptErrMsg = error?.message ?? null;
      }

      if (acceptErrMsg) {
        throw new Error(acceptErrMsg || "Failed to accept invitation");
      }

      return {
        invitation: inviteData as CreateInviteReturn,
        profile: acceptData as AcceptInviteReturn,
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
