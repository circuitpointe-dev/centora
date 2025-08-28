// src/components/users/tenants-subscriptions/TenantSubscriptionsPage.jsx
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TenantsBillingSummaryTable } from "./TenantsBillingSummaryTable";

export default function TenantSubscriptionsPage() {
  const [tab, setTab] = useState("summary");

  return (
    <div className="p-6 space-y-6">
      {/* Page Title (separate row) */}
      <div className="flex items-start justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Subscriptions & Billings</h1>
      </div>

      {/* Tabs contained inside their own grid so they *cannot* overlap the title */}
      <Tabs value={tab} onValueChange={setTab}>
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left column: stacked, top-aligned list */}
          <div className="col-span-12 md:col-span-3">
            <TabsList className="flex flex-col gap-2 p-2 rounded-lg border bg-white w-full">
              <TabsTrigger value="summary" className="justify-start w-full">Tenant Billing Summary</TabsTrigger>
              <TabsTrigger value="invoices" className="justify-start w-full">Invoice Management</TabsTrigger>
              <TabsTrigger value="plans" className="justify-start w-full">Available Plan</TabsTrigger>
            </TabsList>
          </div>

          {/* Right column: tab contents */}
          <div className="col-span-12 md:col-span-9">
            <TabsContent value="summary">
              <Card className="p-4">
                <TenantsBillingSummaryTable />
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card className="p-10 text-sm text-muted-foreground">
                Invoice Management coming next.
              </Card>
            </TabsContent>

            <TabsContent value="plans">
              <Card className="p-10 text-sm text-muted-foreground">
                Available Plan coming next.
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
