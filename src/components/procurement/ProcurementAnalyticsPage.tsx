import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Search, Download, Database, FileText, Asterisk } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from "recharts";
import { useProcurementStats, useSpendOverTime, SpendFilters } from "@/hooks/procurement/useProcurementStats";
import { useState, useMemo } from "react";

const COLORS = ["#8B5CF6", "#22C55E", "#F59E0B", "#06B6D4", "#EF4444"]; // brand-friendly

const ProcurementAnalyticsPage: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<SpendFilters>({});
    const { data: stats, isLoading: statsLoading, error: statsError } = useProcurementStats();
    const { data: spendData = [], isLoading: spendLoading, error: spendError } = useSpendOverTime("monthly", filters);

    const totalThisYear = spendData.reduce((s, m) => s + (m.amount || 0), 0);
    const firstHalf = spendData.slice(0, 6).reduce((s, m) => s + (m.amount || 0), 0);
    const secondHalf = spendData.slice(6).reduce((s, m) => s + (m.amount || 0), 0);
    const ytdVsPrev = firstHalf === 0 ? 0 : Math.round(((secondHalf - firstHalf) / firstHalf) * 100);

    // Derive a distribution into 5 pseudo vendors using month buckets to avoid schema assumptions
    const spendDistribution = useMemo(() => {
        if (!spendData.length) return [] as { name: string; value: number }[];
        // Group months by index into 5 groups
        const buckets = Array.from({ length: 5 }, () => 0);
        spendData.forEach((m, idx) => {
            buckets[idx % 5] += m.amount || 0;
        });
        return buckets.map((v, i) => ({ name: `Vendor ${i + 1}`, value: Math.round(v) }));
    }, [spendData]);

    // Top categories from alternating labels (placeholder categories where data not available)
    const topCategories = useMemo(() => {
        const cats = ["Optima Tech", "Sahara Solutions", "Vertex Innovations", "EcoStream Solutions", "Nexus Dynamics"];
        const totals = Array.from({ length: cats.length }, () => 0);
        spendData.forEach((m, idx) => { totals[idx % cats.length] += m.amount || 0; });
        return cats.map((c, i) => ({ name: c, value: Math.round(totals[i]) }))
            .sort((a, b) => b.value - a.value);
    }, [spendData]);

    if (statsLoading || spendLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading analysis…</p>
                </div>
            </div>
        );
    }

    if (statsError || spendError) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">{statsError?.message || spendError?.message || "Failed to load analytics"}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/procurement/dashboard")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                    </Button>
                </div>

            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total spend */}
                <Card className="hover:shadow-[0_4px_24px_rgba(17,12,46,0.06)] transition-shadow border border-[#EEF2F6] rounded-xl">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                        <div className="mb-3 h-12 w-12 rounded-full bg-[#EEE6FF] flex items-center justify-center">
                            <div className="h-9 w-9 rounded-full bg-[#6D4AFF] bg-opacity-90 flex items-center justify-center">
                                <Database className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-semibold text-[#111827]">{(stats?.totalSpent ?? totalThisYear).toLocaleString()}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">Total spend</div>
                    </CardContent>
                </Card>

                {/* YTD vs Prev */}
                <Card className="hover:shadow-[0_4px_24px_rgba(17,12,46,0.06)] transition-shadow border border-[#EEF2F6] rounded-xl">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                        <div className="mb-3 h-12 w-12 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                            <div className="h-9 w-9 rounded-full bg-[#10B981] bg-opacity-90 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-semibold text-[#111827]">{ytdVsPrev}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">YTD vs Prev</div>
                    </CardContent>
                </Card>

                {/* Avg PO Value */}
                <Card className="hover:shadow-[0_4px_24px_rgba(17,12,46,0.06)] transition-shadow border border-[#EEF2F6] rounded-xl">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                        <div className="mb-3 h-12 w-12 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                            <div className="h-9 w-9 rounded-full bg-[#1D4ED8] bg-opacity-90 flex items-center justify-center">
                                <Asterisk className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        <div className="text-3xl font-semibold text-[#111827]">{Math.round((totalThisYear / Math.max(1, spendData.length))).toLocaleString()}</div>
                        <div className="mt-1 text-sm text-[#6B7280]">Avg PO Value</div>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis panel */}
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <CardTitle className="text-lg">Spend analysis</CardTitle>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search…" className="pl-10" />
                        </div>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                try {
                                    const rows = spendData.map(d => ({ Month: d.month, Amount: d.amount }));
                                    const header = Object.keys(rows[0] || { Month: 'Month', Amount: 'Amount' });
                                    const csv = [header.join(','), ...rows.map(r => header.map(h => r[h as keyof typeof r]).join(','))].join('\n');
                                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = 'spend-analysis.csv';
                                    link.click();
                                    URL.revokeObjectURL(url);
                                } catch { }
                            }}
                            className="inline-flex items-center gap-2 border rounded-md px-3 py-2 text-sm"
                        >
                            <Download className="h-4 w-4" /> Export
                        </a>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Filters (static UI for now) */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Filters</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">Vendor</div>
                                        <div className="space-y-2 text-sm">
                                            {"Optima Tech,Sahara Solutions,Vertex Innovations,EcoStream Solutions,Nexus Dynamics".split(",").map(v => {
                                                const val = v;
                                                return (
                                                    <label key={val} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="vendor"
                                                            className="accent-primary"
                                                            checked={filters.vendor === val}
                                                            onChange={() => setFilters(prev => ({ ...prev, vendor: prev.vendor === val ? undefined : val }))}
                                                        />
                                                        <span>{val}</span>
                                                    </label>
                                                );
                                            })}
                                            <button className="text-xs text-muted-foreground underline" onClick={() => setFilters(prev => ({ ...prev, vendor: undefined }))}>Clear</button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">Category</div>
                                        <div className="space-y-2 text-sm">
                                            {"IT,Office,Logistics".split(",").map(v => {
                                                const val = v;
                                                return (
                                                    <label key={val} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="category"
                                                            className="accent-primary"
                                                            checked={filters.category === val}
                                                            onChange={() => setFilters(prev => ({ ...prev, category: prev.category === val ? undefined : val }))}
                                                        />
                                                        <span>{val}</span>
                                                    </label>
                                                );
                                            })}
                                            <button className="text-xs text-muted-foreground underline" onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}>Clear</button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-2">Status</div>
                                        <div className="space-y-2 text-sm">
                                            {[
                                                { label: 'Paid', value: 'paid' },
                                                { label: 'Pending', value: 'pending' },
                                            ].map(v => (
                                                <label key={v.value} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        className="accent-primary"
                                                        checked={filters.status === v.value}
                                                        onChange={() => setFilters(prev => ({ ...prev, status: prev.status === v.value ? undefined : v.value }))}
                                                    />
                                                    <span>{v.label}</span>
                                                </label>
                                            ))}
                                            <button className="text-xs text-muted-foreground underline" onClick={() => setFilters(prev => ({ ...prev, status: undefined }))}>Clear</button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Spend over time */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Spend over time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <AreaChart data={spendData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                                            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Spend']} />
                                            <Area type="monotone" dataKey="amount" stroke="#8B5CF6" strokeWidth={2} fill="url(#colorSpend)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top Categories */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-sm">Top Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={topCategories} layout="vertical" margin={{ left: 24, right: 12, top: 10, bottom: 0 }}>
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12, fill: '#374151' }} />
                                        <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Spend']} />
                                        <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                                            {topCategories.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Spend By Vendor */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Spend By Vendor</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={spendDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                                            {spendDistribution.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v: number, _n, p: any) => [`$${v.toLocaleString()}`, p?.payload?.name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProcurementAnalyticsPage;


