import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRoles } from "@/hooks/useRoles";
import { useOrgModulesWithFeatures } from "@/hooks/useRoleManagement";
import { useCreateRoleRequest } from "@/hooks/useRoleRequests";
import { useAuth } from "@/contexts/AuthContext";

type RequestPayload = {
  full_name: string;
  email: string;
  requested_role_name: string;
  requested_modules: string[];
  message: string;
};

export const RolesPermissionPage: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [requestSuccess, setRequestSuccess] = useState<RequestPayload | null>(null);

  const { toast } = useToast();
  const createBtnRef = useRef<HTMLButtonElement | null>(null);
  
  // Get real data from backend
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const { data: modules = [], isLoading: modulesLoading } = useOrgModulesWithFeatures();
  const { user } = useAuth();
  const createRoleRequest = useCreateRoleRequest();

  // Set first role as default when roles load
  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  const handleCreateNewRole = () => {
    if (!user) return;
    
    const requestData = {
      requested_role: "Custom Role",
      modules: [],
      message: "Requesting permission to create custom roles for the organization."
    };
    
    createRoleRequest.mutate(requestData, {
      onSuccess: () => {
        setRequestSuccess({
          full_name: user.email,
          email: user.email,
          requested_role_name: "Custom Role",
          requested_modules: [],
          message: requestData.message
        });
      }
    });
  };

  const moduleNameById = (id: string) => modules.find((m) => m.module === id)?.module_name ?? id;

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
            <CardTitle className="text-2xl">Request sent successfully</CardTitle>
            <p className="text-sm text-gray-600">
              Your role request has been submitted and will be reviewed by an administrator. We'll get back to you
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
                onClick={() => {
                  setRequestSuccess(null);
                }}
                ref={createBtnRef}
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

  if (rolesLoading || modulesLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Roles & Permission screen
  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            View user roles and permissions across your organization&apos;s modules and features.
          </p>
        </div>
        <Button
          onClick={handleCreateNewRole}
          ref={createBtnRef}
          disabled={createRoleRequest.isPending}
          className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request New Role
        </Button>
      </div>

      {roles.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No roles found. Contact your administrator to set up roles.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Role filters */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Available Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <Card 
                  key={role.id} 
                  className={`cursor-pointer transition-all ${
                    selectedRoleId === role.id ? 'ring-2 ring-brand-purple' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-base">{role.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Module features */}
          {selectedRoleId && modules.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-medium text-gray-900">Available Modules & Features</h2>
                <div className="text-sm text-gray-500">
                  Showing features for{" "}
                  <span className="font-medium">
                    {roles.find((r) => r.id === selectedRoleId)?.name}
                  </span>
                </div>
              </div>
              
              <div className="grid gap-4">
                {modules.map((module) => (
                  <Card key={module.module}>
                    <CardHeader>
                      <CardTitle className="text-base">{module.module_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Array.isArray(module.features) && module.features.map((feature: any) => (
                          <Badge key={feature.id} variant="outline" className="justify-start">
                            {feature.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};