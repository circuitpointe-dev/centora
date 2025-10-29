import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HRStats {
    headcount: number;
    headcountChange: number; // percentage change
    newHires: number;
    attritionRate: number;
    attritionChange: number;
    openReqs: number;
    policyAckRate: number;
    trainingCompletion: number;
    expiringDocs: number;
}

export interface HeadcountTrend {
    month: string;
    value: number;
}

export interface AttritionData {
    month: string;
    voluntary: number;
    involuntary: number;
    other: number;
}

export interface RecruitingFunnel {
    stage: string;
    value: number;
}

export interface TrainingCompletion {
    name: string;
    value: number;
}

export const useHRStats = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-stats', user?.org_id],
        queryFn: async (): Promise<HRStats> => {
            if (!user?.org_id) throw new Error('No organization');

            try {
                // Get current headcount (active employees)
                const { count: currentHeadcount, error: headcountError } = await (supabase as any)
                    .from('hr_employees')
                    .select('*', { count: 'exact', head: true })
                    .eq('org_id', user.org_id)
                    .eq('status', 'active');

                if (headcountError && headcountError.code !== 'PGRST116') {
                    console.error('Error fetching headcount:', headcountError);
                }

                // Get headcount from 30 days ago for comparison
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const { count: previousHeadcount } = await (supabase as any)
                    .from('hr_headcount_history')
                    .select('*', { count: 'exact', head: true })
                    .eq('org_id', user.org_id)
                    .lte('record_date', thirtyDaysAgo.toISOString().split('T')[0])
                    .order('record_date', { ascending: false })
                    .limit(1);

                const current = currentHeadcount || 0;
                const previous = previousHeadcount || current;
                const headcountChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;

                // Get new hires in last 30 days
                const { count: newHires } = await (supabase as any)
                    .from('hr_employees')
                    .select('*', { count: 'exact', head: true })
                    .eq('org_id', user.org_id)
                    .gte('hire_date', thirtyDaysAgo.toISOString().split('T')[0]);

                // Calculate attrition rate (TTM - last 12 months)
                const twelveMonthsAgo = new Date();
                twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

                const { count: terminations } = await (supabase as any)
                    .from('hr_attrition')
                    .select('*', { count: 'exact', head: true })
                    .eq('org_id', user.org_id)
                    .gte('exit_date', twelveMonthsAgo.toISOString().split('T')[0]);

                const averageHeadcount = current; // Simplified
                const attritionRate = averageHeadcount > 0
                    ? ((terminations || 0) / averageHeadcount) * 100
                    : 0;

                // Get previous attrition rate
                const previousAttrition = 9.6; // This would come from historical data
                const attritionChange = previousAttrition > 0
                    ? ((attritionRate - previousAttrition) / previousAttrition) * 100
                    : 0;

                // Get open job postings
                const { count: openReqs } = await (supabase as any)
                    .from('hr_job_postings')
                    .select('*', { count: 'exact', head: true })
                    .eq('org_id', user.org_id)
                    .eq('status', 'open');

                // Get policy acknowledgment rate
                const { count: totalEmployees } = await (supabase as any)
                    .from('hr_employees')
                    .select('*', { count: 'exact', head: true })
                    .eq('org_id', user.org_id)
                    .eq('status', 'active');

                // Using policy_acknowledgments table (assuming it exists)
                const { count: acknowledged } = await supabase
                    .from('policy_acknowledgments')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'acknowledged');

                const policyAckRate = totalEmployees && totalEmployees > 0
                    ? ((acknowledged || 0) / totalEmployees) * 100
                    : 0;

                // Get training completion rate
                const { data: trainingRecords } = await (supabase as any)
                    .from('hr_training_records')
                    .select('completion_status, completion_percentage')
                    .eq('org_id', user.org_id);

                const completedTrainings = trainingRecords?.filter(
                    t => t.completion_status === 'completed'
                ).length || 0;
                const totalTrainings = trainingRecords?.length || 1;
                const trainingCompletion = (completedTrainings / totalTrainings) * 100;

                // Get expiring documents (next 30 days)
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

                const { count: expiringDocs } = await (supabase as any)
                    .from('hr_employee_documents')
                    .select('*', { count: 'exact', head: true })
                    .eq('org_id', user.org_id)
                    .lte('expiry_date', thirtyDaysFromNow.toISOString().split('T')[0])
                    .gte('expiry_date', new Date().toISOString().split('T')[0]);

                return {
                    headcount: current,
                    headcountChange,
                    newHires: newHires || 0,
                    attritionRate,
                    attritionChange,
                    openReqs: openReqs || 0,
                    policyAckRate,
                    trainingCompletion,
                    expiringDocs: expiringDocs || 0,
                };
            } catch (error) {
                console.error('Error fetching HR stats:', error);
                // Return default values if tables don't exist yet
                return {
                    headcount: 0,
                    headcountChange: 0,
                    newHires: 0,
                    attritionRate: 0,
                    attritionChange: 0,
                    openReqs: 0,
                    policyAckRate: 0,
                    trainingCompletion: 0,
                    expiringDocs: 0,
                };
            }
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useHeadcountTrend = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-headcount-trend', user?.org_id],
        queryFn: async (): Promise<HeadcountTrend[]> => {
            if (!user?.org_id) throw new Error('No organization');

            try {
                const { data } = await (supabase as any)
                    .from('hr_headcount_history')
                    .select('record_date, total_headcount')
                    .eq('org_id', user.org_id)
                    .gte('record_date', new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().split('T')[0])
                    .order('record_date', { ascending: true })
                    .limit(12);

                if (!data || data.length === 0) {
                    // Return sample data if no data exists
                    return [
                        { month: 'Jan', value: 240 },
                        { month: 'Feb', value: 245 },
                        { month: 'Mar', value: 250 },
                        { month: 'Apr', value: 256 },
                    ];
                }

                return data.map((item) => ({
                    month: new Date(item.record_date).toLocaleDateString('en-US', { month: 'short' }),
                    value: item.total_headcount,
                }));
            } catch (error) {
                console.error('Error fetching headcount trend:', error);
                return [];
            }
        },
    });
};

export const useAttritionData = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-attrition-data', user?.org_id],
        queryFn: async (): Promise<AttritionData[]> => {
            if (!user?.org_id) throw new Error('No organization');

            try {
                const { data } = await (supabase as any)
                    .from('hr_attrition')
                    .select('exit_date, exit_reason')
                    .eq('org_id', user.org_id)
                    .gte('exit_date', new Date(new Date().setMonth(new Date().getMonth() - 4)).toISOString().split('T')[0])
                    .order('exit_date', { ascending: true });

                if (!data || data.length === 0) {
                    return [
                        { month: 'Jan', voluntary: 2, involuntary: 1, other: 0 },
                        { month: 'Feb', voluntary: 3, involuntary: 1, other: 1 },
                        { month: 'Mar', voluntary: 1, involuntary: 2, other: 0 },
                        { month: 'Apr', voluntary: 2, involuntary: 1, other: 1 },
                    ];
                }

                // Group by month
                const grouped: { [key: string]: AttritionData } = {};
                data.forEach((item) => {
                    const month = new Date(item.exit_date).toLocaleDateString('en-US', { month: 'short' });
                    if (!grouped[month]) {
                        grouped[month] = { month, voluntary: 0, involuntary: 0, other: 0 };
                    }
                    if (item.exit_reason === 'voluntary') grouped[month].voluntary++;
                    else if (item.exit_reason === 'involuntary') grouped[month].involuntary++;
                    else grouped[month].other++;
                });

                return Object.values(grouped);
            } catch (error) {
                console.error('Error fetching attrition data:', error);
                return [];
            }
        },
    });
};

export const useRecruitingFunnel = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-recruiting-funnel', user?.org_id],
        queryFn: async (): Promise<RecruitingFunnel[]> => {
            if (!user?.org_id) throw new Error('No organization');

            try {
                const { data } = await (supabase as any)
                    .from('hr_job_applications')
                    .select('stage')
                    .eq('org_id', user.org_id)
                    .eq('status', 'active');

                if (!data || data.length === 0) {
                    return [
                        { stage: 'Applied', value: 0 },
                        { stage: 'Screen', value: 0 },
                        { stage: 'Interview', value: 0 },
                        { stage: 'Offer', value: 0 },
                    ];
                }

                const funnel: RecruitingFunnel[] = [
                    { stage: 'Applied', value: data.filter(d => d.stage === 'applied').length },
                    { stage: 'Screen', value: data.filter(d => d.stage === 'screen').length },
                    { stage: 'Interview', value: data.filter(d => d.stage === 'interview').length },
                    { stage: 'Offer', value: data.filter(d => d.stage === 'offer').length },
                ];

                return funnel;
            } catch (error) {
                console.error('Error fetching recruiting funnel:', error);
                return [];
            }
        },
    });
};

export const useTrainingCompletion = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-training-completion', user?.org_id],
        queryFn: async (): Promise<TrainingCompletion[]> => {
            if (!user?.org_id) throw new Error('No organization');

            try {
                const { data } = await (supabase as any)
                    .from('hr_training_records')
                    .select('completion_status')
                    .eq('org_id', user.org_id);

                if (!data || data.length === 0) {
                    return [
                        { name: 'Acknowledged', value: 0 },
                        { name: 'Pending', value: 0 },
                    ];
                }

                const acknowledged = data.filter(t => t.completion_status === 'completed').length;
                const pending = data.filter(t => t.completion_status !== 'completed').length;

                return [
                    { name: 'Acknowledged', value: acknowledged },
                    { name: 'Pending', value: pending },
                ];
            } catch (error) {
                console.error('Error fetching training completion:', error);
                return [];
            }
        },
    });
};

