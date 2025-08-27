// src/components/users/modules/mock/moduleSettings.ts
export const mockLicensingData = [
  { module: "Fundraising", seatsUsed: "50 of 75 used" },
  { module: "Document Management", seatsUsed: "20 of 75 used" },
  { module: "Finance & Control", seatsUsed: "30 of 40 used" },
  { module: "Procurement", seatsUsed: "30 of 40 used" },
  { module: "Grant Management", seatsUsed: "60 of 100 used" },
  { module: "Inventory", seatsUsed: "20 of 40 used" },
  { module: "HR", seatsUsed: "10 of 40 used" },
  { module: "User Management", seatsUsed: "20 of 75 used" },
  { module: "LMS", seatsUsed: "20 of 80 used" },
  { module: "Program Management", seatsUsed: "30 of 100 used" },
];

export const TIMEZONES = [
  "GMT-08:00 Pacific Time",
  "GMT-07:00 Mountain Time",
  "GMT-06:00 Central Time",
  "GMT-05:00 Eastern Time",
  "GMT+00:00 UTC",
  "GMT+01:00 West Africa Time",
];

export const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

export const LANGUAGES = [
  "English (United State)",
  "English (United Kingdom)",
  "Français (France)",
  "Deutsch (Deutschland)",
];

export const WEEK_STARTS = ["Sunday", "Monday", "Saturday"];

export const NOTIF_FREQUENCIES = ["Real-time", "Hourly", "Daily Digest", "Weekly Digest"];

export const SESSION_TIMEOUTS = ["15 mins", "30 mins", "1 hour", "2 hours", "8 hours"];
