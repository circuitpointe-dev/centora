export interface DeadlineItem {
  id: string;
  title: string;
  organization: string;
  dueDate: string;
  status: 'Urgent' | 'Due Soon' | 'Upcoming';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  color: string;
}

export interface Donor {
  donor_id: string;
  name: string;
  affiliation: string;
  url: string;
  contact_person: {
    name: string;
    email: string;
    phone: string;
  };
  focus_areas: string[];
  funding_timeline: {
    start_date: string;
    end_date: string;
  };
}

export interface Opportunity {
  opportunity_id: string;
  title: string;
  donor_id: string;
  type: 'RFP' | 'CFP' | 'LOI';
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
