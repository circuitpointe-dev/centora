
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

export type OpportunityStatus = 
  | "To Review"
  | "In Progress" 
  | "Submitted"
  | "Awarded"
  | "Declined";

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Education Initiative Grant",
    donorId: "donor-1",
    donorName: "Gates Foundation",
    amount: 500000,
    type: "RFP",
    deadline: "2024-12-31T23:59:59.000Z",
    status: "To Review",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    assignedTo: "John Smith",
    sector: "Education",
    contactEmail: "contact@gates.org",
    contactPhone: "+1-555-0123"
  },
  {
    id: "2",
    title: "Healthcare Innovation Fund",
    donorId: "donor-2",
    donorName: "WHO Foundation",
    amount: 750000,
    type: "LOI",
    deadline: "2024-11-30T23:59:59.000Z",
    status: "In Progress",
    createdAt: "2024-02-01T09:00:00.000Z",
    updatedAt: "2024-02-15T14:30:00.000Z",
    assignedTo: "Sarah Johnson",
    sector: "Health",
    contactEmail: "grants@who.org",
    contactPhone: "+1-555-0456"
  },
  {
    id: "3",
    title: "Climate Action Project",
    donorId: "donor-3",
    donorName: "Green Earth Fund",
    amount: 300000,
    type: "CFP",
    deadline: "2024-10-15T23:59:59.000Z",
    status: "Submitted",
    createdAt: "2024-01-20T11:00:00.000Z",
    updatedAt: "2024-03-01T16:00:00.000Z",
    assignedTo: "Mike Davis",
    sector: "Environment",
    contactEmail: "info@greenearthfund.org",
    contactPhone: "+1-555-0789"
  }
];
