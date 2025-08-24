// src/components/users/announcements/mock/data.ts

import { Announcement, Tenant } from "../types"; // fixed path

export const MOCK_TENANTS: Tenant[] = [
  { id: "t1", name: "AidBridge Foundation", type: "NGO" },
  { id: "t2", name: "GreenWorld Initiative", type: "NGO" },
  { id: "t3", name: "Global Donors Trust", type: "Donor" },
  { id: "t4", name: "Horizon Donor Fund", type: "Donor" },
  { id: "t5", name: "Health4All Network", type: "NGO" },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    title: "New Module: Donor Insights",
    subject: "New Module: Donor Insights",
    message:
      "We’re excited to introduce the new Donor Insights module. Gain deeper visibility into donor trends and engagement.",
    status: "sent",
    audienceType: "all",
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Planned Maintenance Window",
    subject: "Planned Maintenance Window",
    message:
      "Centora will undergo maintenance on Sunday 02:00–03:00 UTC. Expect brief downtime during the period.",
    status: "scheduled",
    audienceType: "specific",
    tenantIds: ["t3", "t4"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "a3",
    title: "Welcome New Reporting Dashboards",
    subject: "Welcome New Reporting Dashboards",
    message:
      "New dashboards are live for Program Operations and Finance. Explore templates and share feedback.",
    status: "draft",
    audienceType: "specific",
    tenantIds: ["t1", "t5"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: "a4",
    title: "Legacy API Deprecation Notice",
    subject: "Legacy API Deprecation Notice",
    message:
      "The v1 Legacy API will be sunset on Oct 31. Please migrate to v2 endpoints to avoid disruption.",
    status: "archived",
    audienceType: "all",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(),
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
  },
];