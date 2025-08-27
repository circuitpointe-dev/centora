// src/components/users/clients/ClientDetailsDialog.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import type { Client } from './types';
import { ClientStatusPill } from './ClientStatusPill';
import { ALL_MODULES } from './types';

// shadcn Selects (for Billing Plan & Currency in edit mode)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type LocalClient = Client & { createdAt?: string };

const TIER_OPTIONS = ['Tier 1', 'Tier 2', 'Tier 3'] as const;
const CURRENCY_OPTIONS = ['USD', 'NGN', 'EUR', 'GBP', 'KES'] as const;

// Helpers to map ISO <-> input[type=date]
const toDateInput = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');
const fromDateInput = (dateStr: string) =>
  dateStr ? new Date(dateStr + 'T00:00:00Z').toISOString() : undefined;

interface Props {
  open: boolean;
  client: Client | null;
  onOpenChange: (v: boolean) => void;
  onUpdate: (c: Client) => void;
  onDelete: (clientId: string) => void;
  onToggleStatus: (clientId: string) => void; // suspend/activate/reactivate
  onOpenActivity: (client: Client) => void;
}

export const ClientDetailsDialog: React.FC<Props> = ({
  open,
  client,
  onOpenChange,
  onUpdate,
  onDelete,
  onToggleStatus,
  onOpenActivity,
}) => {
  const [edit, setEdit] = useState(false);
  const [local, setLocal] = useState<LocalClient | null>((client as LocalClient) || null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  React.useEffect(() => {
    setLocal((client as LocalClient) || null);
    setEdit(false);
  }, [client]);

  if (!local) return null;

  const statusActionLabel = local.status === 'active' ? 'Suspend' : 'Activate';
  const handleSave = () => { onUpdate(local); setEdit(false); };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Centered, compact; sticky header + scrollable body */}
        <DialogContent className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-0 sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl">
          {/* Close (X) pinned top-right */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close"
              className="absolute -right-2 -top-2 z-50 h-8 w-8 rounded-full bg-background border shadow-md"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>

          <div className="flex max-h-[85vh] flex-col">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b">
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight truncate">{local.name}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <ClientStatusPill status={local.status} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={() => onOpenActivity(local)}>View Activity Log</Button>
                  {!edit && <Button variant="outline" onClick={() => setEdit(true)}>Edit</Button>}
                  {edit && (
                    <>
                      <Button variant="outline" onClick={() => { setLocal(client as LocalClient); setEdit(false); }}>
                        Cancel
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSave}>
                        Save
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => onToggleStatus(local.id)}
                    className={local.status === 'active'
                      ? 'border-rose-600 text-rose-600 hover:bg-rose-50'
                      : 'border-green-600 text-green-600 hover:bg-green-50'}
                  >
                    {statusActionLabel}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-rose-600 text-rose-600 hover:bg-rose-50"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Body */}
            <ScrollArea className="flex-1">
              <div className="space-y-6 p-4">
                {/* ===== General Info ===== */}
                <section className="rounded-lg border">
                  <div className="flex items-center justify-between p-4">
                    <h3 className="font-medium">General Info</h3>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {/* Primary Contact first */}
                    <div>
                      <label className="text-sm text-muted-foreground">Primary Contact Name</label>
                      <Input
                        value={local.contactName}
                        disabled={!edit}
                        onChange={(e) => setLocal({ ...local, contactName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Primary Contact Email</label>
                      <Input
                        type="email"
                        value={local.contactEmail}
                        disabled={!edit}
                        onChange={(e) => setLocal({ ...local, contactEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Primary Contact Phone</label>
                      <Input
                        value={local.contactPhone}
                        disabled={!edit}
                        onChange={(e) => setLocal({ ...local, contactPhone: e.target.value })}
                      />
                    </div>

                    {/* Address (Input) */}
                    <div className="md:col-span-1">
                      <label className="text-sm text-muted-foreground">Address</label>
                      <Input
                        value={local.address}
                        disabled={!edit}
                        onChange={(e) => setLocal({ ...local, address: e.target.value })}
                      />
                    </div>

                    {/* Primary Currency: Select in edit, read-only otherwise */}
                    <div>
                      <label className="text-sm text-muted-foreground">Primary Currency</label>
                      {edit ? (
                        <Select
                          value={local.primaryCurrency}
                          onValueChange={(v) => setLocal({ ...local, primaryCurrency: v })}
                        >
                          <SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger>
                          <SelectContent>
                            {CURRENCY_OPTIONS.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={local.primaryCurrency} disabled />
                      )}
                    </div>

                    {/* Date Created: real date input in edit */}
                    <div>
                      <label className="text-sm text-muted-foreground">Date Created</label>
                      {edit ? (
                        <Input
                          type="date"
                          value={toDateInput(local.createdAt)}
                          onChange={(e) => setLocal({ ...local, createdAt: fromDateInput(e.target.value) })}
                        />
                      ) : (
                        <Input
                          value={local.createdAt ? new Date(local.createdAt).toLocaleString() : '—'}
                          disabled
                        />
                      )}
                    </div>

                    {/* Last two fields: Last Active, Billing Plan */}
                    <div>
                      <label className="text-sm text-muted-foreground">Last Active</label>
                      <Input value={new Date(local.lastActiveAt).toLocaleString()} disabled />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Billing Plan</label>
                      {edit ? (
                        <Select
                          value={local.pricingTier}
                          onValueChange={(v) => setLocal({ ...local, pricingTier: v as LocalClient['pricingTier'] })}
                        >
                          <SelectTrigger><SelectValue placeholder="Select Plan" /></SelectTrigger>
                          <SelectContent>
                            {TIER_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={local.pricingTier} disabled />
                      )}
                    </div>
                  </div>
                </section>

                {/* ===== Usage Summary (compact + extra metrics) ===== */}
                <section className="rounded-lg border">
                  <div className="p-3"><h3 className="font-medium">Usage Summary</h3></div>
                  <Separator />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 text-sm">
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Storage Used</div>
                      <div className="font-semibold">{local.usage.storageGB.toFixed(1)} GB</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">User Accounts</div>
                      <div className="font-semibold">{local.usage.users}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Email Accounts</div>
                      <div className="font-semibold">{local.usage.emailAccounts ?? 0}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">Projects</div>
                      <div className="font-semibold">{local.usage.projects ?? 0}</div>
                    </div>
                    <div className="rounded-md border p-3">
                      <div className="text-muted-foreground">API Calls (This Month)</div>
                      <div className="font-semibold">{local.usage.apiCallsThisMonth ?? 0}</div>
                    </div>
                  </div>
                </section>

                {/* ===== Custom Settings (with Theme color picker) ===== */}
                <section className="rounded-lg border">
                  <div className="p-3"><h3 className="font-medium">Custom Settings</h3></div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Domain</label>
                      <Input
                        value={local.customSettings?.domain ?? ''}
                        disabled={!edit}
                        onChange={(e) =>
                          setLocal({ ...local, customSettings: { ...(local.customSettings ?? {}), domain: e.target.value } })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Theme Color</label>
                      <ThemeColorPicker
                        value={local.customSettings?.theme ?? '#6D28D9'}
                        disabled={!edit}
                        onChange={(hex) =>
                          setLocal({
                            ...local,
                            customSettings: { ...(local.customSettings ?? {}), theme: hex },
                          })
                        }
                      />
                      {!edit && (
                        <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Current:</span>
                          <span
                            className="inline-block h-3 w-6 rounded"
                            style={{ backgroundColor: local.customSettings?.theme ?? '#6D28D9' }}
                          />
                          <span>{local.customSettings?.theme ?? '#6D28D9'}</span>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground">Assigned Admins (comma separated)</label>
                      <Input
                        value={(local.customSettings?.assignedAdmins ?? []).join(', ')}
                        disabled={!edit}
                        onChange={(e) =>
                          setLocal({
                            ...local,
                            customSettings: {
                              ...(local.customSettings ?? {}),
                              assignedAdmins: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </section>

                {/* ===== Modules (compact, brand ON, always 10) ===== */}
                <section className="rounded-lg border">
                  <div className="p-3"><h3 className="font-medium">Modules</h3></div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3">
                    {ALL_MODULES.map((m) => {
                      const isRequired = local.requiredModules?.includes(m);
                      const checked = local.modules.includes(m);
                      return (
                        <div key={m} className="flex items-center justify-between rounded-md border p-2 text-sm">
                          <span className="truncate">{m}</span>
                          <Switch
                            checked={checked}
                            disabled={!edit || isRequired}
                            onCheckedChange={(v) => {
                              const next = new Set(local.modules);
                              if (v) next.add(m); else next.delete(m);
                              local.requiredModules?.forEach((r) => next.add(r)); // enforce required
                              setLocal({ ...local, modules: [...next] });
                            }}
                            className="
                              data-[state=checked]:bg-purple-600
                              data-[state=checked]:border-purple-600
                              focus-visible:ring-purple-600
                            "
                          />
                        </div>
                      );
                    })}
                  </div>
                  {local.requiredModules?.length ? (
                    <div className="px-3 pb-3 text-xs text-muted-foreground">
                      Required: {local.requiredModules.join(', ')} (cannot be turned off).
                    </div>
                  ) : null}
                </section>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Strict Delete Warning */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. It will permanently remove <strong>{local.name}</strong> and all associated records.
              Please confirm you understand the consequences.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => { onDelete(local.id); setConfirmDelete(false); onOpenChange(false); }}
            >
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

/** -----------------------------------------------------------
 * Inline, lightweight Theme Color Picker
 * (You can move this into its own file later if you prefer.)
 * ----------------------------------------------------------*/
function ThemeColorPicker({
  value,
  disabled,
  onChange,
}: {
  value?: string;
  disabled?: boolean;
  onChange: (hex: string) => void;
}) {
  const PRESETS = ['#6D28D9', '#7C3AED', '#9333EA', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#111827'];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((hex) => {
        const selected = (value ?? '').toLowerCase() === hex.toLowerCase();
        return (
          <button
            type="button"
            key={hex}
            disabled={disabled}
            onClick={() => onChange(hex)}
            className={[
              'h-8 w-8 rounded-full border transition',
              selected ? 'ring-2 ring-offset-2' : 'ring-0',
            ].join(' ')}
            style={{ backgroundColor: hex, borderColor: selected ? hex : 'rgba(0,0,0,0.1)' }}
            aria-label={`Select ${hex}`}
            title={hex}
          />
        );
      })}
      <input
        type="color"
        value={value || '#6D28D9'}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border"
        aria-label="Pick custom color"
        title="Custom color"
      />
    </div>
  );
}
