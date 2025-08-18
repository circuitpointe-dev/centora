// src/components/users/AccessSection.tsx

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrgModulesWithFeatures } from "@/hooks/useOrgModulesWithFeatures";
import { moduleConfigs } from "@/config/moduleConfigs";
import { useAuth } from "@/contexts/AuthContext";
import { featurePermissions, type Permission } from "@/utils/permissions";

// UI labels for permissions
const PERMISSION_LABELS: Record<Permission, string> = {
  create: "Create",
  read: "Read",
  update: "Update",
  delete: "Delete",
  export: "Export",
  upload: "Upload",
};

// Access map type your form expects
export type AccessMap = {
  [moduleId: string]: {
    [featureId: string]: Permission[];
  };
};

interface AccessSectionProps {
  value: AccessMap;
  onChange: (value: AccessMap) => void;
}

/**
 * We now treat the DB RPC as the "source of truth for which modules are subscribed".
 * For the actual *feature list* we render from moduleConfigs, so the UI doesn't break
 * if the DB doesn't carry a features catalog yet.
 */
export const AccessSection: React.FC<AccessSectionProps> = ({ value, onChange }) => {
  const { data: subscribed = [], isLoading, error } = useOrgModulesWithFeatures();
  const { user } = useAuth();
  const orgType = user?.userType; // 'NGO' | 'Donor' | 'SuperAdmin' (we only need NGO/Donor distinction here)

  // Build a normalized list of modules+features to render from moduleConfigs
  const modulesToRender = useMemo(() => {
    // subscribed: [{ module: 'documents', module_name: 'Documents', ... }]
    return subscribed
      .map((m) => {
        const config = moduleConfigs[m.module];
        if (!config) return null;

        // For access control we’ll prefer the "features" list.
        // If you want to narrow based on org type for specific modules (like grants),
        // you can merge or choose ngoFeatures/donorFeatures here.
        let featureDefs = config.features || [];

        if (m.module === "grants" && orgType) {
          // If you prefer to show only org-specific feature set, uncomment one of the following:
          // if (orgType === 'NGO' && config.ngoFeatures?.length) featureDefs = config.ngoFeatures;
          // if (orgType === 'Donor' && config.donorFeatures?.length) featureDefs = config.donorFeatures;
          // For now we keep the general `features` so Admin can grant across the full surface.
        }

        // Map to the minimal shape we need: id, name, and permission list
        const features = featureDefs.map((f) => ({
          id: f.id,
          name: f.name,
          permissions: featurePermissions(m.module, f.id),
        }));

        return {
          moduleKey: m.module,
          moduleName: config.name || m.module_name || m.module,
          features,
        };
      })
      .filter(Boolean) as Array<{
        moduleKey: string;
        moduleName: string;
        features: Array<{ id: string; name: string; permissions: Permission[] }>;
      }>;
  }, [subscribed, orgType]);

  // helpers for AccessMap
  const isPermChecked = (moduleId: string, featureId: string, perm: Permission) =>
    Boolean(value?.[moduleId]?.[featureId]?.includes(perm));

  const togglePerm = (moduleId: string, featureId: string, perm: Permission) => {
    const current = value?.[moduleId]?.[featureId] ?? ([] as Permission[]);
    const next = current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm];

    onChange({
      ...value,
      [moduleId]: {
        ...(value?.[moduleId] ?? {}),
        [featureId]: next,
      },
    });
  };

  const setAllForFeature = (
    moduleId: string,
    featureId: string,
    perms: Permission[],
    checked: boolean
  ) => {
    onChange({
      ...value,
      [moduleId]: {
        ...(value?.[moduleId] ?? {}),
        [featureId]: checked ? perms : [],
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Access</h3>
        <div className="flex items-center justify-center p-8 border rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-muted-foreground">Loading modules…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Access</h3>
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">Failed to load modules</p>
          <p className="text-xs text-red-500 mt-1">{String((error as any)?.message || '')}</p>
        </div>
      </div>
    );
  }

  if (subscribed.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Access</h3>
        <div className="p-4 border rounded-lg bg-gray-50 flex items-center gap-2 text-sm text-gray-600">
          <AlertTriangle className="h-4 w-4 text-gray-500" />
          No modules are subscribed for this organization.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Access</h3>

      <Accordion type="multiple" className="rounded-lg border">
        {modulesToRender.map((mod) => (
          <AccordionItem key={mod.moduleKey} value={mod.moduleKey} className="border-b">
            <AccordionTrigger className="px-4">
              <span className="text-sm font-medium">{mod.moduleName}</span>
            </AccordionTrigger>

            <AccordionContent>
              {mod.features.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">
                  No features defined in <code>moduleConfig.ts</code> for <b>{mod.moduleKey}</b>.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
                  {mod.features.map((feat) => {
                    const supported = feat.permissions;
                    const granted = value?.[mod.moduleKey]?.[feat.id] ?? [];
                    const allChecked =
                      granted.length > 0 && supported.every((p) => granted.includes(p));

                    return (
                      <Card key={feat.id} className="shadow-none">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">{feat.name}</div>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={allChecked}
                                onCheckedChange={(checked) =>
                                  setAllForFeature(
                                    mod.moduleKey,
                                    feat.id,
                                    supported,
                                    Boolean(checked)
                                  )
                                }
                                aria-label="Select all permissions"
                              />
                              <span className="text-xs text-gray-500">Select all</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {supported.map((perm) => (
                              <label
                                key={perm}
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-md px-2 py-1 border text-xs cursor-pointer",
                                  isPermChecked(mod.moduleKey, feat.id, perm)
                                    ? "bg-violet-50 border-violet-200 text-violet-900"
                                    : "bg-gray-50 border-gray-200 text-gray-700"
                                )}
                              >
                                <Checkbox
                                  checked={isPermChecked(mod.moduleKey, feat.id, perm)}
                                  onCheckedChange={() =>
                                    togglePerm(mod.moduleKey, feat.id, perm)
                                  }
                                />
                                <span>{PERMISSION_LABELS[perm] || perm}</span>
                              </label>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
