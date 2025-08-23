// src/components/users/UserInviteSuccess.tsx

import * as React from "react";
import { CheckCircle2, Mail, User as UserIcon, Building2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AddUserPayload } from "@/components/users/users/AddUserForm";
import { MODULES } from "@/components/users/users/access/constants";

type Props = {
  invite: AddUserPayload;
  onClose: () => void;
  onAddAnother: () => void;
};

export const UserInviteSuccess: React.FC<Props> = ({ invite, onClose, onAddAnother }) => {
  const enabledCount = React.useMemo(
    () =>
      MODULES.reduce((acc, m) => {
        const mod = (invite.access as any)?.[m.key];
        return acc + (mod?._module ? 1 : 0);
      }, 0),
    [invite.access]
  );

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-violet-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User created</h2>
          <p className="text-sm text-gray-500">Everything looks good. You can add another or close.</p>
        </div>
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-violet-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Full name</div>
              <div className="font-medium text-gray-900">{invite.fullName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center">
              <Mail className="h-4 w-4 text-violet-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium text-gray-900">{invite.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-violet-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Department</div>
              <div className="font-medium text-gray-900 capitalize">
                {invite.department || "—"}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center">
                <Shield className="h-4 w-4 text-violet-700" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Modules granted:</span>
                <Badge className="bg-violet-600 text-white">{enabledCount}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onAddAnother}
          className="border-violet-300 text-violet-700 hover:bg-violet-50"
        >
          Add another
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          Close
        </Button>
      </div>
    </div>
  );
};
