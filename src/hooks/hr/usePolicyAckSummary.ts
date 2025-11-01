import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PolicyAckRow {
    policy_id: string;
    title: string;
    category?: string;
    updated_at_date?: string | null;
    version?: string | null;
    assigned: number;
    acknowledged: number;
    overdue: number;
    last_reminded_at?: string | null;
}

export interface PolicyAckTotals {
    totalAssigned: number;
    totalAcknowledged: number;
    totalOverdue: number;
}

export function usePolicyAckSummary(search?: string) {
    const { user } = useAuth();
    return useQuery({
        queryKey: ['hr-policy-ack-summary', user?.org_id, search],
        queryFn: async (): Promise<{ rows: PolicyAckRow[]; totals: PolicyAckTotals }> => {
            if (!user?.org_id) return { rows: [], totals: { totalAssigned: 0, totalAcknowledged: 0, totalOverdue: 0 } };
            const { data: policies, error: pErr } = await (supabase as any)
                .from('hr_policies')
                .select('id, title, category, version, updated_at_date')
                .eq('org_id', user.org_id);
            if (pErr) throw pErr;
            const { data: acks, error: aErr } = await (supabase as any)
                .from('hr_policy_acknowledgments')
                .select('policy_id, status, last_reminded_at')
                .eq('org_id', user.org_id);
            if (aErr) throw aErr;

            const byPolicy: Record<string, PolicyAckRow> = {};
            for (const p of (policies || [])) {
                byPolicy[p.id] = {
                    policy_id: p.id,
                    title: p.title,
                    category: p.category,
                    version: p.version,
                    updated_at_date: p.updated_at_date,
                    assigned: 0,
                    acknowledged: 0,
                    overdue: 0,
                    last_reminded_at: null,
                };
            }
            for (const a of (acks || [])) {
                const row = byPolicy[a.policy_id];
                if (!row) continue;
                row.assigned += 1;
                if (a.status === 'acknowledged') row.acknowledged += 1;
                if (a.status === 'overdue') row.overdue += 1;
                if (a.last_reminded_at) {
                    if (!row.last_reminded_at || new Date(a.last_reminded_at) > new Date(row.last_reminded_at)) {
                        row.last_reminded_at = a.last_reminded_at;
                    }
                }
            }
            let rows = Object.values(byPolicy);
            if (search && search.trim()) {
                const s = search.toLowerCase();
                rows = rows.filter(r =>
                    r.title.toLowerCase().includes(s) ||
                    (r.category?.toLowerCase().includes(s))
                );
            }
            const totals = rows.reduce((acc, r) => {
                acc.totalAssigned += r.assigned;
                acc.totalAcknowledged += r.acknowledged;
                acc.totalOverdue += r.overdue;
                return acc;
            }, { totalAssigned: 0, totalAcknowledged: 0, totalOverdue: 0 } as PolicyAckTotals);
            return { rows, totals };
        },
        staleTime: 5 * 60 * 1000,
    });
}
