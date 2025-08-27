import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { moduleConfigs } from "@/config/moduleConfigs";

interface ModuleFeatureState {
  [moduleId: string]: {
    [featureId: string]: boolean;
  };
}

interface ModuleSettings {
  [moduleId: string]: {
    accessControl: string;
    notifications: boolean;
    autoAssignNewUsers: boolean;
    assignHRManager: boolean;
  };
}

const mockLicensingData = [
  { module: "Fundraising", seatsUsed: "50 of 75 used" },
  { module: "Document management", seatsUsed: "20 of 75 used" },
  { module: "Finance & control", seatsUsed: "30 of 40 used" },
  { module: "Procurement", seatsUsed: "30 of 40 used" },
  { module: "Grant management", seatsUsed: "60 of 100 used" },
  { module: "Inventory", seatsUsed: "20 of 40 used" },
  { module: "HR", seatsUsed: "10 of 40 used" },
  { module: "User management", seatsUsed: "20 of 75 used" },
  { module: "LMS", seatsUsed: "20 of 80 used" },
  { module: "Program management", seatsUsed: "30 of 100 used" },
];

export function ModuleSettingsPage() {
  const [activeTab, setActiveTab] = useState("module-scope");
  
  // Initialize feature states - all enabled by default
  const [featureStates, setFeatureStates] = useState<ModuleFeatureState>(() => {
    const initialState: ModuleFeatureState = {};
    Object.keys(moduleConfigs).forEach(moduleId => {
      initialState[moduleId] = {};
      moduleConfigs[moduleId].features.forEach(feature => {
        initialState[moduleId][feature.id] = true;
      });
    });
    return initialState;
  });

  // Initialize module settings
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings>(() => {
    const initialSettings: ModuleSettings = {};
    Object.keys(moduleConfigs).forEach(moduleId => {
      initialSettings[moduleId] = {
        accessControl: "Admin",
        notifications: true,
        autoAssignNewUsers: true,
        assignHRManager: false,
      };
    });
    return initialSettings;
  });

  const toggleFeature = (moduleId: string, featureId: string) => {
    setFeatureStates(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [featureId]: !prev[moduleId][featureId]
      }
    }));
  };

  const updateModuleSetting = (moduleId: string, setting: keyof ModuleSettings[string], value: any) => {
    setModuleSettings(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [setting]: value
      }
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Module Settings</h1>
        <p className="text-muted-foreground mt-1">Manage module configurations and access controls</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="module-scope">Module scope settings</TabsTrigger>
          <TabsTrigger value="general">General settings</TabsTrigger>
        </TabsList>

        <TabsContent value="module-scope" className="space-y-6 mt-6">
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {Object.entries(moduleConfigs).map(([moduleId, config]) => {
                const Icon = config.icon;
                return (
                  <AccordionItem 
                    key={moduleId} 
                    value={moduleId}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        <span className="font-medium">{config.name}</span>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="space-y-6 pb-4">
                      {/* Feature Toggles */}
                      <div className="grid grid-cols-2 gap-4">
                        {config.features.map(feature => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div key={feature.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FeatureIcon className="h-4 w-4 text-muted-foreground" />
                                <Label htmlFor={`${moduleId}-${feature.id}`} className="text-sm">
                                  {feature.name}
                                </Label>
                              </div>
                              <Switch
                                id={`${moduleId}-${feature.id}`}
                                checked={featureStates[moduleId]?.[feature.id] || false}
                                onCheckedChange={() => toggleFeature(moduleId, feature.id)}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Access Control and Notifications */}
                      <div className="flex items-center gap-8 pt-4 border-t">
                        <div className="flex items-center gap-3">
                          <Label className="text-sm font-medium">Access control</Label>
                          <Select 
                            value={moduleSettings[moduleId]?.accessControl || "Admin"}
                            onValueChange={(value) => updateModuleSetting(moduleId, "accessControl", value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="User">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label htmlFor={`${moduleId}-notifications`} className="text-sm">
                            Notifications
                          </Label>
                          <Switch
                            id={`${moduleId}-notifications`}
                            checked={moduleSettings[moduleId]?.notifications || false}
                            onCheckedChange={(checked) => updateModuleSetting(moduleId, "notifications", checked)}
                          />
                        </div>
                      </div>

                      {/* Default Assigned Rules */}
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-medium">Default assigned rules</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${moduleId}-auto-assign`}
                              checked={moduleSettings[moduleId]?.autoAssignNewUsers || false}
                              onCheckedChange={(checked) => updateModuleSetting(moduleId, "autoAssignNewUsers", checked)}
                            />
                            <Label htmlFor={`${moduleId}-auto-assign`} className="text-sm text-muted-foreground">
                              Automatically assign new users to this module
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${moduleId}-hr-manager`}
                              checked={moduleSettings[moduleId]?.assignHRManager || false}
                              onCheckedChange={(checked) => updateModuleSetting(moduleId, "assignHRManager", checked)}
                            />
                            <Label htmlFor={`${moduleId}-hr-manager`} className="text-sm text-muted-foreground">
                              Assign users with role HR manager to this module
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
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Module Licensing</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 bg-muted/50 p-3 font-medium text-sm">
                  <div>Module</div>
                  <div>Seats used</div>
                </div>
                {mockLicensingData.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 p-3 border-t text-sm">
                    <div>{item.module}</div>
                    <div className="text-muted-foreground">{item.seatsUsed}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="general" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            <p>General settings configuration will be available here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}