// src/components/users/tenants-subscriptions/PlanCard.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { PlanBillingCycle, PlanModel } from "./types";

export function PlanCard({
  plan,
  cycle,
  onOpen,
}: {
  plan: PlanModel;
  cycle: PlanBillingCycle;
  onOpen: () => void;
}) {
  const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

  return (
    <div
      className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer"
      role="button"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between">
        <div className="text-sm text-slate-500">Plan</div>
        <div className="text-sm font-medium">{plan.tier}</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div className="text-slate-500">Subscribers</div>
        <div className="text-right">{plan.subscribersCount}</div>

        <div className="text-slate-500">Storage</div>
        <div className="text-right">{plan.storageGb} GB</div>

        <div className="text-slate-500">API Calls</div>
        <div className="text-right">{plan.apiCalls.toLocaleString()}</div>

        <div className="text-slate-500">Price</div>
        <div className="text-right">
          ${price}/{cycle === "monthly" ? "month" : "year"}
        </div>
      </div>

      <div className="my-3 h-px w-full bg-slate-100" />

      <div className="space-y-2">
        <div className="text-sm text-slate-500">Description</div>
        <p className="text-sm">{plan.description}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" className="h-8" onClick={(e) => e.stopPropagation()}>
          Edit
        </Button>
        <Button variant="outline" className="h-8" onClick={(e) => e.stopPropagation()}>
          Duplicate
        </Button>
      </div>
    </div>
  );
}
