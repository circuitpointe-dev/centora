// src/components/users/tenants-subscriptions/AssignPlanDialog.tsx

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanModel } from "./types";

type TenantOption = { id: string; name: string };

export function AssignPlanDialog({
  open,
  onOpenChange,
  tenants,
  plans,
  onAssign,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tenants: TenantOption[];
  plans: PlanModel[];
  onAssign: (args: { tenantId: string; planId: string }) => void;
}) {
  const [tenantId, setTenantId] = React.useState("");
  const [planId, setPlanId] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTenantId("");
      setPlanId("");
    }
  }, [open]);

  const canSubmit = tenantId && planId;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onAssign({ tenantId, planId });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-4">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-base">Assign Plan to Tenant</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-600">Tenant</label>
            <select
              className="h-9 w-full rounded-md border px-3 text-sm"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            >
              <option value="">Select a tenant…</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-600">Plan</label>
            <select
              className="h-9 w-full rounded-md border px-3 text-sm"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
            >
              <option value="">Select a plan…</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.tier}
                </option>
              ))}
            </select>
          </div>

          {/* Optional note or effective date field (stubbed) */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-600">Note (Optional)</label>
            <Input placeholder="Add a short note…" className="h-8 text-sm" />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" type="button" className="h-8" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={!canSubmit} type="submit" className="h-8 bg-purple-600 hover:bg-purple-700 active:bg-purple-800">
              Assign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
