// src/components/users/tenants-subscriptions/PlanDetails.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { PlanBillingCycle, PlanModel } from "./types";
import { PlanSubscribersTable } from "./PlanSubscribersTable";

export function PlanDetails({
  plan,
  cycle,
  onClose,
}: {
  plan: PlanModel;
  cycle: PlanBillingCycle;
  onClose: () => void;
}) {
  const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

  return (
    <div className="rounded-xl border bg-white p-4">
      {/* Detail header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">
          {plan.tier} — Details
        </h3>
        <Button variant="ghost" className="h-8" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Plan attributes */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-xs text-slate-500">Plan</div>
          <div className="text-sm font-medium">{plan.tier}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Storage</div>
          <div className="text-sm font-medium">{plan.storageGb} GB</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">API Calls</div>
          <div className="text-sm font-medium">{plan.apiCalls.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Price</div>
          <div className="text-sm font-medium">
            ${price}/{cycle === "monthly" ? "month" : "year"}
          </div>
        </div>
      </div>

      <div className="my-4 h-px w-full bg-slate-100" />

      <div className="mb-2 text-sm text-slate-500">Description</div>
      <p className="mb-4 text-sm">{plan.description}</p>

      {/* Subscribers table */}
      <PlanSubscribersTable planId={plan.id} />
    </div>
  );
}
