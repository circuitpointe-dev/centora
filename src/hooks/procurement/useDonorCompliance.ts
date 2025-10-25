import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DonorGrant {
    id: string;
    org_id: string;
    grant_number: string;
    grant_name: string;
    donor_name: string;
    donor_id?: string;
    grant_amount: number;
    currency: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'completed' | 'suspended' | 'terminated';
    description?: string;
    compliance_requirements: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface DonorProject {
    id: string;
    org_id: string;
    grant_id: string;
    project_name: string;
    project_code: string;
    budget_amount: number;
    spent_amount: number;
    status: 'active' | 'completed' | 'on_hold' | 'cancelled';
    start_date: string;
    end_date: string;
    project_manager?: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface DonorComplianceIssue {
    id: string;
    org_id: string;
    grant_id: string;
    project_id?: string;
    issue_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    status: 'compliant' | 'flagged' | 'pending_review' | 'non_compliant';
    responsible_officer?: string;
    due_date?: string;
    resolution_notes?: string;
    created_at: string;
    updated_at: string;
}

export interface DonorVendorSpend {
    id: string;
    org_id: string;
    project_id: string;
    vendor_name: string;
    vendor_id?: string;
    amount_spent: number;
    currency: string;
    spend_date: string;
    description?: string;
    compliance_status: 'compliant' | 'flagged' | 'pending_review' | 'non_compliant';
    created_at: string;
    updated_at: string;
}

export interface DonorComplianceNote {
    id: string;
    org_id: string;
    grant_id: string;
    document_id: string;
    compliance_date: string;
    audit_status: string;
    responsible_officer: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export interface DonorComplianceStats {
    totalGrants: number;
    activeProjects: number;
    spendReportThisPeriod: number;
    complianceIssues: number;
}

export interface SpendVsBudgetData {
    project_name: string;
    budget_amount: number;
    spent_amount: number;
    variance: number;
}

// Hook to fetch donor compliance statistics
export const useDonorComplianceStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['donor-compliance-stats', user?.org_id],
        queryFn: async (): Promise<DonorComplianceStats> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data: grants, error: grantsError } = await supabase
                .from('donor_grants')
                .select('id')
                .eq('org_id', user.org_id);

            if (grantsError) throw grantsError;

            const { data: projects, error: projectsError } = await supabase
                .from('donor_projects')
                .select('id, spent_amount')
                .eq('org_id', user.org_id)
                .eq('status', 'active');

            if (projectsError) throw projectsError;

            const { data: issues, error: issuesError } = await supabase
                .from('donor_compliance_issues')
                .select('id')
                .eq('org_id', user.org_id)
                .eq('status', 'flagged');

            if (issuesError) throw issuesError;

            const totalGrants = grants?.length || 0;
            const activeProjects = projects?.length || 0;
            const spendReportThisPeriod = projects?.reduce((sum, project) => sum + (project.spent_amount || 0), 0) || 0;
            const complianceIssues = issues?.length || 0;

            return {
                totalGrants,
                activeProjects,
                spendReportThisPeriod,
                complianceIssues
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch spend vs budget data
export const useSpendVsBudgetData = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['spend-vs-budget', user?.org_id],
        queryFn: async (): Promise<SpendVsBudgetData[]> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('donor_projects')
                .select('project_name, budget_amount, spent_amount')
                .eq('org_id', user.org_id)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) throw error;

            const projectsData = data as any[] || [];
            return projectsData.map((project: any): SpendVsBudgetData => ({
                project_name: project.project_name,
                budget_amount: project.budget_amount,
                spent_amount: project.spent_amount,
                variance: project.spent_amount - project.budget_amount
            }));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch compliance notes
export const useComplianceNotes = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['compliance-notes', user?.org_id],
        queryFn: async (): Promise<DonorComplianceNote[]> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('donor_compliance_notes')
                .select('*')
                .eq('org_id', user.org_id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            const notesData = data as any[] || [];
            return notesData.map((note: any): DonorComplianceNote => ({
                id: note.id,
                org_id: note.org_id,
                grant_id: note.grant_id,
                document_id: note.document_id,
                compliance_date: note.compliance_date,
                audit_status: note.audit_status,
                responsible_officer: note.responsible_officer,
                notes: note.notes,
                created_at: note.created_at,
                updated_at: note.updated_at
            }));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch vendor spend data
export const useVendorSpendData = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['vendor-spend', user?.org_id],
        queryFn: async (): Promise<DonorVendorSpend[]> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('donor_vendor_spend')
                .select(`
                    *,
                    donor_projects!inner(
                        project_name,
                        grant_id,
                        donor_grants(grant_name)
                    )
                `)
                .eq('org_id', user.org_id)
                .order('amount_spent', { ascending: false })
                .limit(10);

            if (error) throw error;

            const spendData = data as any[] || [];
            return spendData.map((spend: any): DonorVendorSpend => ({
                id: spend.id,
                org_id: spend.org_id,
                project_id: spend.project_id,
                vendor_name: spend.vendor_name,
                vendor_id: spend.vendor_id,
                amount_spent: spend.amount_spent,
                currency: spend.currency,
                spend_date: spend.spend_date,
                description: spend.description,
                compliance_status: spend.compliance_status,
                created_at: spend.created_at,
                updated_at: spend.updated_at
            }));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to export donor compliance data
export const useExportDonorCompliance = () => {
    return useMutation({
        mutationFn: async (exportType: 'grants' | 'projects' | 'compliance' | 'spend') => {
            // This would generate and download an Excel/CSV file
            // For now, we'll simulate the export
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, message: `${exportType} export completed` });
                }, 2000);
            });
        }
    });
};

// Hook to filter donor compliance data
export const useFilterDonorCompliance = () => {
    return useMutation({
        mutationFn: async (filters: {
            dateRange?: { start: string; end: string };
            grantId?: string;
            projectId?: string;
            status?: string;
        }) => {
            // This would apply filters to the data
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, message: 'Filters applied' });
                }, 1000);
            });
        }
    });
};
