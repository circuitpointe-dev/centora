import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Mail, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RoleCardsRow } from "./RoleCardsRow";
import { ModuleAccordion } from "./ModuleAccordion";
import { roles, modules } from "./mock/roles-permission-data";
import { CreateRoleRequestDialog } from "./CreateRoleRequestDialog";

type RequestPayload = {
  full_name: string;
  email: string;
  requested_role_name: string;
  requested_modules: string[];
  message: string;
};

type RequestListItem = RequestPayload & {
  id: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
};

export const RolesPermissionPage: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("admin");
  const [createOpen, setCreateOpen] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<RequestPayload | null>(null);
  const [myRequests, setMyRequests] = useState<RequestListItem[]>([]);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number | null>(null);

  const { toast } = useToast();
  const createBtnRef = useRef<HTMLButtonElement | null>(null);

  // Mock current user context (UI-only)
  const currentUser = { full_name: "Jane Doe", email: "jane@organization.org" };

  const handleCreateNewRole = () => setCreateOpen(true);

  const moduleNameById = (id: string) => modules.find((m) => m.id === id)?.name ?? id;

  // On "Back to Roles", return focus to the Create button
  useEffect(() => {
    if (!requestSuccess && createBtnRef.current) {
      createBtnRef.current.focus();
    }
  }, [requestSuccess]);

  // Success "page" — replaces the main content after submit
  if (requestSuccess) {
    const selectedModules =
      requestSuccess.requested_modules?.map((id) => moduleNameById(id)) ?? [];

    return (
      <div className="p-6 h-full w-full flex items-center justify-center">
        <Card className="max-w-2xl w-full shadow-xl border-brand-purple/20">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-brand-purple" />
            </div>
            <CardTitle className="text-2xl">Request sent to Centora</CardTitle>
            <p className="text-sm text-gray-600">
              Your message has been sent and will be reviewed by Centora. We’ll get back to you
              shortly at <span className="font-medium">{requestSuccess.email}</span>.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-brand-purple/5 border border-brand-purple/20 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Requested role</div>
                  <div className="font-medium">{requestSuccess.requested_role_name}</div>
                </div>
                <div>
                  <div className="text-gray-500">Contact</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 opacity-70" />
                    <span className="font-medium">{requestSuccess.full_name}</span>
                    <span className="text-gray-500">·</span>
                    <span>{requestSuccess.email}</span>
                  </div>
                </div>

                {selectedModules.length > 0 && (
                  <div className="md:col-span-2">
                    <div className="text-gray-500">Modules (optional)</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedModules.map((m) => (
                        <span
                          key={m}
                          className="px-2.5 py-1 rounded-md text-xs border border-brand-purple/30 bg-brand-purple/5"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {requestSuccess.message && (
                  <div className="md:col-span-2">
                    <div className="text-gray-500">Message</div>
                    <p className="mt-1 whitespace-pre-wrap">{requestSuccess.message}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setRequestSuccess(null);
                  setCreateOpen(true);
                }}
                className="hover:bg-brand-purple hover:text-brand-purple-foreground hover:border-brand-purple"
              >
                Submit another request
              </Button>
              <Button
                onClick={() => {
                  setRequestSuccess(null);
                }}
                ref={createBtnRef} // focus will be restored after state flips
                className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
              >
                Back to Roles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Roles & Permission screen
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Roles & Permission</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user roles and permissions across your organization&apos;s modules and features.
          </p>
        </div>
        <Button
          onClick={handleCreateNewRole}
          ref={createBtnRef}
          className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Role
        </Button>
      </div>

      {/* Role filters */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Select Role</h2>
        <RoleCardsRow
          roles={roles}
          selectedRoleId={selectedRoleId}
          onSelect={setSelectedRoleId}
        />
      </div>

      {/* Module accordion */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-gray-900">Module Features & Members</h2>
          <div className="text-sm text-gray-500">
            Showing members with{" "}
            <span className="font-medium capitalize">
              {roles.find((r) => r.id === selectedRoleId)?.name}
            </span>{" "}
            role
          </div>
        </div>
        <ModuleAccordion modules={modules} selectedRoleId={selectedRoleId} />
      </div>

      {/* Create Role Request Dialog */}
      <CreateRoleRequestDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        currentUser={currentUser}
        cooldownMs={30_000}
        lastSubmittedAt={lastSubmittedAt}
        onSuccess={(payload) => {
          // add to local "My Requests" list
          const id = crypto?.randomUUID?.() ?? String(Math.random()).slice(2);
          const createdAt = new Date().toISOString();
          setMyRequests((prev) => [
            ...prev,
            { id, createdAt, status: "pending", ...payload },
          ]);
          // cooldown timestamp & success screen
          const now = Date.now();
          setLastSubmittedAt(now);
          setRequestSuccess(payload);
          // toast confirmation
          toast({
            title: "Request sent to Centora",
            description:
              "We’ll review your request and follow up at " + payload.email + ".",
          });
        }}
      />
    </div>
  );
};
