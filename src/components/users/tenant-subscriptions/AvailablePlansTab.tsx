// src/components/users/tenants-subscriptions/AvailablePlansTab.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PlanCard } from "./PlanCard";
import { PlanDetailsDialog } from "./PlanDetailsDialog";
import { PlanFormDialog } from "./PlanFormDialog";
import { AssignPlanDialog } from "./AssignPlanDialog";
import { AssignSuccessDialog } from "./AssignSuccessDialog";
import { PlanBillingCycle, PlanModel } from "./types";
import { PLANS } from "./mock/plans";
import { tenants as TENANT_ROWS } from "./mock/tenants";

export default function AvailablePlansTab() {
  const [query, setQuery] = React.useState("");
  const [cycle, setCycle] = React.useState<PlanBillingCycle>("monthly");

  // Plans managed locally; seed from mock
  const [plans, setPlans] = React.useState<PlanModel[]>(PLANS);

  // Details dialog
  const [selected, setSelected] = React.useState<PlanModel | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  // Edit / Duplicate form dialog
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<PlanModel | null>(null);
  const [isDuplicate, setIsDuplicate] = React.useState(false);

  // Assign dialog + success
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");

  const tenantOptions = React.useMemo(
    () => TENANT_ROWS.slice(0, 200).map((t) => ({ id: t.id, name: t.tenant })),
    []
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return plans.filter(
      (p) => !q || p.tier.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [query, plans]);

  function openDetails(plan: PlanModel) {
    setSelected(plan);
    setDetailsOpen(true);
  }

  function openEdit(plan: PlanModel) {
    setIsDuplicate(false);
    setEditingPlan(plan);
    setEditOpen(true);
  }

  function openDuplicate(plan: PlanModel) {
    setIsDuplicate(true);
    setEditingPlan({ ...plan, id: "" });
    setEditOpen(true);
  }

  function handleSavePlan(next: PlanModel) {
    if (isDuplicate || !next.id) {
      const newPlan = { ...next, id: genId() };
      setPlans((prev) => [newPlan, ...prev]);
    } else {
      setPlans((prev) => prev.map((p) => (p.id === next.id ? next : p)));
      setSelected((cur) => (cur && cur.id === next.id ? next : cur));
    }
    setEditOpen(false);
    setEditingPlan(null);
    setIsDuplicate(false);
  }

  function genId() {
    return `plan_${Math.random().toString(36).slice(2, 8)}`;
  }

  // --- Assign handlers ---
  function handleAssignClicked() {
    setAssignOpen(true);
  }

  function handleAssign({ tenantId, planId }: { tenantId: string; planId: string }) {
    // Simulate success + bump subscribers count locally
    const tenantName = tenantOptions.find((t) => t.id === tenantId)?.name ?? "Tenant";
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      const next = { ...plan, subscribersCount: plan.subscribersCount + 1 };
      setPlans((prev) => prev.map((p) => (p.id === planId ? next : p)));
    }
    setAssignOpen(false);
    setSuccessMsg(`Successfully assigned ${plan?.tier ?? "Plan"} to ${tenantName}.`);
    setSuccessOpen(true);
  }

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
          <Button
            className="h-9 bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            onClick={handleAssignClicked}
          >
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

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            cycle={cycle}
            onOpen={() => openDetails(plan)}
            onEdit={() => openEdit(plan)}
            onDuplicate={() => openDuplicate(plan)}
          />
        ))}
      </div>

      {/* Details Dialog */}
      {selected && (
        <PlanDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          plan={selected}
          cycle={cycle}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Edit / Duplicate Dialog */}
      {editingPlan && (
        <PlanFormDialog
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setEditingPlan(null);
          }}
          mode={isDuplicate ? "create" : "edit"}
          value={editingPlan}
          onSave={handleSavePlan}
        />
      )}

      {/* Assign Dialog */}
      <AssignPlanDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        tenants={tenantOptions}
        plans={plans}
        onAssign={handleAssign}
      />

      {/* Success Dialog */}
      <AssignSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        message={successMsg}
      />
    </div>
  );
}
