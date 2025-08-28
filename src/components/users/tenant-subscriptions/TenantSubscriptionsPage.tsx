// src/components/users/tenants-subscriptions/TenantSubscriptionsPage.tsx

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingSummaryTable } from "./BillingSummaryTable";

const sideTabClass =
  "flex w-[240px] flex-col gap-1 p-2 rounded-xl border bg-white/70 backdrop-blur";

const triggerClass =
  "justify-start rounded-lg data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700";

export default function TenantSubscriptionsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Subscriptions & Billings</h1>
      </div>

      <Tabs defaultValue="billing" className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        <TabsList className={sideTabClass}>
          <TabsTrigger className={triggerClass} value="billing">
            Tenant Billing Summary
          </TabsTrigger>
          <TabsTrigger className={triggerClass} value="invoices">
            Invoice Management
          </TabsTrigger>
          <TabsTrigger className={triggerClass} value="plans">
            Available Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="space-y-4">
          <BillingSummaryTable />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {/* Placeholder: we'll build this after billing summary */}
          <div className="rounded-xl border bg-white p-6">Coming up next…</div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          {/* Placeholder: we'll build this after billing summary */}
          <div className="rounded-xl border bg-white p-6">Coming up next…</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
