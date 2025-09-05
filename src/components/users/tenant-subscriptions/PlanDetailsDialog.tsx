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
    <Dialog
      open={open}
      onOpenChange={(v) => (onOpenChange(v), !v && onClose())}
    >
      {/* Compact width + padding */}
      <DialogContent className="sm:max-w-xl p-4">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-base">
            {plan.tier} — Plan Details
          </DialogTitle>
          <DialogDescription className="text-xs">
            Overview and current invoices for subscribers.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body so nothing is cut off */}
        <div className="max-h-[80vh] overflow-y-auto space-y-3 pr-1">
          {/* Section 1 — compact, form-style details (read-only) */}
          <section className="rounded-lg border bg-white p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-600">Plan</label>
                <Input value={plan.tier} readOnly className="h-8 text-sm" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600">Storage</label>
                <Input
                  value={`${plan.storageGb} GB`}
                  readOnly
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600">API Calls</label>
                <Input
                  value={plan.apiCalls.toLocaleString()}
                  readOnly
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600">Price</label>
                <div className="flex items-center gap-2">
                  <Input value={"USD"} readOnly className="h-8 w-20 text-sm" />
                  <Input value={`$${price}`} readOnly className="h-8 text-sm" />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] text-slate-600">
                  Description
                </label>
                <Input
                  value={plan.description}
                  readOnly
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Section 2 — invoices table (own scroll area) */}
          <section className="rounded-lg border bg-white p-3">
            <div className="max-h-[40vh] overflow-y-auto pr-1">
              <PlanInvoicesTable planId={plan.id} />
            </div>
          </section>
        </div>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-9"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
