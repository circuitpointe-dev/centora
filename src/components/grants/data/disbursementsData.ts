
export interface Disbursement {
  id: number;
  grantId: number;
  milestone: string;
  amount: number;
  dueDate: string;
  disbursedOn: string;
  status: 'Pending' | 'Released';
}

export const disbursementsData: Disbursement[] = [
  {
    id: 1,
    grantId: 1,
    milestone: "Phase 1 Setup",
    amount: 25000,
    dueDate: "2024-03-10",
    disbursedOn: "2024-03-15",
    status: "Released"
  },
  {
    id: 2,
    grantId: 1,
    milestone: "Phase 2 Implementation",
    amount: 50000,
    dueDate: "2024-06-25",
    disbursedOn: "2024-06-30",
    status: "Released"
  },
  {
    id: 3,
    grantId: 1,
    milestone: "Phase 3 Evaluation",
    amount: 30000,
    dueDate: "2024-09-10",
    disbursedOn: "2024-09-15",
    status: "Pending"
  },
  {
    id: 4,
    grantId: 1,
    milestone: "Final Report Completion",
    amount: 15000,
    dueDate: "2024-12-25",
    disbursedOn: "2024-12-31",
    status: "Pending"
  },
  {
    id: 5,
    grantId: 2,
    milestone: "Initial Setup",
    amount: 20000,
    dueDate: "2024-03-25",
    disbursedOn: "2024-04-01",
    status: "Released"
  },
  {
    id: 6,
    grantId: 2,
    milestone: "Mid-term Review",
    amount: 35000,
    dueDate: "2024-08-10",
    disbursedOn: "2024-08-15",
    status: "Pending"
  }
];
