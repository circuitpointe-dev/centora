
export interface ComplianceRequirement {
  id: number;
  grantId: number;
  requirement: string;
  dueDate: string;
  status: 'In Progress' | 'Completed';
  evidenceDocument?: string;
}

export const complianceData: ComplianceRequirement[] = [
  {
    id: 1,
    grantId: 1,
    requirement: "Financial Audit Report",
    dueDate: "2024-12-31",
    status: "Completed",
    evidenceDocument: "Financial_Audit_Report_2024.pdf"
  },
  {
    id: 2,
    grantId: 1,
    requirement: "Environmental Impact Assessment",
    dueDate: "2024-10-15",
    status: "In Progress"
  },
  {
    id: 3,
    grantId: 1,
    requirement: "Quarterly Progress Report",
    dueDate: "2024-09-30",
    status: "Completed",
    evidenceDocument: "Q3_Progress_Report.pdf"
  },
  {
    id: 4,
    grantId: 1,
    requirement: "Legal Compliance Certificate",
    dueDate: "2024-11-20",
    status: "In Progress"
  },
  {
    id: 5,
    grantId: 2,
    requirement: "Data Protection Assessment",
    dueDate: "2024-08-15",
    status: "Completed",
    evidenceDocument: "Data_Protection_Assessment.pdf"
  },
  {
    id: 6,
    grantId: 2,
    requirement: "Safety Compliance Report",
    dueDate: "2024-12-01",
    status: "In Progress"
  }
];
