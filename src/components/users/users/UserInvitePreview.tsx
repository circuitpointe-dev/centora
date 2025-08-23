// src/components/users/UserInvitePreview.tsx

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, User as UserIcon, Building2 } from "lucide-react";

import type { AddUserPayload } from "@/components/users/users/AddUserForm";
import type { ModuleKey } from "@/components/users/users/access/types";
import { MODULES, MODULE_LABEL, seedRolesByModule } from "@/components/users/users/access/constants";
import { CrudBadge } from "@/components/users/users/access/CrudBadge";

type Props = {
  invite: AddUserPayload;
  onBack: () => void;
  onConfirm: () => void;      // UI-only: parent decides what to do
  isLoading?: boolean;
};

export const UserInvitePreview: React.FC<Props> = ({ invite, onBack, onConfirm, isLoading }) => {
  // Build rows from Access map
  const rows = React.useMemo(() => {
    const enabled = MODULES
      .map(({ key }) => {
        const mod = (invite.access as any)?.[key] ?? {};
        if (!mod._module) return null;
        const roleId = typeof mod._role === "string" ? mod._role : "";
        const role = seedRolesByModule[key as ModuleKey].find(r => r.id === roleId);
        return role
          ? {
              key: key as ModuleKey,
              moduleLabel: MODULE_LABEL[key as ModuleKey],
              roleName: role.name,
              crud: role.crud,
            }
          : {
              key: key as ModuleKey,
              moduleLabel: MODULE_LABEL[key as ModuleKey],
              roleName: roleId || "—",
              crud: { create: !!mod.create, read: !!mod.read, update: !!mod.update, delete: !!mod.delete },
            };
      })
      .filter(Boolean) as Array<{ key: ModuleKey; moduleLabel: string; roleName: string; crud: { create: boolean; read: boolean; update: boolean; delete: boolean } }>;

    return enabled;
  }, [invite.access]);

  return (
    <div className="space-y-6 p-1">
      {/* Identity Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Review details</CardTitle>
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
        </CardContent>
      </Card>

      {/* Access Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Module access</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No modules enabled.</div>
          ) : (
            <div className="overflow-hidden rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[40%] py-2">Module</TableHead>
                    <TableHead className="w-[30%] py-2">Role</TableHead>
                    <TableHead className="w-[30%] py-2">CRUD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.key} className="h-10">
                      <TableCell className="py-2">
                        <div className="truncate max-w-[260px]" title={r.moduleLabel}>
                          {r.moduleLabel}
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge className="bg-gray-100 text-gray-800">
                          {r.roleName}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <CrudBadge crud={r.crud} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Optional message */}
      {invite.message?.trim() ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {invite.message}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-violet-300 text-violet-700 hover:bg-violet-50"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isLoading ? "Creating..." : "Create user"}
        </Button>
      </div>
    </div>
  );
};
