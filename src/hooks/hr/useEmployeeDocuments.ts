import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface EmployeeDocument {
    id: string;
    org_id: string;
    employee_id: string;
    document_type: string;
    document_name: string;
    document_number?: string;
    issue_date?: string;
    expiry_date?: string;
    document_url?: string;
    is_expiring_soon?: boolean;
    created_at: string;
    updated_at: string;
}

export function useEmployeeDocuments(search?: string, employeeId?: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-employee-documents', user?.org_id, search, employeeId],
        queryFn: async (): Promise<EmployeeDocument[]> => {
            if (!user?.org_id) return [];

            // Using any until generated types are aligned
            let query = (supabase as any)
                .from('hr_employee_documents')
                .select(`
                    *,
                    hr_employees!inner (
                        id,
                        first_name,
                        last_name,
                        department
                    )
                `)
                .eq('org_id', user.org_id)
                .order('expiry_date', { ascending: true });

            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }

            if (search && search.trim()) {
                // Search in document fields and employee name fields
                query = query.or(
                    `document_name.ilike.%${search}%,document_type.ilike.%${search}%,document_number.ilike.%${search}%,hr_employees.first_name.ilike.%${search}%,hr_employees.last_name.ilike.%${search}%`
                );
            }

            const { data, error } = await query;
            if (error && error.code !== 'PGRST116') throw error;
            return (data || []) as EmployeeDocument[];
        },
        staleTime: 5 * 60 * 1000,
    });
}


