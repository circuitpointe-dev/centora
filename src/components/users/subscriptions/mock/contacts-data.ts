// src/components/users/subscriptions/mock/contacts-data.ts

export type BillingContact = {
  id: string;
  name: string;
  email: string;
  role: string;
  notifications: string[];
};

export const billingContacts: BillingContact[] = [
  {
    id: "bc_1",
    name: "Jane Doe",
    email: "jane@org.org",
    role: "Finance",
    notifications: ["Invoices", "Payment updates"],
  },
  {
    id: "bc_2",
    name: "Kwame Mensah",
    email: "kwame@org.org",
    role: "Operations",
    notifications: ["Plan changes"],
  },
];
