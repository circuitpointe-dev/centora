// src/components/users/modules/panels/GeneralSettingsPanel.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SettingRow } from "../components/SettingRow";
import {
  DATE_FORMATS,
  LANGUAGES,
  NOTIF_FREQUENCIES,
  SESSION_TIMEOUTS,
  TIMEZONES,
  WEEK_STARTS,
} from "../constants/moduleSettings";
import { GeneralSettings } from "../types";

type Props = {
  general: GeneralSettings;
  setGeneral: React.Dispatch<React.SetStateAction<GeneralSettings>>;
};

export function GeneralSettingsPanel({ general, setGeneral }: Props) {
  return (
    <div className="space-y-6">
      {/* Preferences */}
      <section className="border rounded-lg p-4">
        <div className="grid sm:grid-cols-2 gap-4">
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

        <SettingRow
          title="System Notifications"
          description="Receive in-app announcements, alerts and activity updates"
          right={
            <Switch
              checked={general.notifSystem}
              onCheckedChange={(v) => setGeneral((s) => ({ ...s, notifSystem: v }))}
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
            />
          }
        />

        <SettingRow
          title="Email Notifications"
          description="Get email updates about important events and tasks"
          right={
            <Switch
              checked={general.notifEmail}
              onCheckedChange={(v) => setGeneral((s) => ({ ...s, notifEmail: v }))}
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
            />
          }
        />

        <SettingRow
          title="Reminders"
          description="Receive deadline reminders for documents, signature requests, etc."
          right={
            <Switch
              checked={general.notifReminders}
              onCheckedChange={(v) => setGeneral((s) => ({ ...s, notifReminders: v }))}
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
            />
          }
        />

        <SettingRow
          title="Mobile Notifications"
          description="Receive push notifications on your mobile device"
          right={
            <Switch
              checked={general.notifMobile}
              onCheckedChange={(v) => setGeneral((s) => ({ ...s, notifMobile: v }))}
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
            />
          }
        />

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

        <SettingRow
          title="Change Password"
          description="Update your account password"
          right={<Button className="bg-purple-600 hover:bg-purple-700">Change</Button>}
        />

        <SettingRow
          title="Password Complexity"
          description="Enforce strong password"
          right={
            <Switch
              checked={general.passwordComplexity}
              onCheckedChange={(v) => setGeneral((s) => ({ ...s, passwordComplexity: v }))}
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
            />
          }
        />

        <SettingRow
          title="Password Expiration"
          description="Enforce regular password changes"
          right={
            <Switch
              checked={general.passwordExpiration}
              onCheckedChange={(v) => setGeneral((s) => ({ ...s, passwordExpiration: v }))}
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
            />
          }
        />

        <SettingRow
          title="Two-Factor Authentication"
          description="Require additional verification upon login"
          right={
            <Switch
              checked={general.twoFactor}
              onCheckedChange={(v) => setGeneral((s) => ({ ...s, twoFactor: v }))}
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted"
            />
          }
        />

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
    </div>
  );
}
