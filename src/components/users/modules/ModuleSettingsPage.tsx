// src/components/users/modules/ModuleSettingsPage.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { moduleConfigs } from "@/config/moduleConfigs";
import { mockLicensingData } from "./mock/moduleSettings";
import {
  TIMEZONES,
  DATE_FORMATS,
  LANGUAGES,
  WEEK_STARTS,
  NOTIF_FREQUENCIES,
  SESSION_TIMEOUTS,
} from "./mock/moduleSettings";

interface ModuleFeatureState {
  [moduleId: string]: { [featureId: string]: boolean };
}
interface ModuleSettings {
  [moduleId: string]: {
    accessControl: string;
    notifications: boolean;
    autoAssignNewUsers: boolean;
    assignHRManager: boolean;
  };
}

type GeneralSettings = {
  timeZone: string;
  dateFormat: string;
  language: string;
  weekStart: string;

  notifSystem: boolean;
  notifEmail: boolean;
  notifReminders: boolean;
  notifMobile: boolean;
  notifFrequency: string;

  passwordComplexity: boolean;
  passwordExpiration: boolean;
  twoFactor: boolean;
  sessionTimeout: string;
};

export default function ModuleSettingsPage() {
  const [activeTab, setActiveTab] = useState("module-scope");

  // Feature toggles (mock: all ON)
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
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings>(() => {
    const initial: ModuleSettings = {};
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

  // General settings state (mock defaults)
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

  const toggleFeature = (moduleId: string, featureId: string) => {
    setFeatureStates((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [featureId]: !prev[moduleId][featureId] },
    }));
  };

  const updateModuleSetting = (
    moduleId: string,
    setting: keyof ModuleSettings[string],
    value: any
  ) => {
    setModuleSettings((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [setting]: value },
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Module Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage Module Configurations And Access Controls
        </p>
      </div>

      {/* Two-column layout so content stays BESIDE the tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="grid grid-cols-[240px_1fr] gap-6">
        {/* Left column: vertical tab list (no shadows) */}
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

        {/* Right column: active tab content */}
        <div className="min-w-0">
          {/* MODULE SCOPE TAB */}
          <TabsContent value="module-scope" className="m-0 space-y-6">
            <div className="space-y-4">
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
                                {/* Brand-purple switch */}
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
                            <Label className="text-xs md:text-sm font-medium text-muted-foreground">
                              Access Control
                            </Label>
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
              <div className="mt-8">
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
          </TabsContent>

          {/* GENERAL SETTINGS TAB */}
          <TabsContent value="general" className="m-0 space-y-6">
            {/* Preferences */}
            <section className="border rounded-lg p-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Time zone */}
                <div className="space-y-1.5">
                  <Label className="text-sm">Time Zone</Label>
                  <Select value={general.timeZone} onValueChange={(v) => setGeneral((s) => ({ ...s, timeZone: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((z) => (
                        <SelectItem key={z} value={z}>
                          {z}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date format */}
                <div className="space-y-1.5">
                  <Label className="text-sm">Date Format</Label>
                  <Select value={general.dateFormat} onValueChange={(v) => setGeneral((s) => ({ ...s, dateFormat: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FORMATS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className="space-y-1.5">
                  <Label className="text-sm">Language</Label>
                  <Select value={general.language} onValueChange={(v) => setGeneral((s) => ({ ...s, language: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Week start */}
                <div className="space-y-1.5">
                  <Label className="text-sm">Week Start</Label>
                  <Select value={general.weekStart} onValueChange={(v) => setGeneral((s) => ({ ...s, weekStart: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEK_STARTS.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="border rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Notifications</h3>

              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="text-sm">
                    <div className="font-medium">System Notifications</div>
                    <div className="text-xs text-muted-foreground">
                      Receive in-app announcements, alerts and activity updates
                    </div>
                  </div>
                  <Switch
                    checked={general.notifSystem}
                    onCheckedChange={(v) => setGeneral((s) => ({ ...s, notifSystem: v }))}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="text-sm">
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-xs text-muted-foreground">
                      Get email updates about important events and tasks
                    </div>
                  </div>
                  <Switch
                    checked={general.notifEmail}
                    onCheckedChange={(v) => setGeneral((s) => ({ ...s, notifEmail: v }))}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="text-sm">
                    <div className="font-medium">Reminders</div>
                    <div className="text-xs text-muted-foreground">
                      Receive deadline reminders for documents, signature requests, etc.
                    </div>
                  </div>
                  <Switch
                    checked={general.notifReminders}
                    onCheckedChange={(v) => setGeneral((s) => ({ ...s, notifReminders: v }))}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="text-sm">
                    <div className="font-medium">Mobile Notifications</div>
                    <div className="text-xs text-muted-foreground">
                      Receive push notifications on your mobile device
                    </div>
                  </div>
                  <Switch
                    checked={general.notifMobile}
                    onCheckedChange={(v) => setGeneral((s) => ({ ...s, notifMobile: v }))}
                    className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Label className="text-sm">Notification Frequency</Label>
                <Select
                  value={general.notifFrequency}
                  onValueChange={(v) => setGeneral((s) => ({ ...s, notifFrequency: v }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTIF_FREQUENCIES.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Security */}
            <section className="border rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Security</h3>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="text-sm">
                  <div className="font-medium">Change Password</div>
                  <div className="text-xs text-muted-foreground">Update your account password</div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Change</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="text-sm">
                  <div className="font-medium">Password Complexity</div>
                  <div className="text-xs text-muted-foreground">Enforce strong password</div>
                </div>
                <Switch
                  checked={general.passwordComplexity}
                  onCheckedChange={(v) => setGeneral((s) => ({ ...s, passwordComplexity: v }))}
                  className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="text-sm">
                  <div className="font-medium">Password Expiration</div>
                  <div className="text-xs text-muted-foreground">Enforce regular password changes</div>
                </div>
                <Switch
                  checked={general.passwordExpiration}
                  onCheckedChange={(v) => setGeneral((s) => ({ ...s, passwordExpiration: v }))}
                  className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="text-sm">
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground">
                    Require additional verification upon login
                  </div>
                </div>
                <Switch
                  checked={general.twoFactor}
                  onCheckedChange={(v) => setGeneral((s) => ({ ...s, twoFactor: v }))}
                  className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="text-sm">
                  <div className="font-medium">Session Timeout</div>
                  <div className="text-xs text-muted-foreground">End inactive session automatically</div>
                </div>
                <Select
                  value={general.sessionTimeout}
                  onValueChange={(v) => setGeneral((s) => ({ ...s, sessionTimeout: v }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_TIMEOUTS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
