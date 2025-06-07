
export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
}

export interface FundingTimeline {
  start_date: string;
  end_date: string;
}

export interface Donor {
  donor_id: string;
  name: string;
  affiliation: string;
  url: string;
  contact_person: ContactPerson;
  focus_areas: string[];
  funding_timeline: FundingTimeline;
}

export interface Opportunity {
  opportunity_id: string;
  title: string;
  donor_id: string;
  type: "RFP" | "CFP" | "LOI";
  currency: string;
  amount: number;
  deadline: string;
  assigned_staff_id: string;
}

export interface Proposal {
  proposal_id: string;
  title: string;
  linked_opportunities: string[];
}

export interface DeadlineItem {
  id: string;
  title: string;
  organization: string;
  dueDate: string;
  status: "Urgent" | "Due Soon" | "Upcoming";
}

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  color: string;
}

export const donors: Donor[] = [
  {
    donor_id: "DNR001",
    name: "Global Health Initiative",
    affiliation: "International Philanthropic Foundation",
    url: "https://www.globalhealthinitiative.org",
    contact_person: {
      name: "Dr. Evelyn Reed",
      email: "evelyn.reed@globalhealthinitiative.org",
      phone: "+1-202-555-0100"
    },
    focus_areas: ["Health", "Research", "Community Development"],
    funding_timeline: {
      start_date: "2023-01-01",
      end_date: "2028-12-31"
    }
  },
  {
    donor_id: "DNR002",
    name: "EduFuture Fund",
    affiliation: "Private Family Foundation",
    url: "https://www.edufuturefund.org",
    contact_person: {
      name: "Mr. David Chen",
      email: "david.chen@edufuturefund.org",
      phone: "+44-20-7946-0001"
    },
    focus_areas: ["Education", "Youth Empowerment", "Digital Literacy"],
    funding_timeline: {
      start_date: "2024-03-15",
      end_date: "2029-03-14"
    }
  },
  {
    donor_id: "DNR003",
    name: "Tech for Good Foundation",
    affiliation: "Corporate Social Responsibility Arm",
    url: "https://www.techforgood.com",
    contact_person: {
      name: "Ms. Sarah Okoro",
      email: "sarah.okoro@techforgood.com",
      phone: "+234-803-123-4567"
    },
    focus_areas: ["Technology", "Innovation", "Environmental Sustainability"],
    funding_timeline: {
      start_date: "2022-06-01",
      end_date: "2027-05-31"
    }
  },
  {
    donor_id: "DNR004",
    name: "Community Impact Alliance",
    affiliation: "Local Grantmaking Organization",
    url: "https://www.communityimpactalliance.org",
    contact_person: {
      name: "Mrs. Ngozi Adebayo",
      email: "ngozi.adebayo@communityimpactalliance.org",
      phone: "+234-809-876-5432"
    },
    focus_areas: ["Community Development", "Livelihoods", "Gender Equality"],
    funding_timeline: {
      start_date: "2024-09-01",
      end_date: "2029-08-31"
    }
  },
  {
    donor_id: "DNR005",
    name: "African Development Trust",
    affiliation: "Pan-African Development Bank",
    url: "https://www.africandevelopmenttrust.org",
    contact_person: {
      name: "Mr. Kwame Nkrumah",
      email: "kwame.nkrumah@africandevelopmenttrust.org",
      phone: "+27-11-234-5678"
    },
    focus_areas: ["Infrastructure", "Agriculture", "Economic Development"],
    funding_timeline: {
      start_date: "2023-11-01",
      end_date: "2030-10-31"
    }
  }
];

export const opportunities: Opportunity[] = [
  {
    opportunity_id: "OPP001",
    title: "Grant for Malaria Eradication Programs",
    donor_id: "DNR001",
    type: "RFP",
    currency: "USD",
    amount: 500000.00,
    deadline: "2025-01-15",
    assigned_staff_id: "1"
  },
  {
    opportunity_id: "OPP002",
    title: "Call for Proposals: Digital Literacy for Rural Youth",
    donor_id: "DNR002",
    type: "CFP",
    currency: "GBP",
    amount: 150000.00,
    deadline: "2025-03-01",
    assigned_staff_id: "2"
  },
  {
    opportunity_id: "OPP003",
    title: "RFP: Sustainable Water Solutions in Arid Regions",
    donor_id: "DNR003",
    type: "RFP",
    currency: "EUR",
    amount: 750000.00,
    deadline: "2025-06-20",
    assigned_staff_id: "3"
  },
  {
    opportunity_id: "OPP004",
    title: "LOI: Empowering Women in Agriculture",
    donor_id: "DNR004",
    type: "LOI",
    currency: "NGN",
    amount: 25000000.00,
    deadline: "2025-07-30",
    assigned_staff_id: "4"
  },
  {
    opportunity_id: "OPP005",
    title: "Grant for AI Integration in Education",
    donor_id: "DNR003",
    type: "RFP",
    currency: "USD",
    amount: 1200000.00,
    deadline: "2025-09-10",
    assigned_staff_id: "1"
  },
  {
    opportunity_id: "OPP006",
    title: "Community Health Outreach Program Funding",
    donor_id: "DNR001",
    type: "CFP",
    currency: "USD",
    amount: 300000.00,
    deadline: "2025-10-05",
    assigned_staff_id: "2"
  },
  {
    opportunity_id: "OPP007",
    title: "Youth Skills Development Initiative",
    donor_id: "DNR002",
    type: "LOI",
    currency: "GBP",
    amount: 200000.00,
    deadline: "2025-11-15",
    assigned_staff_id: "3"
  },
  {
    opportunity_id: "OPP008",
    title: "Sustainable Livelihoods Project in Rural Communities",
    donor_id: "DNR004",
    type: "RFP",
    currency: "NGN",
    amount: 40000000.00,
    deadline: "2026-01-20",
    assigned_staff_id: "4"
  }
];

export const proposals: Proposal[] = [
  {
    proposal_id: "PRP001",
    title: "Comprehensive Malaria Eradication Strategy for West Africa",
    linked_opportunities: ["OPP001"]
  },
  {
    proposal_id: "PRP002",
    title: "Enhancing Digital Literacy through Community Hubs",
    linked_opportunities: ["OPP002"]
  },
  {
    proposal_id: "PRP003",
    title: "Innovative Water Purification and Access Solutions",
    linked_opportunities: ["OPP003", "OPP005"]
  },
  {
    proposal_id: "PRP004",
    title: "Gender-Inclusive Agricultural Training Program",
    linked_opportunities: ["OPP004"]
  },
  {
    proposal_id: "PRP005",
    title: "Integrated Community Health and Wellness Outreach",
    linked_opportunities: ["OPP006"]
  },
  {
    proposal_id: "PRP006",
    title: "AI-Powered Educational Tools for Underserved Schools",
    linked_opportunities: ["OPP005"]
  }
];

export const deadlinesData: DeadlineItem[] = [
  {
    id: "1",
    title: 'Proposal: "Youth Empowerment Plan"',
    organization: "UNICEF",
    dueDate: "Due: Today",
    status: "Urgent",
  },
  {
    id: "2",
    title: 'Opportunity: "Community Health Grant"',
    organization: "WUO",
    dueDate: "Due in 2 days",
    status: "Due Soon",
  },
  {
    id: "3",
    title: 'Proposal: "Water for All"',
    organization: "WaterAid",
    dueDate: "Due in 1 week",
    status: "Upcoming",
  },
];

// Mock calendar events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    date: new Date(2025, 5, 15), // June 15, 2025
    title: "Grant Proposal Deadline",
    color: "#ef4444"
  },
  {
    id: "2",
    date: new Date(2025, 5, 20), // June 20, 2025
    title: "Donor Meeting",
    color: "#3b82f6"
  },
  {
    id: "3",
    date: new Date(2025, 5, 25), // June 25, 2025
    title: "Fundraising Event",
    color: "#10b981"
  }
];
