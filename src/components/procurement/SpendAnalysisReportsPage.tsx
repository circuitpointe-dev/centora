import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    Filter,
    Download,
    Calendar,
    DollarSign,
    TrendingUp,
    Loader2,
    Wallet,
    Building,
    FileText,
    Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import {
    useSpendAnalysisStats,
    useSpendByVendorLineData,
    useSpendByVendorPieData,
    useSpendByCategoryBarData,
    useExportSpendAnalysis,
    useFilterSpendAnalysis,
    type SpendAnalysisStats,
    type SpendByVendorLineData,
    type SpendByVendorPieData,
    type SpendByCategoryBarData
} from '@/hooks/procurement/useSpendAnalysis';

const SpendAnalysisReportsPage: React.FC = () => {
    const [dateRange, setDateRange] = useState('Jul 1, 2025 - Aug 1, 2025');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Backend data hooks
    const { data: stats, isLoading: statsLoading, error: statsError } = useSpendAnalysisStats();
    const { data: lineData, isLoading: lineLoading, error: lineError } = useSpendByVendorLineData();
    const { data: pieData, isLoading: pieLoading, error: pieError } = useSpendByVendorPieData();
    const { data: barData, isLoading: barLoading, error: barError } = useSpendByCategoryBarData();
    const exportData = useExportSpendAnalysis();
    const filterData = useFilterSpendAnalysis();

    const handleExport = async (exportType: 'vendors' | 'transactions' | 'categories' | 'summary') => {
        try {
            await exportData.mutateAsync(exportType);
            toast.success(`${exportType} data exported successfully`);
        } catch (error) {
            toast.error('Failed to export data');
        }
    };

    const handleFilter = async () => {
        try {
            await filterData.mutateAsync({
                dateRange: { start: '2025-07-01', end: '2025-08-01' }
            });
            toast.success('Filters applied successfully');
        } catch (error) {
            toast.error('Failed to apply filters');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatCurrencyShort = (amount: number) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return formatCurrency(amount);
    };

    if (statsLoading || lineLoading || pieLoading || barLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading spend analysis reports...</p>
                </div>
            </div>
        );
    }

    if (statsError || lineError || pieError || barError) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-destructive">
                            {(statsError as any)?.message || (lineError as any)?.message ||
                                (pieError as any)?.message || (barError as any)?.message ||
                                'Failed to load spend analysis reports'}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f7fa] min-h-screen">
            {/* Main Content */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
                {/* Date Range and Action Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <img src="/solar-calendar-outline0.svg" alt="calendar" className="w-4 h-4" />
                            <span className="text-sm font-medium text-gray-700">{dateRange}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport('summary')}
                            className="flex items-center gap-2"
                            disabled={exportData.isPending}
                        >
                            <img src="/uil-export0.svg" alt="export" className="w-4 h-4" />
                            Export
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleFilter}
                            className="flex items-center gap-2"
                            disabled={filterData.isPending}
                        >
                            <img src="/ion-filter0.svg" alt="filter" className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Summary Cards - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {/* Top Spend Card */}
                    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <Wallet className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Top spend</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    {formatCurrencyShort(stats?.topSpend || 0)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Vendor Card */}
                    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <Building className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Top vendor - {stats?.topVendor || 'N/A'}</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    {formatCurrencyShort(stats?.topVendorAmount || 0)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Category Card */}
                    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Top category - {stats?.topCategory || 'N/A'}</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    {formatCurrencyShort(stats?.topCategoryAmount || 0)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Period vs Last Period Card */}
                    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <img src="/typcn-time0.svg" alt="period" className="w-6 h-6 lg:w-8 lg:h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Period vs Last period</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    +{stats?.periodVsLastPeriod || 0}%
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Spend by Vendor Line Chart - Responsive */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-4 lg:p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by vendor</h3>
                        <div className="h-64 lg:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrency(value), 'Spend']}
                                        labelFormatter={(label) => `Month: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts Section - Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Spend by Vendor Pie Chart */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-4 lg:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by vendor</h3>
                            <div className="h-64 lg:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData || []}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ vendor_name, percentage }) => `${vendor_name}: ${percentage.toFixed(1)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="amount"
                                        >
                                            {(pieData || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Spend by Category Bar Chart */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-4 lg:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend by category</h3>
                            <div className="h-64 lg:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="category"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [formatCurrency(value), 'Amount']}
                                            labelFormatter={(label) => `Category: ${label}`}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="total"
                                            fill="#3b82f6"
                                            radius={[2, 2, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SpendAnalysisReportsPage;
