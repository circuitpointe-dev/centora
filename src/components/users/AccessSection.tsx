// src/components/users/AccessSection.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrgModulesWithFeatures, type ModuleWithFeatures } from "@/hooks/useOrgModulesWithFeatures";

// Map database enum to display-friendly names
const PERMISSION_LABELS: Record<string, string> = {
  read: "Read",
  write: "Write", 
  admin: "Admin",
};

export type AccessMap = {
  [moduleId: string]: {
    [featureId: string]: string[];
  };
};

interface AccessSectionProps {
  value: AccessMap;
  onChange: (value: AccessMap) => void;
}

export const AccessSection: React.FC<AccessSectionProps> = ({
  value,
  onChange,
}) => {
  const { data: modules = [], isLoading, error } = useOrgModulesWithFeatures();

  const isPermChecked = (moduleId: string, featureId: string, perm: string) =>
    Boolean(value?.[moduleId]?.[featureId]?.includes(perm));

  const togglePerm = (moduleId: string, featureId: string, perm: string) => {
    const current = value?.[moduleId]?.[featureId] ?? [];
    const next = current.includes(perm) 
      ? current.filter((p) => p !== perm) 
      : [...current, perm];
    
    onChange({
      ...value,
      [moduleId]: {
        ...(value?.[moduleId] ?? {}),
        [featureId]: next,
      },
    });
  };

  const setAllForFeature = (moduleId: string, featureId: string, perms: string[], checked: boolean) => {
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
          <span className="text-muted-foreground">Loading modules and features...</span>
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Access</h3>
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-sm text-red-600">Failed to load modules and features</p>
        <p className="text-xs text-red-500 mt-1">{String((error as any)?.message || '')}</p>
      </div>
    </div>
  );
}

  if (modules.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Access</h3>
        <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">No modules are subscribed for this organization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Access</h3>
      <Accordion type="multiple" className="rounded-lg border">
        {modules.map((module: ModuleWithFeatures) => (
          <AccordionItem key={module.module} value={module.module} className="border-b">
            <AccordionTrigger className="px-4">
              <span className="text-sm font-medium">{module.module_name}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
                {module.features.map((feature) => {
                  const granted = value?.[module.module]?.[feature.id] ?? [];
                  const allChecked = granted.length > 0 && feature.permissions.every((p) => granted.includes(p));

                  return (
                    <Card key={feature.id} className="shadow-none">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={allChecked}
                              onCheckedChange={(checked) => 
                                setAllForFeature(module.module, feature.id, feature.permissions, Boolean(checked))
                              }
                              aria-label="Select all permissions"
                            />
                            <span className="text-xs text-gray-500">Select all</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {feature.permissions.map((perm) => (
                            <label
                              key={perm}
                              className={cn(
                                "inline-flex items-center gap-2 rounded-md px-2 py-1 border text-xs cursor-pointer",
                                isPermChecked(module.module, feature.id, perm)
                                  ? "bg-violet-50 border-violet-200 text-violet-900"
                                  : "bg-gray-50 border-gray-200 text-gray-700"
                              )}
                            >
                              <Checkbox
                                checked={isPermChecked(module.module, feature.id, perm)}
                                onCheckedChange={() => togglePerm(module.module, feature.id, perm)}
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};