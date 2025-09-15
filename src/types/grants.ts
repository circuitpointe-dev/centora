// Database types for grants management
export interface Grant {
  id: string;
  org_id: string;
  grant_name: string;
  donor_name: string;
  amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed' | 'pending' | 'cancelled';
  program_area?: string;
  region?: string;
  description?: string;
  track_status?: string;
  next_report_due?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GrantCompliance {
  id: string;
  grant_id: string;
  requirement: string;
  due_date: string;
  status: 'completed' | 'in_progress' | 'overdue';  
  evidence_document?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GrantDisbursement {
  id: string;
  grant_id: string;
  milestone: string;
  amount: number;
  currency: string;
  due_date: string;
  disbursed_on?: string;
  status: 'pending' | 'released' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GrantReport {
  id: string;
  grant_id: string;
  report_type: string;
  due_date: string;
  submitted: boolean;
  status: 'submitted' | 'overdue' | 'upcoming' | 'in_progress';
  submitted_date?: string;
  file_name?: string;
  file_path?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Statistics interfaces
export interface GrantStatistics {
  total_grants: number;
  active_grants: number;
  closed_grants: number;
  total_value: number;
  disbursement_rate: number;
  compliance_rate: number;
  burn_rate: number;
}

// Filter interfaces
export interface GrantFilters {
  grant_name: string;
  donor_name: string;
  status: string;
  region: string;
  program_area: string;
}