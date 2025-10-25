import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SpendAnalysisVendor {
    id: string;
    org_id: string;
    vendor_name: string;
    vendor_code: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    status: 'active' | 'inactive' | 'suspended' | 'blacklisted';
    total_spend: number;
    last_transaction_date?: string;
    created_at: string;
    updated_at: string;
}

export interface SpendAnalysisTransaction {
    id: string;
    org_id: string;
    vendor_id: string;
    transaction_date: string;
    amount: number;
    currency: string;
    category: 'IT' | 'Software' | 'Office' | 'Professional' | 'Equipment' | 'Services' | 'Consulting';
    description?: string;
    status: 'approved' | 'pending' | 'rejected' | 'cancelled';
    project_id?: string;
    department?: string;
    created_at: string;
    updated_at: string;
}

export interface SpendAnalysisCategory {
    id: string;
    org_id: string;
    category_name: 'IT' | 'Software' | 'Office' | 'Professional' | 'Equipment' | 'Services' | 'Consulting';
    budget_amount: number;
    spent_amount: number;
    period_start: string;
    period_end: string;
    created_at: string;
    updated_at: string;
}

export interface SpendAnalysisPeriod {
    id: string;
    org_id: string;
    period_name: string;
    period_start: string;
    period_end: string;
    total_spend: number;
    previous_period_spend: number;
    growth_percentage: number;
    created_at: string;
    updated_at: string;
}

export interface SpendAnalysisStats {
    topSpend: number;
    topVendor: string;
    topVendorAmount: number;
    topCategory: string;
    topCategoryAmount: number;
    periodVsLastPeriod: number;
}

export interface SpendByVendorLineData {
    month: string;
    amount: number;
}

export interface SpendByVendorPieData {
    vendor_name: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface SpendByCategoryBarData {
    category: string;
    total: number;
    vendors: {
        [key: string]: number;
    };
}

// Hook to fetch spend analysis statistics
export const useSpendAnalysisStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['spend-analysis-stats', user?.org_id],
        queryFn: async (): Promise<SpendAnalysisStats> => {
            if (!user?.org_id) throw new Error('No organization');

            // Get top spend
            const { data: topSpendData, error: topSpendError } = await supabase
                .from('spend_analysis_periods')
                .select('total_spend')
                .eq('org_id', user.org_id)
                .order('period_end', { ascending: false })
                .limit(1)
                .single();

            if (topSpendError) throw topSpendError;

            // Get top vendor
            const { data: topVendorData, error: topVendorError } = await supabase
                .from('spend_analysis_vendors')
                .select('vendor_name, total_spend')
                .eq('org_id', user.org_id)
                .order('total_spend', { ascending: false })
                .limit(1)
                .single();

            if (topVendorError) throw topVendorError;

            // Get top category
            const { data: topCategoryData, error: topCategoryError } = await supabase
                .from('spend_analysis_categories')
                .select('category_name, spent_amount')
                .eq('org_id', user.org_id)
                .order('spent_amount', { ascending: false })
                .limit(1)
                .single();

            if (topCategoryError) throw topCategoryError;

            // Get period comparison
            const { data: periodData, error: periodError } = await supabase
                .from('spend_analysis_periods')
                .select('growth_percentage')
                .eq('org_id', user.org_id)
                .order('period_end', { ascending: false })
                .limit(1)
                .single();

            if (periodError) throw periodError;

            return {
                topSpend: topSpendData?.total_spend || 0,
                topVendor: topVendorData?.vendor_name || 'N/A',
                topVendorAmount: topVendorData?.total_spend || 0,
                topCategory: topCategoryData?.category_name || 'N/A',
                topCategoryAmount: topCategoryData?.spent_amount || 0,
                periodVsLastPeriod: periodData?.growth_percentage || 0
            };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch spend by vendor line chart data
export const useSpendByVendorLineData = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['spend-by-vendor-line', user?.org_id],
        queryFn: async (): Promise<SpendByVendorLineData[]> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('spend_analysis_transactions')
                .select('transaction_date, amount')
                .eq('org_id', user.org_id)
                .eq('status', 'approved')
                .order('transaction_date', { ascending: true });

            if (error) throw error;

            // Group by month and sum amounts
            const monthlyData: { [key: string]: number } = {};
            const transactions = data as any[] || [];

            transactions.forEach((transaction: any) => {
                const date = new Date(transaction.transaction_date);
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                monthlyData[month] = (monthlyData[month] || 0) + transaction.amount;
            });

            // Generate data for all months
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.map(month => ({
                month,
                amount: monthlyData[month] || 0
            }));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch spend by vendor pie chart data
export const useSpendByVendorPieData = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['spend-by-vendor-pie', user?.org_id],
        queryFn: async (): Promise<SpendByVendorPieData[]> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('spend_analysis_vendors')
                .select('vendor_name, total_spend')
                .eq('org_id', user.org_id)
                .eq('status', 'active')
                .order('total_spend', { ascending: false })
                .limit(4);

            if (error) throw error;

            const vendors = data as any[] || [];
            const totalSpend = vendors.reduce((sum, vendor) => sum + vendor.total_spend, 0);

            const colors = ['#10b981', '#8b5cf6', '#ef4444', '#f59e0b'];

            return vendors.map((vendor, index) => ({
                vendor_name: vendor.vendor_name,
                amount: vendor.total_spend,
                percentage: totalSpend > 0 ? (vendor.total_spend / totalSpend) * 100 : 0,
                color: colors[index] || '#6b7280'
            }));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to fetch spend by category bar chart data
export const useSpendByCategoryBarData = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['spend-by-category-bar', user?.org_id],
        queryFn: async (): Promise<SpendByCategoryBarData[]> => {
            if (!user?.org_id) throw new Error('No organization');

            const { data, error } = await supabase
                .from('spend_analysis_transactions')
                .select(`
                    category,
                    amount,
                    spend_analysis_vendors!inner(vendor_name)
                `)
                .eq('org_id', user.org_id)
                .eq('status', 'approved');

            if (error) throw error;

            const transactions = data as any[] || [];
            const categoryData: { [key: string]: { total: number; vendors: { [key: string]: number } } } = {};

            transactions.forEach((transaction: any) => {
                const category = transaction.category;
                const vendor = transaction.spend_analysis_vendors.vendor_name;
                const amount = transaction.amount;

                if (!categoryData[category]) {
                    categoryData[category] = { total: 0, vendors: {} };
                }

                categoryData[category].total += amount;
                categoryData[category].vendors[vendor] = (categoryData[category].vendors[vendor] || 0) + amount;
            });

            return Object.entries(categoryData).map(([category, data]) => ({
                category,
                total: data.total,
                vendors: data.vendors
            }));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook to export spend analysis data
export const useExportSpendAnalysis = () => {
    return useMutation({
        mutationFn: async (exportType: 'vendors' | 'transactions' | 'categories' | 'summary') => {
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

// Hook to filter spend analysis data
export const useFilterSpendAnalysis = () => {
    return useMutation({
        mutationFn: async (filters: {
            dateRange?: { start: string; end: string };
            vendorId?: string;
            category?: string;
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
