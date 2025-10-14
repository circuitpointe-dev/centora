import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DollarSign,
    FileText,
    ShoppingCart,
    Receipt,
    Search,
    Bell,
    ChevronDown,
    ArrowRight,
    TrendingUp,
    Calendar,
    Package,
    AlertTriangle,
    CheckCircle,
    Clock
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useProcurementStats, usePendingApprovals, useUpcomingDeliveries, useSpendOverTime } from '@/hooks/procurement/useProcurementStats';
import { useNavigate } from 'react-router-dom';

const ProcurementDashboard = () => {
    const navigate = useNavigate();
    const [timeFilter, setTimeFilter] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

    const { data: stats, isLoading: statsLoading } = useProcurementStats();
    const { data: pendingApprovals, isLoading: approvalsLoading } = usePendingApprovals();
    const { data: upcomingDeliveries, isLoading: deliveriesLoading } = useUpcomingDeliveries();
    const { data: spendData, isLoading: spendLoading } = useSpendOverTime(timeFilter);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (statsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 mt-1">Procurement management dashboard</p>
                </div>

            </div>


            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Spent */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total spent</CardTitle>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats ? formatCurrency(stats.totalSpent) : '$0'}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Requisitions */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Pending requisitions</CardTitle>
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-yellow-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats?.pendingRequisitions || 0}
                        </div>
                    </CardContent>
                </Card>

                {/* Open Purchase Orders */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Open purchase orders</CardTitle>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats?.openPurchaseOrders || 0}
                        </div>
                    </CardContent>
                </Card>

                {/* Outstanding Invoices */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Outstanding invoices</CardTitle>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Receipt className="h-5 w-5 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats?.outstandingInvoices || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approvals & Deliveries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Approvals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Pending approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {approvalsLoading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Requisitions</span>
                                        <span className="font-semibold">
                                            {pendingApprovals?.filter(a => a.type === 'requisition').length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">POs</span>
                                        <span className="font-semibold">
                                            {pendingApprovals?.filter(a => a.type === 'purchase_order').length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Payments</span>
                                        <span className="font-semibold">
                                            {pendingApprovals?.filter(a => a.type === 'payment').length || 0}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={() => navigate('/dashboard/procurement/approvals')}
                                    >
                                        Go to approvals list <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Deliveries */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Upcoming deliveries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {deliveriesLoading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Deliveries this week</span>
                                        <span className="font-semibold">
                                            {upcomingDeliveries?.filter(d => d.status === 'scheduled').length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Overdue deliveries</span>
                                        <span className="font-semibold text-red-600">
                                            {upcomingDeliveries?.filter(d => d.status === 'overdue').length || 0}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={() => navigate('/dashboard/procurement/deliveries')}
                                    >
                                        Go to upcoming deliveries list <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Spend Over Time Chart */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Spend over time</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/dashboard/procurement/analytics')}
                    >
                        View more analysis <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </CardHeader>
                <CardContent>
                    {spendLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={spendData}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickFormatter={(value) => `$${(value / 1000)}k`}
                                />
                                <Tooltip
                                    formatter={(value: number) => [formatCurrency(value), 'Spend']}
                                    labelStyle={{ color: '#374151' }}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fillOpacity={1}
                                    fill="url(#colorSpend)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProcurementDashboard;
