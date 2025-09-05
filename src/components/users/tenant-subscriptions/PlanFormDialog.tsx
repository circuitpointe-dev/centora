// src/components/users/tenants-subscriptions/PlanFormDialog.tsx

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanModel } from "./types";

type Mode = "edit" | "create";

export function PlanFormDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: Mode;
  value: PlanModel; // initial value (for edit or duplicate)
  onSave: (next: PlanModel) => void;
}) {
  const [form, setForm] = React.useState<PlanModel>(value);

  React.useEffect(() => setForm(value), [value]);

  const title = mode === "edit" ? "Edit Plan" : "Duplicate Plan";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Basic sanitize
    const next: PlanModel = {
      ...form,
      tier: form.tier.trim(),
      description: form.description.trim(),
      storageGb: Number(form.storageGb) || 0,
      apiCalls: Number(form.apiCalls) || 0,
      priceMonthly: Number(form.priceMonthly) || 0,
      priceYearly: Number(form.priceYearly) || 0,
      subscribersCount: Number(form.subscribersCount) || 0,
    };
    onSave(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-4">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-600">Plan</label>
              <Input
                value={form.tier}
                onChange={(e) => setForm({ ...form, tier: e.target.value })}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-600">Storage (GB)</label>
              <Input
                type="number"
                value={form.storageGb}
                onChange={(e) =>
                  setForm({ ...form, storageGb: Number(e.target.value) })
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-600">API Calls</label>
              <Input
                type="number"
                value={form.apiCalls}
                onChange={(e) =>
                  setForm({ ...form, apiCalls: Number(e.target.value) })
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-600">Subscribers</label>
              <Input
                type="number"
                value={form.subscribersCount}
                onChange={(e) =>
                  setForm({ ...form, subscribersCount: Number(e.target.value) })
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-600">
                Price (Monthly, USD)
              </label>
              <Input
                type="number"
                value={form.priceMonthly}
                onChange={(e) =>
                  setForm({ ...form, priceMonthly: Number(e.target.value) })
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-600">
                Price (Yearly, USD)
              </label>
              <Input
                type="number"
                value={form.priceYearly}
                onChange={(e) =>
                  setForm({ ...form, priceYearly: Number(e.target.value) })
                }
                className="h-8 text-sm"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] text-slate-600">Description</label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              type="button"
              className="h-8"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-8 bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
