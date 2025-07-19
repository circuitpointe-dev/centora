
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

// Helper function to generate dynamic dates relative to current date
const generateDynamicDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const reportsData: Report[] = [
  // Submitted reports (historical)
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
    id: 7,
    grantId: 2,
    reportType: "Financial Report",
    dueDate: "2024-08-20",
    submitted: true,
    status: "Submitted",
    submittedDate: "2024-08-18",
    fileName: "financial_report_aug_2024.pdf"
  },
  
  // Upcoming reports with dynamic dates for color coding
  {
    id: 3,
    grantId: 1,
    reportType: "Narrative Report",
    dueDate: generateDynamicDate(2), // Due in 2 days (RED)
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 4,
    grantId: 2,
    reportType: "Financial Report",
    dueDate: generateDynamicDate(3), // Due in 3 days (RED)
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 5,
    grantId: 1,
    reportType: "Compliance Report",
    dueDate: generateDynamicDate(5), // Due in 5 days (ORANGE)
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 6,
    grantId: 2,
    reportType: "Impact Assessment",
    dueDate: generateDynamicDate(7), // Due in 7 days (ORANGE)
    submitted: false,
    status: "Upcoming"
  },
  {
    id: 8,
    grantId: 1,
    reportType: "Mid-term Report",
    dueDate: generateDynamicDate(12), // Due in 12 days (GREEN)
    submitted: false,
    status: "Upcoming"
  }
];
