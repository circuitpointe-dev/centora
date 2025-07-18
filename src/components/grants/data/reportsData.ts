
export interface Report {
  id: number;
  grantId: number;
  reportType: string;
  dueDate: string;
  submitted: boolean;
  status: 'Submitted' | 'Overdue' | 'Upcoming' | 'In Progress';
  submittedDate?: string;
  fileName?: string;
}

export const reportsData: Report[] = [
  {
    id: 1,
    grantId: 1,
    reportType: "Narrative Report",
    dueDate: "2024-07-15",
    submitted: true,
    status: "Submitted",
    submittedDate: "2024-07-12",
    fileName: "narrative_report_q2_2024.pdf"
  },
  {
    id: 2,
    grantId: 1,
    reportType: "Financial Report",
    dueDate: "2024-07-15",
    submitted: true,
    status: "Submitted",
    submittedDate: "2024-07-14",
    fileName: "financial_report_q2_2024.pdf"
  },
  {
    id: 3,
    grantId: 1,
    reportType: "Progress Report",
    dueDate: "2025-08-30",
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 4,
    grantId: 1,
    reportType: "Narrative Report",
    dueDate: "2024-06-15",
    submitted: false,
    status: "Overdue"
  },
  {
    id: 5,
    grantId: 1,
    reportType: "Financial Report",
    dueDate: "2025-09-15",
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 6,
    grantId: 2,
    reportType: "Narrative Report",
    dueDate: "2024-08-20",
    submitted: false,
    status: "In Progress"
  },
  {
    id: 7,
    grantId: 2,
    reportType: "Financial Report",
    dueDate: "2024-08-20",
    submitted: true,
    status: "Submitted",
    submittedDate: "2024-08-18",
    fileName: "financial_report_aug_2024.pdf"
  },
  {
    id: 8,
    grantId: 1,
    reportType: "Impact Assessment",
    dueDate: "2025-07-15",
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 9,
    grantId: 1,
    reportType: "Compliance Report",
    dueDate: "2024-05-30",
    submitted: false,
    status: "Overdue"
  },
  {
    id: 10,
    grantId: 1,
    reportType: "Mid-term Report",
    dueDate: "2025-07-16",
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 11,
    grantId: 2,
    reportType: "Quarterly Report",
    dueDate: "2025-07-20",
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 16,
    grantId: 3,
    reportType: "Annual Report",
    dueDate: "2025-07-15",
    submitted: false,
    status: "Upcoming"
  }
];
