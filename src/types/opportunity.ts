
export type OpportunityStatus = "To Review" | "In Progress" | "Submitted" | "Awarded" | "Declined";

export interface Opportunity {
  id: string;
  title: string;
  donorId: string;
  donorName: string;
  amount: number;
  type: "RFP" | "LOI" | "CFP";
  deadline: string;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  sector?: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Mock data for opportunities
export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Education Infrastructure Development",
    donorId: "donor-1",
    donorName: "Gates Foundation",
    amount: 250000,
    type: "RFP",
    deadline: "2024-03-15T00:00:00.000Z",
    status: "To Review",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z",
    assignedTo: "John Smith",
    sector: "Education",
    contactEmail: "program@gates.org",
    contactPhone: "+1-555-0123"
  },
  {
    id: "opp-2",
    title: "Healthcare Access Initiative",
    donorId: "donor-2",
    donorName: "WHO Foundation",
    amount: 500000,
    type: "CFP",
    deadline: "2024-04-20T00:00:00.000Z",
    status: "In Progress",
    createdAt: "2024-01-10T14:20:00.000Z",
    updatedAt: "2024-02-01T09:15:00.000Z",
    assignedTo: "Sarah Johnson",
    sector: "Health",
    contactEmail: "grants@who.org",
    contactPhone: "+1-555-0456"
  },
  {
    id: "opp-3",
    title: "Community Water Project",
    donorId: "donor-3",
    donorName: "Water.org",
    amount: 150000,
    type: "LOI",
    deadline: "2024-02-28T00:00:00.000Z",
    status: "Submitted",
    createdAt: "2024-01-05T11:45:00.000Z",
    updatedAt: "2024-02-10T16:30:00.000Z",
    assignedTo: "Mike Davis",
    sector: "Water & Sanitation",
    contactEmail: "partnerships@water.org",
    contactPhone: "+1-555-0789"
  },
  {
    id: "opp-4",
    title: "Youth Skills Training Program",
    donorId: "donor-4",
    donorName: "USAID",
    amount: 350000,
    type: "RFP",
    deadline: "2024-05-10T00:00:00.000Z",
    status: "Awarded",
    createdAt: "2023-12-20T08:15:00.000Z",
    updatedAt: "2024-01-25T13:45:00.000Z",
    assignedTo: "Emma Wilson",
    sector: "Youth Development",
    contactEmail: "programs@usaid.gov",
    contactPhone: "+1-555-0321"
  },
  {
    id: "opp-5",
    title: "Climate Resilience Research",
    donorId: "donor-5",
    donorName: "Climate Foundation",
    amount: 75000,
    type: "CFP",
    deadline: "2024-01-30T00:00:00.000Z",
    status: "Declined",
    createdAt: "2023-11-15T15:20:00.000Z",
    updatedAt: "2024-02-05T10:10:00.000Z",
    assignedTo: "David Brown",
    sector: "Environment",
    contactEmail: "research@climate.org",
    contactPhone: "+1-555-0654"
  }
];
