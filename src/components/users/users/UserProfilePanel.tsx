// src/components/users/UserProfilePanel.tsx

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DepartmentSelect } from "@/components/users/users/DepartmentSelect";
import { Users as UsersIcon, Mail, Building2, Shield } from "lucide-react";
import { useUpdateUser } from "@/hooks/useUsers";
import { useDepartments } from "@/hooks/useDepartments";

type Mode = "view" | "edit";

interface UserProfilePanelProps {
  mode: Mode;
  user: {
    id: string;
    full_name: string;
    email: string;
    status: "active" | "inactive" | "deactivated";
    department: string;
    modules: string[];
    roles: string[];
  };
  onClose: () => void;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ mode, user, onClose }) => {
  const updateUserMutation = useUpdateUser();
  const [editing, setEditing] = React.useState(mode === "edit");

const { data: departments = [] } = useDepartments();

const [fullName, setFullName] = React.useState(user.full_name);
const [email] = React.useState(user.email);
const [departmentId, setDepartmentId] = React.useState<string>((user as any).department_id || "");
const [status, setStatus] = React.useState<UserProfilePanelProps["user"]["status"]>(user.status);

React.useEffect(() => {
  if (!departmentId && user.department && departments.length) {
    const match = departments.find((d) => d.name === user.department);
    if (match) setDepartmentId(match.id);
  }
}, [departmentId, user.department, departments]);

  const save = () => {
    updateUserMutation.mutate({
      userId: user.id,
      data: {
        full_name: fullName.trim(),
        status,
        department_id: departmentId || undefined,
      }
    });
    onClose();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Identity card */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-violet-700" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-gray-500">Full name</div>
              {!editing ? (
                <div className="font-medium text-gray-900 truncate">{user.full_name}</div>
              ) : (
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Mail className="h-5 w-5 text-violet-700" />
            </div>
            <div className="min-w-0">
              <div className="text-sm text-gray-500">Email</div>
              {!editing ? (
                <div className="font-medium text-gray-900 truncate">{user.email}</div>
              ) : (
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="mt-1 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-violet-700" />
            </div>
            <div className="w-full">
              <div className="text-sm text-gray-500">Department</div>
              {!editing ? (
                <div className="font-medium text-gray-900">{user.department}</div>
              ) : (
                <DepartmentSelect
                  value={departmentId}
                  onChange={setDepartmentId}
                />
              )}
            </div>
          </div>

          <div className="md:col-span-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-violet-700" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Status:</span>
              {!editing ? (
                <Badge
                  variant="outline"
                  className={`border-0 capitalize ${
                    status === "active"
                      ? "text-green-600 bg-green-50"
                      : status === "inactive"
                      ? "text-orange-600 bg-orange-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {status}
                </Badge>
              ) : (
                <div className="flex gap-2">
                  {(["active", "inactive", "deactivated"] as const).map((s) => (
                    <Button
                      key={s}
                      type="button"
                      variant={status === s ? "default" : "outline"}
                      className={
                        status === s
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "border-violet-300 text-violet-700 hover:bg-violet-50"
                      }
                      onClick={() => setStatus(s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules & Roles (read-only for now) */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-2">Access summary</div>
          <div className="flex flex-wrap gap-2">
            {user.modules.length ? (
              user.modules.map((m) => (
                <Badge key={m} variant="outline" className="text-xs">
                  {m}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400">No modules</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!editing ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="border-violet-300 text-violet-700 hover:bg-violet-50"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              className="border-violet-300 text-violet-700 hover:bg-violet-50"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={save}
            >
              Save changes
            </Button>
          </>
        )}
      </div>
    </div>
  );
};