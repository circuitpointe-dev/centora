// src/components/users/tenants-subscriptions/PlanDetailsDialog.tsx

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlanBillingCycle, PlanModel } from "./types";
import { PlanInvoicesTable } from "./PlanInvoicesTable";

export function PlanDetailsDialog({
  open,
  onOpenChange,
  onClose,
  plan,
  cycle,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onClose: () => void;
  plan: PlanModel;
  cycle: PlanBillingCycle;
}) {
  const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

  return (
    <Dialog open={open} onOpenChange={(v) => (onOpenChange(v), !v && onClose())}>
      {/* Narrower dialog */}
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{plan.tier} — Plan Details</DialogTitle>
          <DialogDescription>Overview and current invoices for subscribers.</DialogDescription>
        </DialogHeader>

        {/* Section 1 — compact, form-style details (read-only) */}
        <section className="rounded-lg border bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Plan</label>
              <Input value={plan.tier.replace("Tier -", "Free").includes("Free") ? plan.tier : plan.tier} readOnly />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600">Storage</label>
              <Input value={`${plan.storageGb} GB`} readOnly />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600">API Calls</label>
              <Input value={plan.apiCalls.toLocaleString()} readOnly />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600">Price</label>
              <div className="flex items-center gap-2">
                <Input value={"USD"} readOnly className="w-24" />
                <Input value={`$${price}`} readOnly />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-slate-600">Description</label>
              <Input value={plan.description} readOnly />
            </div>
          </div>
        </section>

        {/* Section 2 — invoices table */}
        <section className="rounded-lg border bg-white p-3">
          {/* To make the table scroll independently, wrap with a max-h and overflow:
              <div className="max-h-[420px] overflow-y-auto"> ... </div>
            For now we keep it natural height since it's paginated. */}
          <PlanInvoicesTable planId={plan.id} />
        </section>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-9">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
