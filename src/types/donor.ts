export interface FundingCycle {
  name: string;
  width: string;
  position: number;
  color: string;
  status: string;
  startMonth: number;
  endMonth: number;
  description: string;
}

export interface Donor {
  id: string;
  name: string;
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
  };
  lastDonation: string;
  interestTags: string[];
  totalDonations: number;
  status: 'Active' | 'Inactive' | 'Potential';
}

export interface FocusArea {
  id: string;
  name: string;
  description: string;
  color: string;
  fundingStartDate: string;
  fundingEndDate: string;
  interestTags: string[];
  amount: number;
  currency: string;
}
