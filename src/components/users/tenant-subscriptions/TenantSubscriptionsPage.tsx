// src/components/users/tenants-subscriptions/TenantSubscriptionsPage.tsx

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingSummaryTable } from "./BillingSummaryTable";
import { InvoiceManagementTable } from "./InvoiceManagementTable";
import AvailablePlansTab from "./AvailablePlansTab";

const sideTabClass =
  "flex h-auto items-start justify-start w-[200px] flex-col gap-1 p-0 rounded-xl border bg-white/70 backdrop-blur"

const triggerClass =
  "w-full justify-start rounded-lg data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700";

export default function TenantSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Subscriptions & Billings</h1>
      </div>

      <Tabs defaultValue="billing" className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
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

        <TabsContent value="billing" className="space-y-4 p-0 m-0">
          <BillingSummaryTable />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceManagementTable />
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <AvailablePlansTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
