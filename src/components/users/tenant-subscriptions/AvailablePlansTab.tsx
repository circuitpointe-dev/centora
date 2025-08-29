// src/components/users/tenants-subscriptions/AvailablePlansTab.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PlanCard } from "./PlanCard";
import { PlanDetailsDialog } from "./PlanDetailsDialog";
import { PlanBillingCycle, PlanModel } from "./types";
import { PLANS } from "./mock/plans";

export default function AvailablePlansTab() {
  const [query, setQuery] = React.useState("");
  const [cycle, setCycle] = React.useState<PlanBillingCycle>("monthly");
  const [selected, setSelected] = React.useState<PlanModel | null>(null);
  const [open, setOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLANS.filter(
      (p) => !q || p.tier.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-4">
      {/* Title + Search + Assign */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold tracking-tight">Available Plan</h2>
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plans…"
            className="h-9 w-[220px]"
          />
          <Button className="h-9 bg-purple-600 hover:bg-purple-700 active:bg-purple-800">
            Assign Plan to Tenant
          </Button>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-700">Monthly</span>
        <Switch
          checked={cycle === "yearly"}
          onCheckedChange={(v) => setCycle(v ? "yearly" : "monthly")}
          className="data-[state=checked]:bg-purple-600"
        />
        <span className="text-sm text-slate-700">Yearly</span>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            onOpen={() => {
              setSelected(plan);
              setOpen(true);
            }}
          />
        ))}
      </div>

      {/* Details Dialog */}
      {selected && (
        <PlanDetailsDialog
          open={open}
          onOpenChange={setOpen}
          plan={selected}
          cycle={cycle}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
