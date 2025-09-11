// src/components/users/subscriptions/SubscriptionsAndBillingsPage.tsx

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  ChevronRight,
} from "lucide-react";

import { useOrgModules, useSubscriptionDetails, useToggleModule } from "@/hooks/useSubscriptionBilling";
import { useAuth } from "@/contexts/AuthContext";

type TabKey = "manage" | "invoices" | "card" | "contacts";

export const SubscriptionAndBillingsPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("manage");

  // Get real data from backend
  const { data: modules = [], isLoading: modulesLoading } = useOrgModules();
  const { data: subscription, isLoading: subscriptionLoading } = useSubscriptionDetails();
  const toggleModule = useToggleModule();
  const { user } = useAuth();

  const handleToggleModule = (module: string, currentEnabled: boolean) => {
    toggleModule.mutate({ 
      module, 
      enabled: !currentEnabled 
    });
  };

  if (modulesLoading || subscriptionLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium text-gray-900">Subscription & Billing</h1>
      <p className="text-sm text-gray-500 mt-1">
        Manage your Centora plan, modules, and billing information.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6">
        {/* Left – Tabs */}
        <nav className="rounded-xl border bg-white p-2">
          {(
            [
              ["manage", "Manage Subscription"],
              ["invoices", "Invoices & Payments"],
              ["card", "Payment Method"],
              ["contacts", "Billing Contacts"],
            ] as [TabKey, string][]
          ).map(([key, label]) => {
            const active = tab === key;
            return (
              <button
                key={key}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm mb-1
                  hover:bg-brand-purple/5
                  ${active ? "bg-brand-purple/10 text-brand-purple" : "text-gray-700"}
                `}
                onClick={() => setTab(key)}
              >
                <span>{label}</span>
                <ChevronRight className="h-4 w-4 opacity-60" />
              </button>
            );
          })}
        </nav>

        {/* Right – Content */}
        <div className="space-y-6">
          {/* Manage Subscription */}
          {tab === "manage" && (
            <Card>
              <CardHeader>
                <CardTitle>Manage Subscription</CardTitle>
                <p className="text-sm text-gray-500">
                  Toggle modules for your organization. Changes apply immediately.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Subscription Details */}
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-medium">Active Modules</div>
                    <div className="text-sm text-emerald-700">
                      {modules.filter(m => m.is_enabled).length} of {modules.length} enabled
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map((m) => (
                      <div
                        key={m.name}
                        className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-brand-purple/5"
                      >
                        <span className="text-sm text-gray-700">{m.name}</span>
                        <Switch
                          checked={m.is_enabled}
                          onCheckedChange={() => handleToggleModule(m.module, m.is_enabled)}
                          disabled={toggleModule.isPending}
                          className="data-[state=checked]:bg-brand-purple focus-visible:ring-brand-purple/40"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Summary Bar */}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-gray-50 px-3 py-2">
                    <div className="text-sm">
                      <span className="font-medium">Modules Active:</span>{" "}
                      {modules.filter(m => m.is_enabled).length}
                    </div>
                    {subscription && (
                      <>
                        <div className="text-sm">
                          <span className="font-medium">Est. Total:</span>{" "}
                          <span>
                            {new Intl.NumberFormat(undefined, {
                              style: "currency",
                              currency: "USD",
                            }).format(subscription.total_cost)}{" "}
                            / Month
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {subscription.modules_active} of {modules.length} modules active
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Plan & Renewal */}
                {subscription && (
                  <div className="rounded-xl border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-500 text-sm">Current Plan</div>
                        <div className="text-gray-900 font-medium">{subscription.plan}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm">Renewal Date</div>
                        <div className="text-gray-900 font-medium">
                          {new Date(subscription.renewal_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Invoices & Payments */}
          {tab === "invoices" && (
            <Card>
              <CardHeader>
                <CardTitle>Invoices & Payments</CardTitle>
                <p className="text-sm text-gray-500">
                  View and manage your invoices and payment details.
                </p>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Invoice management coming soon. Contact support for billing inquiries.</p>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          {tab === "card" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <p className="text-sm text-gray-500">
                  Update the default payment method for your subscription.
                </p>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Payment method management coming soon. Contact support for payment updates.</p>
              </CardContent>
            </Card>
          )}

          {/* Billing Contacts */}
          {tab === "contacts" && (
            <Card>
              <CardHeader>
                <CardTitle>Billing Contacts</CardTitle>
                <p className="text-sm text-gray-500">
                  Add teammates who should receive billing emails and invoices.
                </p>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Billing contacts management coming soon. Contact support to add billing contacts.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};