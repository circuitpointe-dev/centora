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

// FocusArea interface moved to src/hooks/useFocusAreas.ts
