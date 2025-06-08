
export type OpportunityStatus = "To Review" | "In Progress" | "Submitted" | "Awarded" | "Declined";
export type OpportunityPipeline = "Identified" | "Qualified" | "Sent" | "Approved";
export type OpportunityType = "RFP" | "LOI" | "CFP";

export interface Opportunity {
  id: string;
  title: string;
  donorId: string;
  donorName: string;
  contactEmail?: string;
  contactPhone?: string;
  amount?: number;
  type: "RFP" | "LOI" | "CFP";
  deadline: string;
  status: OpportunityStatus;
  pipeline?: string; 
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  sector?: string;
  startDate?: string;
  endDate?: string;  
  notes?: string;
}
// Sample data for initial development
export const mockOpportunities: Opportunity[] = [
  {
    id: "op-001",
    title: "UNICEF Youth Innovation Grant - Q3 2025",
    donorId: "d-001",
    donorName: "UNICEF Nigeria",
    contactEmail: "nigeria@unicef.com",
    contactPhone: "+234 123 4567",
    amount: 50000,
    deadline: "2025-05-15",
    type: "RFP",
    status: "To Review",
    pipeline: "Identified",
    assignedTo: "John Doe",
    notes: "Focus on youth education initiatives in rural areas",
    sector: "Education",
    createdAt: "2025-01-15T10:30:00",
    updatedAt: "2025-01-15T10:30:00",
    startDate: "2025-05-01",
    endDate: "2025-12-31"
  },
  {
    id: "op-002",
    title: "Gates Foundation Health Systems Strengthening",
    donorId: "d-002",
    donorName: "Bill & Melinda Gates Foundation",
    contactEmail: "healthnaija@gatesfoundation.org",
    contactPhone: "+234 234 5678",
    amount: 250000,
    deadline: "2025-03-10",
    type: "CFP",
    status: "In Progress",
    pipeline: "Qualified",
    assignedTo: "Amina Yusuf",
    notes: "Focus on primary healthcare in Northwest Nigeria",
    sector: "Health",
    createdAt: "2024-11-20T09:15:00",
    updatedAt: "2025-01-05T14:20:00",
    startDate: "2025-06-01",
    endDate: "2026-05-31"
  },
  {
    id: "op-003",
    title: "EU Climate Resilience Initiative",
    donorId: "d-003",
    donorName: "European Union",
    contactEmail: "climate.eu@eeas.europa.eu",
    contactPhone: "+234 345 6789",
    amount: 180000,
    deadline: "2025-05-30",
    type: "LOI",
    status: "Submitted",
    pipeline: "Sent",
    assignedTo: "Emeka Nwankwo",
    notes: "Agricultural adaptation to climate change in Niger Delta",
    sector: "Environment",
    createdAt: "2024-12-01T11:45:00",
    updatedAt: "2025-02-18T16:30:00",
    startDate: "2025-08-15",
    endDate: "2026-08-14"
  },
  {
    id: "op-004",
    title: "USAID Education for All Program",
    donorId: "d-004",
    donorName: "USAID Nigeria",
    contactEmail: "education@usaid.gov",
    contactPhone: "+234 456 7890",
    amount: 320000,
    deadline: "2025-02-28",
    type: "RFP",
    status: "Awarded",
    pipeline: "Approved",
    assignedTo: "Fatima Bello",
    notes: "Girl-child education initiative in Northern states",
    sector: "Education",
    createdAt: "2024-10-05T08:00:00",
    updatedAt: "2025-01-30T10:15:00",
    startDate: "2025-04-01",
    endDate: "2027-03-31"
  },
  {
    id: "op-005",
    title: "WHO Emergency Response Fund",
    donorId: "d-005",
    donorName: "World Health Organization",
    contactEmail: "emergency.ng@who.int",
    contactPhone: "+234 567 8901",
    amount: 150000,
    deadline: "2025-01-31",
    type: "CFP",
    status: "Declined",
    pipeline: "Identified",
    assignedTo: "Chike Obi",
    notes: "Did not meet disease outbreak response criteria",
    sector: "Health",
    createdAt: "2024-09-15T14:20:00",
    updatedAt: "2025-01-20T12:45:00",
    startDate: "2025-03-01",
    endDate: "2025-12-31"
  },
  {
    id: "op-006",
    title: "UNDP Youth Entrepreneurship Program",
    donorId: "d-006",
    donorName: "United Nations Development Programme",
    contactEmail: "youth.ng@undp.org",
    contactPhone: "+234 678 9012",
    amount: 75000,
    deadline: "2025-06-15",
    type: "LOI",
    status: "To Review",
    pipeline: "Identified",
    assignedTo: "John Doe",
    notes: "Vocational training for unemployed youth",
    sector: "Economic Development",
    createdAt: "2025-01-10T13:10:00",
    updatedAt: "2025-01-10T13:10:00",
    startDate: "2025-09-01",
    endDate: "2026-02-28"
  },
  {
    id: "op-007",
    title: "DFID Governance Reform Initiative",
    donorId: "d-007",
    donorName: "UK Foreign Office",
    contactEmail: "governance.naija@fcdo.gov.uk",
    contactPhone: "+234 789 0123",
    amount: 420000,
    deadline: "2025-04-30",
    type: "RFP",
    status: "In Progress",
    pipeline: "Qualified",
    assignedTo: "Amina Yusuf",
    notes: "Public sector accountability mechanisms",
    sector: "Governance",
    createdAt: "2024-12-15T09:30:00",
    updatedAt: "2025-02-01T11:20:00",
    startDate: "2025-07-01",
    endDate: "2027-06-30"
  },
  {
    id: "op-008",
    title: "World Bank Agricultural Modernization",
    donorId: "d-008",
    donorName: "World Bank Nigeria",
    contactEmail: "agriculture@worldbank.org",
    contactPhone: "+234 890 1234",
    amount: 600000,
    deadline: "2025-03-25",
    type: "CFP",
    status: "Submitted",
    pipeline: "Sent",
    assignedTo: "Emeka Nwankwo",
    notes: "Mechanization support for smallholder farmers",
    sector: "Agriculture",
    createdAt: "2024-11-30T10:45:00",
    updatedAt: "2025-02-10T15:30:00",
    startDate: "2025-06-15",
    endDate: "2028-06-14"
  },
  {
    id: "op-009",
    title: "Ford Foundation Gender Equality",
    donorId: "d-009",
    donorName: "Ford Foundation",
    contactEmail: "gender.ng@fordfoundation.org",
    contactPhone: "+234 901 2345",
    amount: 120000,
    deadline: "2025-05-20",
    type: "LOI",
    status: "Awarded",
    pipeline: "Approved",
    assignedTo: "Fatima Bello",
    notes: "Women's leadership in civic engagement",
    sector: "Gender",
    createdAt: "2025-01-05T08:15:00",
    updatedAt: "2025-03-01T09:45:00",
    startDate: "2025-08-01",
    endDate: "2026-07-31"
  },
  {
    id: "op-010",
    title: "AfDB Infrastructure Development",
    donorId: "d-010",
    donorName: "African Development Bank",
    contactEmail: "infrastructure@afdb.org",
    contactPhone: "+234 012 3456",
    amount: 850000,
    deadline: "2025-07-10",
    type: "RFP",
    status: "To Review",
    pipeline: "Identified",
    assignedTo: "Chike Obi",
    notes: "Rural road construction in Southwest states",
    sector: "Infrastructure",
    createdAt: "2025-02-01T14:00:00",
    updatedAt: "2025-02-01T14:00:00",
    startDate: "2025-10-01",
    endDate: "2028-09-30"
  }
];
