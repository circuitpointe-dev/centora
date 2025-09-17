import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FinanceReport {
  id: string;
  report_name: string;
  report_type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'budget_variance' | 'project_summary';
  report_period_start: string;
  report_period_end: string;
  generated_data?: any;
  file_path?: string;
  status: 'draft' | 'generated' | 'approved' | 'archived';
  created_at: string;
  updated_at: string;
}

export const useFinanceReports = () => {
  return useQuery({
    queryKey: ['finance-reports'],
    queryFn: async (): Promise<FinanceReport[]> => {
      const { data, error } = await supabase
        .from('financial_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching finance reports:', error);
        throw error;
      }

      return (data || []).map(report => ({
        ...report,
        report_type: report.report_type as FinanceReport['report_type'],
        status: report.status as FinanceReport['status'],
      }));
    },
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      reportType, 
      startDate, 
      endDate 
    }: { 
      reportType: FinanceReport['report_type']; 
      startDate: string; 
      endDate: string; 
    }) => {
      const { data: orgData } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      // Generate report name
      const reportName = `${reportType.replace('_', ' ').toUpperCase()} - ${startDate} to ${endDate}`;

      // In a real application, you would generate the actual report data here
      const mockReportData = {
        period: { start: startDate, end: endDate },
        generated_at: new Date().toISOString(),
        type: reportType,
        summary: {
          total_revenue: 45231,
          total_expenses: 32500,
          net_income: 12731
        }
      };

      const { data, error } = await supabase
        .from('financial_reports')
        .insert([
          {
            org_id: orgData?.org_id,
            report_name: reportName,
            report_type: reportType,
            report_period_start: startDate,
            report_period_end: endDate,
            generated_data: mockReportData,
            status: 'generated',
            created_by: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-reports'] });
      toast({
        title: 'Success',
        description: 'Financial report generated successfully',
      });
    },
    onError: (error) => {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate financial report',
        variant: 'destructive',
      });
    },
  });
};