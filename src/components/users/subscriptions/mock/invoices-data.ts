// src/components/users/subscriptions/mock/invoices-data.ts

export type Invoice = {
  id: string;
  date: string; // ISO
  amountCents: number;
  amountFormatted: string;
  status: "paid" | "unpaid" | "refunded";
};

const fmt = (cents: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

export const invoices: Invoice[] = [
  {
    id: "INV-00216",
    date: new Date().toISOString(),
    amountCents: 85000,
    amountFormatted: fmt(85000),
    status: "paid",
  },
  {
    id: "INV-00215",
    date: new Date(Date.now() - 86400000).toISOString(),
    amountCents: 85000,
    amountFormatted: fmt(85000),
    status: "unpaid",
  },
  {
    id: "INV-00214",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    amountCents: 85000,
    amountFormatted: fmt(85000),
    status: "paid",
  },
  {
    id: "INV-00213",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    amountCents: 85000,
    amountFormatted: fmt(85000),
    status: "unpaid",
  },
  {
    id: "INV-00212",
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    amountCents: 85000,
    amountFormatted: fmt(85000),
    status: "paid",
  },
];
