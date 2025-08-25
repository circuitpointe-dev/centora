// src/components/users/clients/ClientDetailsDialog.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

type LocalClient = Client & { createdAt?: string };

interface Props {
  open: boolean;
  client: Client | null;
  onOpenChange: (v: boolean) => void;
  onUpdate: (c: Client) => void;
  onDelete: (clientId: string) => void;
  onToggleStatus: (clientId: string) => void;
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

  const handleSave = () => {
    onUpdate(local);
    setEdit(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Center the dialog on screen with fixed positioning */}
        <DialogContent className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-0 sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl">
          {/* Absolute Close (X) in the very top-right, above all content with higher z-index */}
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

          {/* Constrained height; sticky header + scrollable body */}
          <div className="flex max-h-[85vh] flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-background border-b">
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight truncate">{local.name}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <ClientStatusPill status={local.status} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Activity Log now lives with other action buttons */}
                  <Button variant="outline" onClick={() => onOpenActivity(local)}>
                    View Activity Log
                  </Button>

                  {!edit && (
                    <Button variant="outline" onClick={() => setEdit(true)}>
                      Edit
                    </Button>
                  )}
                  {edit && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setLocal(client as LocalClient);
                          setEdit(false);
                        }}
                      >
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
                    className={
                      local.status === 'active'
                        ? 'border-rose-600 text-rose-600 hover:bg-rose-50'
                        : 'border-green-600 text-green-600 hover:bg-green-50'
                    }
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

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <div className="space-y-6 p-4">
                {/* General Info — Primary Contact first, then dates */}
                <section className="rounded-lg border">
                  <div className="flex items-center justify-between p-4">
                    <h3 className="font-medium">General Info</h3>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {/* Primary Contact (first) */}
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

                    {/* Dates */}
                    <div>
                      <label className="text-sm text-muted-foreground">Date Created</label>
                      <Input
                        value={local.createdAt ? new Date(local.createdAt).toLocaleString() : '—'}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Last Active</label>
                      <Input value={new Date(local.lastActiveAt).toLocaleString()} disabled />
                    </div>

                    {/* Financial / Address */}
                    <div>
                      <label className="text-sm text-muted-foreground">Billing Plan</label>
                      <Input value={local.pricingTier} disabled />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Primary Currency</label>
                      <Input
                        value={local.primaryCurrency}
                        disabled={!edit}
                        onChange={(e) => setLocal({ ...local, primaryCurrency: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground">Address</label>
                      <Textarea
                        value={local.address}
                        disabled={!edit}
                        onChange={(e) => setLocal({ ...local, address: e.target.value })}
                      />
                    </div>
                  </div>
                </section>

                {/* Usage Summary + Custom Settings */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-lg border">
                    <div className="p-4"><h3 className="font-medium">Usage Summary</h3></div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 p-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Storage Used</div>
                        <div className="text-2xl font-semibold">{local.usage.storageGB.toFixed(1)} GB</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">User Accounts</div>
                        <div className="text-2xl font-semibold">{local.usage.users}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border">
                    <div className="p-4"><h3 className="font-medium">Custom Settings</h3></div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-3 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                          <label className="text-sm text-muted-foreground">Theme</label>
                          <Input
                            value={local.customSettings?.theme ?? ''}
                            disabled={!edit}
                            onChange={(e) =>
                              setLocal({ ...local, customSettings: { ...(local.customSettings ?? {}), theme: e.target.value } })
                            }
                          />
                        </div>
                      </div>
                      <div>
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
                  </div>
                </section>

                {/* Modules Section */}
                <section className="rounded-lg border">
                  <div className="p-4"><h3 className="font-medium">Modules</h3></div>
                  <Separator />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                    {local.modules.map((m) => (
                      <div key={m} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="font-medium">{m}</span>
                        <Switch
                          checked={local.modules.includes(m)}
                          disabled={!edit || local.requiredModules?.includes(m)}
                          onCheckedChange={(v) => {
                            let next = new Set(local.modules);
                            if (v) next.add(m);
                            else next.delete(m);
                            local.requiredModules?.forEach((r) => next.add(r));
                            setLocal({ ...local, modules: [...next] });
                          }}
                        />
                      </div>
                    ))}
                  </div>
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
              onClick={() => {
                onDelete(local.id);
                setConfirmDelete(false);
                onOpenChange(false);
              }}
            >
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};