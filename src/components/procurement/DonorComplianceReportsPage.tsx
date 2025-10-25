import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search,
    Filter,
    Download,
    Calendar,
    FileText,
    CheckCircle,
    DollarSign,
    AlertTriangle,
    Loader2,
    TrendingUp,
    Users,
    Wallet,
    Flag
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    useDonorComplianceStats,
    useSpendVsBudgetData,
    useComplianceNotes,
    useVendorSpendData,
    useExportDonorCompliance,
    useFilterDonorCompliance,
    type DonorComplianceStats,
    type SpendVsBudgetData,
    type DonorComplianceNote,
    type DonorVendorSpend
} from '@/hooks/procurement/useDonorCompliance';

const DonorComplianceReportsPage: React.FC = () => {
    const [dateRange, setDateRange] = useState('Jul 1, 2025 - Aug 1, 2025');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Backend data hooks
    const { data: stats, isLoading: statsLoading, error: statsError } = useDonorComplianceStats();
    const { data: spendVsBudgetData, isLoading: chartLoading, error: chartError } = useSpendVsBudgetData();
    const { data: complianceNotes, isLoading: notesLoading, error: notesError } = useComplianceNotes();
    const { data: vendorSpendData, isLoading: vendorLoading, error: vendorError } = useVendorSpendData();
    const exportData = useExportDonorCompliance();
    const filterData = useFilterDonorCompliance();

    const handleExport = async (exportType: 'grants' | 'projects' | 'compliance' | 'spend') => {
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

    const getComplianceStatusColor = (status: string) => {
        switch (status) {
            case 'compliant':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'flagged':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending_review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'non_compliant':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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

    if (statsLoading || chartLoading || notesLoading || vendorLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading donor compliance reports...</p>
                </div>
            </div>
        );
    }

    if (statsError || chartError || notesError || vendorError) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-destructive">
                            {(statsError as any)?.message || (chartError as any)?.message ||
                                (notesError as any)?.message || (vendorError as any)?.message ||
                                'Failed to load donor compliance reports'}
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
                            onClick={() => handleExport('compliance')}
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
                    {/* Total Grants Card */}
                    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total grants</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats?.totalGrants || 0}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Projects Card */}
                    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <img src="/nrk-check-active0.svg" alt="active" className="w-6 h-6 lg:w-8 lg:h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active projects</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats?.activeProjects || 0}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Spend Report Card */}
                    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <Wallet className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Spend report this period</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    {formatCurrency(stats?.spendReportThisPeriod || 0)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compliance Issues Card */}
                    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 lg:p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-lg flex items-center justify-center mb-3 lg:mb-4">
                                    <img src="/bxs-error0.svg" alt="issues" className="w-6 h-6 lg:w-8 lg:h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance issues</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stats?.complianceIssues || 0} flagged</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Compliance Notes - Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Spend vs Budget Chart */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-4 lg:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend vs Budget</h3>
                            <div className="h-64 lg:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={spendVsBudgetData || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="project_name"
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [formatCurrency(value), '']}
                                            labelFormatter={(label) => `Project: ${label}`}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="budget_amount"
                                            fill="#7c3aed"
                                            name="Budget"
                                            radius={[2, 2, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="spent_amount"
                                            fill="#3b82f6"
                                            name="Actual spend"
                                            radius={[2, 2, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compliance Notes */}
                    <Card className="bg-white border-0 shadow-sm">
                        <CardContent className="p-4 lg:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance notes</h3>
                            {complianceNotes && complianceNotes.length > 0 ? (
                                <div className="space-y-3">
                                    {complianceNotes.map((note) => (
                                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900">Document ID:</span>
                                                    <span className="text-gray-700">{note.document_id}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900">Compliance Date:</span>
                                                    <span className="text-gray-700">{note.compliance_date}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900">Audit Status:</span>
                                                    <Badge className={`${getComplianceStatusColor(note.audit_status.toLowerCase())} border`}>
                                                        {note.audit_status}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-900">Responsible Officer:</span>
                                                    <span className="text-gray-700">{note.responsible_officer}</span>
                                                </div>
                                                <div className="pt-2 border-t">
                                                    <span className="font-medium text-gray-900">Notes:</span>
                                                    <p className="text-gray-700 mt-1">{note.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Flag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p>No compliance notes available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Spend by Vendor Table - Responsive */}
                <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="p-4 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Spend by vendor</h3>
                            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                                <div className="relative">
                                    <Input
                                        placeholder="Search vendors..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full sm:w-64 pr-10"
                                    />
                                    <img
                                        src="/search0.svg"
                                        alt="search"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Amount spent</TableHead>
                                        <TableHead>Grant / project</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vendorSpendData && vendorSpendData.length > 0 ? (
                                        vendorSpendData
                                            .filter(vendor =>
                                                searchTerm === '' ||
                                                vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((vendor) => (
                                                <TableRow key={vendor.id}>
                                                    <TableCell className="font-medium">{vendor.vendor_name}</TableCell>
                                                    <TableCell>{formatCurrency(vendor.amount_spent)}</TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-gray-600">
                                                            Project {vendor.project_id.slice(-4)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`${getComplianceStatusColor(vendor.compliance_status)} border`}>
                                                            {vendor.compliance_status.charAt(0).toUpperCase() + vendor.compliance_status.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                <p>No vendor spend data available</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DonorComplianceReportsPage;
