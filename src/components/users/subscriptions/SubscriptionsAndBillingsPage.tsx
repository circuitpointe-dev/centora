// src/components/users/subscriptions/SubscriptionsAndBillingsPage.tsx

import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Plus,
  Search,
  Info,
} from "lucide-react";

import { UpgradePlanDialog } from "./dialogs/UpgradePlanDialog";
import { CardDetailsDialog } from "./dialogs/CardDetailsDialog";
import { AddBillingContactDialog } from "./dialogs/AddBillingContactDialog";

import {
  allModules as MOCK_ALL_MODULES,
  currentPlan as MOCK_PLAN,
  type OrgModule,
  type Plan,
} from "./mock/subscriptions-data";
import { invoices as MOCK_INVOICES, type Invoice } from "./mock/invoices-data";
import {
  billingContacts as MOCK_CONTACTS,
  type BillingContact,
} from "./mock/contacts-data";

type TabKey = "manage" | "invoices" | "card" | "contacts";

const statusPill = (s: Invoice["status"]) =>
  s === "paid"
    ? "bg-emerald-100 text-emerald-900"
    : s === "unpaid"
    ? "bg-rose-100 text-rose-900"
    : "bg-amber-100 text-amber-900";

const daysBetween = (a: Date, b: Date) =>
  Math.max(0, Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));

export const SubscriptionAndBillingsPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("manage");

  // Manage Subscription state
  const [modules, setModules] = useState<OrgModule[]>(MOCK_ALL_MODULES);
  const savedModulesRef = useRef<OrgModule[]>(MOCK_ALL_MODULES);
  const [plan, setPlan] = useState<Plan>(MOCK_PLAN);
  const [openUpgrade, setOpenUpgrade] = useState(false);

  // Invoices & Payments
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Invoice["status"]>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Card Details
  const [cardOpen, setCardOpen] = useState(false);

  // Billing Contacts
  const [contacts, setContacts] = useState<BillingContact[]>(MOCK_CONTACTS);
  const [contactOpen, setContactOpen] = useState(false);

  // ===== Helpers for pricing & proration =====
  const activeCount = (list: OrgModule[]) => list.filter((m) => m.active).length;
  const pricePerModule =
    plan.billingCycle === "yearly"
      ? plan.prices.yearlyPerModuleUSD
      : plan.prices.monthlyPerModuleUSD;

  const summaryTotal = activeCount(modules) * pricePerModule;

  // Pending changes vs. last saved
  const pendingAdded =
    activeCount(modules) - activeCount(savedModulesRef.current);
  const hasPending = pendingAdded !== 0;

  // Prorated estimate (very simple mock):
  //   delta * pricePerModule * (daysLeft / daysInCycle)
  const renewal = new Date(plan.renewalDate);
  const cycleStart = new Date(renewal);
  cycleStart.setMonth(cycleStart.getMonth() - 1);
  const daysInCycle = daysBetween(cycleStart, renewal);
  const daysLeft = daysBetween(new Date(), renewal);
  const prorationRatio = daysInCycle ? daysLeft / daysInCycle : 0;
  const proratedAmount = Math.abs(pendingAdded) * pricePerModule * prorationRatio;

  const filteredInvoices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices
      .filter((i) => (status === "all" ? true : i.status === status))
      .filter((i) =>
        [i.id, i.amountFormatted, i.status, new Date(i.date).toDateString()]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [invoices, status, query]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const rows = filteredInvoices.slice(start, start + pageSize);

  const toggleModule = (id: string) =>
    setModules((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, active: !m.active } : m,
      ),
    );

  const applyChanges = () => {
    savedModulesRef.current = modules;
  };

  const discardChanges = () => {
    setModules(savedModulesRef.current);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium text-gray-900">Subscription & Billings</h1>
      <p className="text-sm text-gray-500 mt-1">
        Manage Your Centora Plan, Modules, Invoices, Payment Method, And Billing Contacts.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[220px,1fr] gap-6">
        {/* Left – Tabs */}
        <nav className="rounded-xl border bg-white p-2">
          {(
            [
              ["manage", "Manage Subscription"],
              ["invoices", "Invoices & Payments"],
              ["card", "Card Details"],
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
            <>
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Manage Subscription</CardTitle>
                    <p className="text-sm text-gray-500">
                      Toggle Modules For Your Organization. Changes Apply To Your Next Billing
                      Cycle.
                    </p>
                  </div>
                  <Button
                    onClick={() => setOpenUpgrade(true)}
                    className="mt-3 md:mt-0 bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
                  >
                    Change Plan
                  </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Subscription Details */}
                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Subscription Details</div>
                      <div className="text-sm text-emerald-700">Active Modules</div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {modules.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-brand-purple/5"
                        >
                          <span className="text-sm text-gray-700">{m.name}</span>
                          <Switch
                            checked={m.active}
                            onCheckedChange={() => toggleModule(m.id)}
                            className="data-[state=checked]:bg-brand-purple focus-visible:ring-brand-purple/40"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Summary Bar */}
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-gray-50 px-3 py-2">
                      <div className="text-sm">
                        <span className="font-medium">Modules Active:</span>{" "}
                        {activeCount(modules)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Est. Total:</span>{" "}
                        <span>
                          {new Intl.NumberFormat(undefined, {
                            style: "currency",
                            currency: "USD",
                          }).format(summaryTotal)}{" "}
                          / {plan.billingCycle === "yearly" ? "Year" : "Month"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Price Per Module:{" "}
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: "USD",
                        }).format(pricePerModule)}
                        /{plan.billingCycle === "yearly" ? "Year" : "Month"}
                      </div>
                    </div>
                  </div>

                  {/* Plan & Renewal */}
                  <div className="rounded-xl border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-500 text-sm">Current Plan</div>
                        <div className="text-gray-900 font-medium">{plan.tierLabel}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-sm">Renewal Date</div>
                        <div className="text-gray-900 font-medium">
                          {new Date(plan.renewalDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade Dialog */}
              <Dialog open={openUpgrade} onOpenChange={setOpenUpgrade}>
                <UpgradePlanDialog
                  plan={plan}
                  onClose={() => setOpenUpgrade(false)}
                  onSelect={(next) => {
                    setPlan(next);
                    setOpenUpgrade(false);
                  }}
                />
              </Dialog>

              {/* Prorated Estimate Footer (appears when there are pending changes) */}
              {hasPending && (
                <div className="sticky bottom-4 z-10">
                  <div className="mx-auto max-w-5xl rounded-xl border bg-white shadow-xl p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-brand-purple mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium">
                            Prorated Estimate Until{" "}
                            {new Date(plan.renewalDate).toLocaleDateString()}
                          </div>
                          <div className="text-gray-600">
                            {pendingAdded > 0
                              ? `${pendingAdded} Module(s) Added`
                              : `${Math.abs(pendingAdded)} Module(s) Removed`}
                            {" • "}
                            Today Charge Estimate:{" "}
                            <span className="font-medium">
                              {new Intl.NumberFormat(undefined, {
                                style: "currency",
                                currency: "USD",
                              }).format(proratedAmount)}
                            </span>{" "}
                            (Based On {daysLeft} / {daysInCycle} Days Remaining)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="hover:bg-rose-50 hover:border-rose-300"
                          onClick={discardChanges}
                        >
                          Discard
                        </Button>
                        <Button
                          className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
                          onClick={applyChanges}
                        >
                          Apply Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Invoices & Payments */}
          {tab === "invoices" && (
            <Card>
              <CardHeader>
                <CardTitle>Invoices & Payments</CardTitle>
                <p className="text-sm text-gray-500">
                  View And Manage Your Invoices And Payment Details.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      <Input
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setPage(1);
                        }}
                        placeholder="Search Invoices…"
                        className="pl-8 w-72"
                      />
                    </div>
                    <div className="flex items-center gap-1 ml-1">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <select
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value as any);
                          setPage(1);
                        }}
                        className="h-9 rounded-md border px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                      >
                        <option value="all">All</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>

                  <Button className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90">
                    <Download className="h-4 w-4 mr-2" />
                    Download All Invoices
                  </Button>
                </div>

                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="text-left font-medium px-4 py-3">Invoice ID</th>
                        <th className="text-left font-medium px-4 py-3">Date</th>
                        <th className="text-left font-medium px-4 py-3">Amount</th>
                        <th className="text-left font-medium px-4 py-3">Status</th>
                        <th className="text-right font-medium px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                            No Invoices Found.
                          </td>
                        </tr>
                      ) : (
                        rows.map((inv) => (
                          <tr key={inv.id} className="border-t">
                            <td className="px-4 py-3">{inv.id}</td>
                            <td className="px-4 py-3">
                              {new Date(inv.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">{inv.amountFormatted}</td>
                            <td className="px-4 py-3">
                              <Badge className={statusPill(inv.status)}>{inv.status}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  className="h-8 px-2 hover:bg-brand-purple/5 hover:border-brand-purple"
                                  title="View"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-8 px-2 hover:bg-brand-purple/5 hover:border-brand-purple"
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">
                    Showing <span className="font-medium">{start + 1}</span>–
                    <span className="font-medium">
                      {Math.min(start + pageSize, filteredInvoices.length)}
                    </span>{" "}
                    Of <span className="font-medium">{filteredInvoices.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="h-8 px-3"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pageSafe === 1}
                    >
                      Prev
                    </Button>
                    <div>
                      Page <span className="font-medium">{pageSafe}</span> Of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="h-8 px-3"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={pageSafe === totalPages}
                    >
                      Next
                    </Button>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(parseInt(e.target.value, 10));
                        setPage(1);
                      }}
                      className="h-8 rounded-md border px-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    >
                      {[8, 12, 20, 50].map((n) => (
                        <option key={n} value={n}>
                          {n} / Page
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card Details */}
          {tab === "card" && (
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Card Details</CardTitle>
                  <p className="text-sm text-gray-500">
                    Update The Default Payment Method For Your Subscription.
                  </p>
                </div>
                <Button
                  onClick={() => setCardOpen(true)}
                  className="mt-3 md:mt-0 bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
                >
                  Update Card
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm">Cardholder</div>
                    <div className="font-medium">{plan.card.cardholder}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Card</div>
                    <div className="font-medium">
                      {plan.card.brand} •••• {plan.card.last4} — {plan.card.expMonth}/
                      {plan.card.expYear}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Last Updated</div>
                    <div className="font-medium">
                      {new Date(plan.card.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>

              <Dialog open={cardOpen} onOpenChange={setCardOpen}>
                <CardDetailsDialog
                  defaultCard={plan.card}
                  onClose={() => setCardOpen(false)}
                  onSave={(next) => {
                    setPlan((p) => ({ ...p, card: next }));
                    setCardOpen(false);
                  }}
                />
              </Dialog>
            </Card>
          )}

          {/* Billing Contacts */}
          {tab === "contacts" && (
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Billing Contacts</CardTitle>
                  <p className="text-sm text-gray-500">
                    Add Teammates Who Should Receive Billing Emails And Invoices.
                  </p>
                </div>
                <Button
                  onClick={() => setContactOpen(true)}
                  className="mt-3 md:mt-0 bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {contacts.length === 0 ? (
                  <p className="text-sm text-gray-500">No Contacts Yet.</p>
                ) : (
                  <div className="rounded-xl border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="text-left font-medium px-4 py-3">Name</th>
                          <th className="text-left font-medium px-4 py-3">Email</th>
                          <th className="text-left font-medium px-4 py-3">Role</th>
                          <th className="text-left font-medium px-4 py-3">Notifications</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c) => (
                          <tr key={c.id} className="border-t">
                            <td className="px-4 py-3">{c.name}</td>
                            <td className="px-4 py-3">{c.email}</td>
                            <td className="px-4 py-3">{c.role}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1.5">
                                {c.notifications.map((n) => (
                                  <span
                                    key={n}
                                    className="px-2 py-0.5 rounded-md text-[11px] border border-brand-purple/30 bg-brand-purple/5"
                                  >
                                    {n}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>

              <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <AddBillingContactDialog
                  onClose={() => setContactOpen(false)}
                  onSave={(contact) => {
                    setContacts((prev) => [...prev, contact]);
                    setContactOpen(false);
                  }}
                />
              </Dialog>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
