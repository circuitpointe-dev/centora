// src/components/users/modules/panels/ModuleScopePanel.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { moduleConfigs } from "@/config/moduleConfigs";
import { mockLicensingData } from "../mock/moduleSettings";
import { ModuleFeatureState, PerModuleSettings } from "../types";
import { SettingRow } from "../components/SettingRow";

type Props = {
  featureStates: ModuleFeatureState;
  moduleSettings: PerModuleSettings;
  toggleFeature: (moduleId: string, featureId: string) => void;
  updateModuleSetting: (moduleId: string, setting: keyof PerModuleSettings[string], value: any) => void;
};

export function ModuleScopePanel({
  featureStates,
  moduleSettings,
  toggleFeature,
  updateModuleSetting,
}: Props) {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {Object.entries(moduleConfigs).map(([moduleId, config]: any) => {
          const Icon = config.icon;
          return (
            <AccordionItem key={moduleId} value={moduleId} className="border rounded-lg px-4">
              {/* Smaller, lighter accordion title */}
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${config.color || "text-purple-600"}`} />
                  <span className="text-sm font-medium text-muted-foreground">{config.name}</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="space-y-6 pb-4">
                {/* Feature Toggles */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {config.features.map((feature: any) => {
                    const FeatureIcon = feature.icon;
                    const controlId = `${moduleId}-${feature.id}`;
                    return (
                      <div key={feature.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <FeatureIcon className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor={controlId} className="text-xs md:text-sm text-muted-foreground">
                            {feature.name}
                          </Label>
                        </div>
                        <Switch
                          id={controlId}
                          checked={featureStates[moduleId]?.[feature.id] || false}
                          onCheckedChange={() => toggleFeature(moduleId, feature.id)}
                          className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Access + Notifications */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Label className="text-xs md:text-sm font-medium text-muted-foreground">Access Control</Label>
                    <Select
                      value={moduleSettings[moduleId]?.accessControl || "Admin"}
                      onValueChange={(v) => updateModuleSetting(moduleId, "accessControl", v)}
                    >
                      <SelectTrigger className="w-28 border-purple-600/40 focus-visible:ring-purple-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectContent>
                    </Select>

                    <span className="text-muted-foreground select-none">|</span>

                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${moduleId}-notifications`} className="text-xs md:text-sm text-muted-foreground">
                        Notifications
                      </Label>
                      <Switch
                        id={`${moduleId}-notifications`}
                        checked={moduleSettings[moduleId]?.notifications || false}
                        onCheckedChange={(checked) => updateModuleSetting(moduleId, "notifications", checked)}
                        className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                      />
                    </div>
                  </div>
                </div>

                {/* Default Assigned Rules */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Default Assigned Rules</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${moduleId}-auto-assign`}
                        checked={moduleSettings[moduleId]?.autoAssignNewUsers || false}
                        onCheckedChange={(checked) =>
                          updateModuleSetting(moduleId, "autoAssignNewUsers", Boolean(checked))
                        }
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <Label htmlFor={`${moduleId}-auto-assign`} className="text-xs md:text-sm text-muted-foreground">
                        Automatically Assign New Users To This Module
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${moduleId}-hr-manager`}
                        checked={moduleSettings[moduleId]?.assignHRManager || false}
                        onCheckedChange={(checked) =>
                          updateModuleSetting(moduleId, "assignHRManager", Boolean(checked))
                        }
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <Label htmlFor={`${moduleId}-hr-manager`} className="text-xs md:text-sm text-muted-foreground">
                        Assign Users With Role HR Manager To This Module
                      </Label>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Module Licensing */}
      <div className="mt-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Module Licensing</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 bg-muted/40 p-3 font-medium text-xs md:text-sm text-muted-foreground">
            <div>Module</div>
            <div>Seats Used</div>
          </div>
          {mockLicensingData.map((item, index) => (
            <div key={index} className="grid grid-cols-2 p-3 border-t text-xs md:text-sm text-muted-foreground">
              <div>{item.module}</div>
              <div>{item.seatsUsed}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
