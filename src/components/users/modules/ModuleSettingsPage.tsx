// src/components/users/modules/ModuleSettingsPage.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleScopePanel } from "./panels/ModuleScopePanel";
import { GeneralSettingsPanel } from "./panels/GeneralSettingsPanel";
import { ModuleFeatureState, PerModuleSettings, GeneralSettings } from "./types";
import { moduleConfigs } from "@/config/moduleConfigs";

export default function ModuleSettingsPage() {
  const [activeTab, setActiveTab] = useState("module-scope");

  // Feature toggles (mock: ON)
  const [featureStates, setFeatureStates] = useState<ModuleFeatureState>(() => {
    const initial: ModuleFeatureState = {};
    Object.keys(moduleConfigs).forEach((moduleId) => {
      initial[moduleId] = {};
      moduleConfigs[moduleId].features.forEach((f: any) => {
        initial[moduleId][f.id] = true;
      });
    });
    return initial;
  });

  // Per-module settings
  const [moduleSettings, setModuleSettings] = useState<PerModuleSettings>(() => {
    const initial: PerModuleSettings = {};
    Object.keys(moduleConfigs).forEach((moduleId) => {
      initial[moduleId] = {
        accessControl: "Admin",
        notifications: false,
        autoAssignNewUsers: false,
        assignHRManager: false,
      };
    });
    return initial;
  });

  // General settings (mock)
  const [general, setGeneral] = useState<GeneralSettings>({
    timeZone: "GMT-05:00 Eastern Time",
    dateFormat: "MM/DD/YYYY",
    language: "English (United State)",
    weekStart: "Sunday",
    notifSystem: true,
    notifEmail: true,
    notifReminders: true,
    notifMobile: false,
    notifFrequency: "Real-time",
    passwordComplexity: true,
    passwordExpiration: true,
    twoFactor: true,
    sessionTimeout: "30 mins",
  });

  // Updaters
  const toggleFeature = (moduleId: string, featureId: string) =>
    setFeatureStates((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [featureId]: !prev[moduleId][featureId] },
    }));

  const updateModuleSetting = (
    moduleId: string,
    setting: keyof PerModuleSettings[string],
    value: any
  ) =>
    setModuleSettings((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [setting]: value },
    }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Module Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage Module Configurations And Access Controls</p>
      </div>

      {/* Two-column layout so content stays BESIDE the tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-[240px_1fr] gap-6">
        {/* Vertical tabs (no shadows) */}
        <TabsList className="h-fit sticky top-6 flex flex-col gap-1 p-0 bg-transparent">
          <TabsTrigger
            value="module-scope"
            className="w-full justify-start rounded-lg px-3 py-2 text-sm bg-transparent border hover:bg-muted/40 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200"
          >
            Module Scope Settings
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="w-full justify-start rounded-lg px-3 py-2 text-sm bg-transparent border hover:bg-muted/40 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200"
          >
            General Settings
          </TabsTrigger>
        </TabsList>

        {/* Panel content */}
        <div className="min-w-0">
          <TabsContent value="module-scope" className="m-0">
            <ModuleScopePanel
              featureStates={featureStates}
              moduleSettings={moduleSettings}
              toggleFeature={toggleFeature}
              updateModuleSetting={updateModuleSetting}
            />
          </TabsContent>

          <TabsContent value="general" className="m-0">
            <GeneralSettingsPanel general={general} setGeneral={setGeneral} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
