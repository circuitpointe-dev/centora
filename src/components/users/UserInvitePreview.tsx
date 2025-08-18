// src/components/users/UserInvitePreview.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { AddUserPayload } from "./AddUserForm";
import { useDepartments } from "@/hooks/useDepartments";
import { useRoles } from "@/hooks/useRoles";
import { useOrgModulesWithFeatures } from "@/hooks/useOrgModulesWithFeatures";

export const UserInvitePreview: React.FC<{
  invite: AddUserPayload;
  onBack: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}> = ({ invite, onBack, onConfirm, isLoading = false }) => {
  const { data: departments = [] } = useDepartments();
  const { data: roles = [] } = useRoles();
  const { data: modules = [] } = useOrgModulesWithFeatures();

  // Get department and role names from IDs
  const departmentName = departments.find(d => d.id === invite.department)?.name || invite.department;
  const roleNames = invite.roles.map(roleId => 
    roles.find(r => r.id === roleId)?.name || roleId
  );

  // Get module names for access summary
  const accessModules = Object.keys(invite.access || {});

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">User Info</h3>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div><strong className="text-gray-700">Name:</strong> {invite.fullName}</div>
          <div><strong className="text-gray-700">Email:</strong> {invite.email}</div>
          <div><strong className="text-gray-700">Department:</strong> {departmentName}</div>
          <div><strong className="text-gray-700">Roles:</strong> {roleNames.join(", ")}</div>
          {invite.message && (
            <div><strong className="text-gray-700">Message:</strong> {invite.message}</div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Access Summary</h4>
        {accessModules.length === 0 ? (
          <p className="text-sm text-gray-500">No explicit permissions selected.</p>
        ) : (
          <div className="space-y-3">
            {accessModules.map((moduleId) => {
              const module = modules.find(m => m.module === moduleId);
              const moduleName = module?.module_name || moduleId;
              const moduleAccess = invite.access[moduleId];
              const hasModuleAccess = moduleAccess?._module === true;
              const features = Object.keys(moduleAccess || {}).filter(f => f !== '_module');
              
              return (
                <div key={moduleId} className="border rounded-lg p-3 bg-gray-50">
                  <div className="font-medium text-sm text-gray-900 mb-2">
                    {moduleName} {hasModuleAccess ? "✓" : "✗"}
                  </div>
                  {!hasModuleAccess ? (
                    <p className="text-xs text-red-500">Module access disabled</p>
                  ) : features.length === 0 ? (
                    <p className="text-xs text-gray-500">Module enabled, no specific features configured</p>
                  ) : (
                    <ul className="space-y-1">
                      {features.map((featureId) => {
                        const feature = module?.features.find(f => f.id === featureId);
                        const featureName = feature?.name || featureId;
                         const permissions = invite.access[moduleId][featureId];
                         
                         if (featureId === '_module') return null; // Skip module toggle
                         
                         return (
                           <li key={featureId} className="text-xs">
                             <span className="font-medium text-gray-700">{featureName}:</span>{" "}
                             <span className="text-gray-600">
                               {Array.isArray(permissions) 
                                 ? permissions.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")
                                 : String(permissions)
                               }
                             </span>
                           </li>
                         );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" type="button" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button 
          variant="default"
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          aria-label={isLoading ? "Creating Account" : "Confirm and Create"}
        >
          {isLoading ? "Creating Account..." : "Confirm & Create"}
        </Button>
      </div>
    </div>
  );
};