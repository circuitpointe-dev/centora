export interface FundingCycle {
  id?: string;
  name: string;
  width: string;
  position: number;
  color: string;
  status: 'ongoing' | 'upcoming' | 'closed';
  startMonth: number;
  endMonth: number;
  year: number;
  description: string;
  donorId?: string;
  orgId?: string;
}

export interface DatabaseFundingCycle {
  id: string;
  donor_id: string;
  org_id: string;
  name: string;
  status: 'ongoing' | 'upcoming' | 'closed';
  start_month: number;
  end_month: number;
  year: number;
  description: string | null;
  color: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}