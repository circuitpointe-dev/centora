export interface ComplianceMonitorItem {
  id: string;
  grantName: string;
  organization: string;
  region: string;
  checklistItems: number;
  met: number;
  overdue: number;
  pending: number;
  dueDate?: string;
}

export const complianceMonitorData: ComplianceMonitorItem[] = [
  {
    id: "1",
    grantName: "Rural Health Initiative",
    organization: "Health for All Foundation",
    region: "Northern Region",
    checklistItems: 8,
    met: 5,
    overdue: 2,
    pending: 1,
    dueDate: "2024-08-15"
  },
  {
    id: "2",
    grantName: "Education Access Program",
    organization: "Learn Together NGO",
    region: "Central Region",
    checklistItems: 6,
    met: 6,
    overdue: 0,
    pending: 0
  },
  {
    id: "3",
    grantName: "Water Security Project",
    organization: "Clean Water Initiative",
    region: "Eastern Region",
    checklistItems: 10,
    met: 7,
    overdue: 1,
    pending: 2,
    dueDate: "2024-09-20"
  },
  {
    id: "4",
    grantName: "Youth Empowerment Fund",
    organization: "Future Leaders Foundation",
    region: "Western Region",
    checklistItems: 5,
    met: 3,
    overdue: 1,
    pending: 1,
    dueDate: "2024-08-30"
  },
  {
    id: "5",
    grantName: "Agricultural Development Grant",
    organization: "Green Harvest Cooperative",
    region: "Southern Region",
    checklistItems: 7,
    met: 4,
    overdue: 3,
    pending: 0,
    dueDate: "2024-08-10"
  },
  {
    id: "6",
    grantName: "Community Infrastructure Fund",
    organization: "Build Communities Corp",
    region: "Northern Region",
    checklistItems: 12,
    met: 8,
    overdue: 2,
    pending: 2,
    dueDate: "2024-09-05"
  },
  {
    id: "7",
    grantName: "Women Empowerment Initiative",
    organization: "Women Rise Foundation",
    region: "Central Region",
    checklistItems: 4,
    met: 4,
    overdue: 0,
    pending: 0
  },
  {
    id: "8",
    grantName: "Environmental Conservation Project",
    organization: "Earth Guardians Society",
    region: "Eastern Region",
    checklistItems: 9,
    met: 6,
    overdue: 1,
    pending: 2,
    dueDate: "2024-09-15"
  }
];

export const overdueByItemType = [
  { name: "Final Narrative Report", value: 8 },
  { name: "Final Financial Report", value: 5 },
  { name: "M & E Report", value: 3 },
  { name: "Audit Report", value: 2 },
  { name: "Impact Assessment", value: 4 },
];

export const complianceStatusData = [
  { name: "Met", value: 43, fill: "#10b981" },
  { name: "Overdue", value: 10, fill: "#ef4444" },
  { name: "Pending", value: 8, fill: "#f59e0b" },
];

export const upcomingDueDates = [
  { date: "2024-08-10", grant: "Agricultural Development Grant" },
  { date: "2024-08-15", grant: "Rural Health Initiative" },
  { date: "2024-08-30", grant: "Youth Empowerment Fund" },
  { date: "2024-09-05", grant: "Community Infrastructure Fund" },
  { date: "2024-09-15", grant: "Environmental Conservation Project" },
  { date: "2024-09-20", grant: "Water Security Project" },
];