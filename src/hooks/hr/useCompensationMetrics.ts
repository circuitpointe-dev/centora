import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CompensationMetrics {
    totalBenchmarks: number;
    averageCompaRatio: number; // 0..n
    outOfBand: number;
    pendingApprovalsPct: number; // 0..100
}

function parseMoney(value?: string): number | null {
    if (!value) return null;
    const v = value.trim().toLowerCase();
    // Extract number and scale by suffix (m, k)
    const match = v.match(/([0-9]+(?:\.[0-9]+)?)(\s*[mk])?/);
    if (!match) return null;
    const num = parseFloat(match[1]);
    const suffix = match[2]?.trim();
    if (suffix === 'm') return num * 1_000_000;
    if (suffix === 'k') return num * 1_000;
    return num;
}

function parseBandToMidpoint(band?: string): number | null {
    if (!band) return null;
    // Expect formats like "7.0m NGN - 9.5m NGN"
    const parts = band.split('-');
    if (parts.length !== 2) return null;
    const low = parseMoney(parts[0]);
    const high = parseMoney(parts[1]);
    if (low == null || high == null) return null;
    return (low + high) / 2;
}

export function useCompensationMetrics() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['hr-compensation-metrics', user?.org_id],
        queryFn: async (): Promise<CompensationMetrics> => {
            if (!user?.org_id) return { totalBenchmarks: 0, averageCompaRatio: 0, outOfBand: 0, pendingApprovalsPct: 0 };

            // Fetch benchmarks
            const { data: benchmarks = [] } = await (supabase as any)
                .from('hr_salary_benchmarks')
                .select('market_p25, market_p50, market_p75, internal_band')
                .eq('org_id', user.org_id);

            const totalBenchmarks = benchmarks.length;

            // Compute compa-ratio as internal mid / market P50
            let ratios: number[] = [];
            let outOfBand = 0;
            for (const b of benchmarks) {
                const p25 = parseMoney(b.market_p25);
                const p50 = parseMoney(b.market_p50);
                const p75 = parseMoney(b.market_p75);
                const internalMid = parseBandToMidpoint(b.internal_band);
                if (p50 && internalMid) {
                    ratios.push(internalMid / p50);
                }
                if (p25 != null && p75 != null && internalMid != null) {
                    if (internalMid < p25 || internalMid > p75) outOfBand++;
                }
            }
            const averageCompaRatio = ratios.length ? parseFloat((ratios.reduce((a, b) => a + b, 0) / ratios.length).toFixed(2)) : 0;

            // Pending approvals percentage from policy acknowledgments
            const { data: ackRows = [] } = await (supabase as any)
                .from('hr_policy_acknowledgments')
                .select('status')
                .eq('org_id', user.org_id);
            const totalAcks = ackRows.length;
            const pending = ackRows.filter((r: any) => r.status !== 'acknowledged').length;
            const pendingApprovalsPct = totalAcks ? Math.round((pending / totalAcks) * 100) : 0;

            return { totalBenchmarks, averageCompaRatio, outOfBand, pendingApprovalsPct };
        },
        staleTime: 5 * 60 * 1000,
    });
}
