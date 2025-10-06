import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FundingRaisedData {
    category: string;
    value: number;
}

export interface ProposalActivityData {
    month: string;
    submitted: number;
    approved: number;
    total: number;
    drafted: number;
}

export interface DonorSegmentationData {
    name: string;
    value: number;
}

export const useAnalyticsData = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['analytics-data', user?.org_id],
        queryFn: async () => {
            if (!user?.org_id) throw new Error('No organization');

            // Get funding raised by sector
            const { data: sectorData } = await supabase
                .from('grants')
                .select(`
          amount,
          program_area
        `)
                .eq('org_id', user.org_id)
                .eq('status', 'active');

            // Get funding raised by donor type (using status as type)
            const { data: donorTypeData } = await supabase
                .from('grants')
                .select(`
          amount,
          status
        `)
                .eq('org_id', user.org_id)
                .eq('status', 'active');

            // Get proposal activity data (last 12 months)
            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

            const { data: proposalData } = await supabase
                .from('proposals')
                .select(`
          created_at,
          status,
          opportunity_id
        `)
                .eq('org_id', user.org_id)
                .gte('created_at', twelveMonthsAgo.toISOString());

            // Get donor segmentation data
            const { data: donorData } = await supabase
                .from('donors')
                .select(`
          status
        `)
                .eq('org_id', user.org_id);

            // Process funding raised by sector
            const fundingBySector: FundingRaisedData[] = [];
            if (sectorData) {
                const sectorTotals = sectorData.reduce((acc, grant) => {
                    const sector = (grant as any).program_area || 'Other';
                    acc[sector] = (acc[sector] || 0) + ((grant as any).amount || 0);
                    return acc;
                }, {} as Record<string, number>);

                fundingBySector.push(...Object.entries(sectorTotals).map(([category, value]) => ({
                    category,
                    value
                })));
            }

            // Process funding raised by donor type
            const fundingByDonorType: FundingRaisedData[] = [];
            if (donorTypeData) {
                const donorTypeTotals = donorTypeData.reduce((acc, grant) => {
                    const donorType = (grant as any).status || 'Other';
                    acc[donorType] = (acc[donorType] || 0) + ((grant as any).amount || 0);
                    return acc;
                }, {} as Record<string, number>);

                fundingByDonorType.push(...Object.entries(donorTypeTotals).map(([category, value]) => ({
                    category,
                    value
                })));
            }

            // Process proposal activity data
            const proposalActivity: ProposalActivityData[] = [];
            if (proposalData) {
                const monthlyData = proposalData.reduce((acc, proposal) => {
                    const date = new Date(proposal.created_at);
                    const month = date.toLocaleDateString('en-US', { month: 'short' });
                    const year = date.getFullYear();
                    const key = `${month}-${year}`;

                    if (!acc[key]) {
                        acc[key] = { month, submitted: 0, approved: 0, total: 0, drafted: 0 };
                    }

                    acc[key].total++;
                    if (proposal.status === 'submitted') acc[key].submitted++;
                    if (proposal.status === 'approved') acc[key].approved++;
                    if (proposal.status === 'draft') acc[key].drafted++;

                    return acc;
                }, {} as Record<string, ProposalActivityData>);

                proposalActivity.push(...Object.values(monthlyData).sort((a, b) => {
                    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
                }));
            }

            // Process donor segmentation by type (using status as type for now)
            const donorSegmentationByType: DonorSegmentationData[] = [];
            if (donorData) {
                const typeCounts = donorData.reduce((acc, donor) => {
                    const type = (donor as any).status || 'Other';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                donorSegmentationByType.push(...Object.entries(typeCounts).map(([name, value]) => ({
                    name,
                    value
                })));
            }

            // Process donor segmentation by focus areas (empty for now)
            const donorSegmentationByFocus: DonorSegmentationData[] = [];

            return {
                fundingRaised: {
                    Sector: fundingBySector,
                    'Donor Type': fundingByDonorType,
                    Teams: [] // Could be implemented with team assignments
                },
                proposalActivity: {
                    Donor: proposalActivity,
                    Sector: proposalActivity // Same data for now
                },
                donorSegmentation: {
                    Type: donorSegmentationByType,
                    Sector: donorSegmentationByFocus,
                    Geography: [], // Could be implemented with location data
                    'Interest Tags': donorSegmentationByFocus
                }
            };
        },
        enabled: !!user?.org_id,
    });
};
