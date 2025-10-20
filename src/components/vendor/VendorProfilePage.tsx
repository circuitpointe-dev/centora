import React, { useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useVendors, useVendorContracts, useVendorDocuments, useVendorPerformance, useUpdateVendor, useCreateVendorDocument, useCreateVendorContract, useCreateVendorPerformance, useUploadVendorDocument, useBulkCreateVendorContracts, useBulkCreateVendorDocuments, useDeleteVendorContract } from '@/hooks/procurement/useVendors';
import { useVendorCompanyInfo, useVendorBankingInfo, useVendorCertificates, useUpsertVendorCompanyInfo, useUpsertVendorBankingInfo, useUpsertVendorCertificate, useDeleteVendorCertificate } from '@/hooks/procurement/useVendorVetting';
import { useVendorRiskAssessment, useVendorPerformanceMetrics, useVendorCategories, useVendorComplianceStatus, useUpsertVendorRiskAssessment, useUpsertVendorPerformanceMetrics, useUpsertVendorCategory, useUpsertVendorComplianceStatus } from '@/hooks/procurement/useVendorClassifications';
import EditVendorModal from './EditVendorModal';
import AddContractModal from './AddContractModal';

const VendorProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'vetting' | 'classifications' | 'contracts' | 'performance'>('overview');
    const [isSnapshotExpanded, setIsSnapshotExpanded] = useState(false);
    const [isContactExpanded, setIsContactExpanded] = useState(false);

    // Vetting checklist collapsible states
    const [isCompanyExpanded, setIsCompanyExpanded] = useState(false);
    const [isBankingExpanded, setIsBankingExpanded] = useState(false);
    const [isCertificatesExpanded, setIsCertificatesExpanded] = useState(false);

    // Classifications collapsible states
    const [isRiskExpanded, setIsRiskExpanded] = useState(false);
    const [isPerformanceExpanded, setIsPerformanceExpanded] = useState(false);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
    const [isComplianceExpanded, setIsComplianceExpanded] = useState(false);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddContractOpen, setIsAddContractOpen] = useState(false);
    const [contractSearch, setContractSearch] = useState('');
    const [contractFilter, setContractFilter] = useState('all');

    const { data, isLoading, error } = useVendors({ page: 1, limit: 1, search: id || '', status: '' });
    const vendor = (data?.vendors || []).find(v => v.id === id) || (data?.vendors || [])[0];

    const { data: contractsData, isLoading: contractsLoading } = useVendorContracts(vendor?.id || null, { page: 1, limit: 10 });
    const { data: documents } = useVendorDocuments(vendor?.id || null);
    const { data: perf } = useVendorPerformance(vendor?.id || null, {});
    const updateVendor = useUpdateVendor();
    const deleteContract = useDeleteVendorContract();

    // Vetting data hooks
    const { data: companyInfo, isLoading: companyLoading } = useVendorCompanyInfo(vendor?.id || null);
    const { data: bankingInfo, isLoading: bankingLoading } = useVendorBankingInfo(vendor?.id || null);
    const { data: certificates, isLoading: certificatesLoading } = useVendorCertificates(vendor?.id || null);

    // Vetting mutation hooks
    const upsertCompanyInfo = useUpsertVendorCompanyInfo();
    const upsertBankingInfo = useUpsertVendorBankingInfo();
    const upsertCertificate = useUpsertVendorCertificate();
    const deleteCertificate = useDeleteVendorCertificate();

    // Classifications data hooks
    const { data: riskAssessment, isLoading: riskLoading } = useVendorRiskAssessment(vendor?.id || null);
    const { data: performanceMetrics, isLoading: performanceLoading } = useVendorPerformanceMetrics(vendor?.id || null);
    const { data: categories, isLoading: categoriesLoading } = useVendorCategories(vendor?.id || null);
    const { data: complianceStatus, isLoading: complianceLoading } = useVendorComplianceStatus(vendor?.id || null);

    // Classifications mutation hooks
    const upsertRiskAssessment = useUpsertVendorRiskAssessment();
    const upsertPerformanceMetrics = useUpsertVendorPerformanceMetrics();
    const upsertCategory = useUpsertVendorCategory();
    const upsertComplianceStatus = useUpsertVendorComplianceStatus();

    // Performance charts data
    const performanceChartData = useMemo(() => {
        if (!perf || perf.length === 0) return [];
        return perf.map((p: any) => ({
            period: `${p.period_start} - ${p.period_end}`,
            delivery: p.delivery_score || 0,
            quality: p.quality_score || 0,
            cost: p.cost_score || 0,
            overall: p.overall_score || 0
        }));
    }, [perf]);

    const performanceKPIs = useMemo(() => {
        if (!perf || perf.length === 0) return { avgDelivery: 0, avgQuality: 0, avgCost: 0, avgOverall: 0 };
        const totals = perf.reduce((acc: any, p: any) => ({
            delivery: acc.delivery + (p.delivery_score || 0),
            quality: acc.quality + (p.quality_score || 0),
            cost: acc.cost + (p.cost_score || 0),
            overall: acc.overall + (p.overall_score || 0)
        }), { delivery: 0, quality: 0, cost: 0, overall: 0 });
        const count = perf.length;
        return {
            avgDelivery: Math.round(totals.delivery / count * 10) / 10,
            avgQuality: Math.round(totals.quality / count * 10) / 10,
            avgCost: Math.round(totals.cost / count * 10) / 10,
            avgOverall: Math.round(totals.overall / count * 10) / 10
        };
    }, [perf]);
    const createDoc = useCreateVendorDocument();
    const createContract = useCreateVendorContract();
    const createPerf = useCreateVendorPerformance();
    const uploadDoc = useUploadVendorDocument();
    const bulkCreateContracts = useBulkCreateVendorContracts();
    const bulkCreateDocs = useBulkCreateVendorDocuments();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const contractsCsvRef = useRef<HTMLInputElement | null>(null);
    const documentsCsvRef = useRef<HTMLInputElement | null>(null);
    const [docDraft, setDocDraft] = useState<{ title: string; type?: string; url?: string; status?: string; expires_at?: string }>({ title: '' });
    const [docFile, setDocFile] = useState<File | null>(null);
    const [isDocOpen, setIsDocOpen] = useState(false);
    const [isContractOpen, setIsContractOpen] = useState(false);
    const [contractDraft, setContractDraft] = useState<{ title: string; start_date?: string; end_date?: string; value?: number; currency?: string; status?: string }>({ title: '' });
    const [isPerfOpen, setIsPerfOpen] = useState(false);
    const [perfDraft, setPerfDraft] = useState<{ period_start: string; period_end: string; delivery_score?: number; quality_score?: number; cost_score?: number; overall_score?: number; notes?: string }>({ period_start: '', period_end: '' });

    const generateContractCode = () => {
        const now = new Date();
        const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `CON-${ymd}-${suffix}`;
    };

    const parseCsv = (text: string) => {
        const lines = text.split(/\r?\n/).filter(l => l.trim().length);
        if (lines.length === 0) return [] as any[];
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const rows: any[] = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (!cols.length) continue;
            const obj: any = {};
            headers.forEach((h, idx) => {
                obj[h] = (cols[idx] ?? '').trim();
            });
            rows.push(obj);
        }
        return rows;
    };

    const handleBulkContracts = async (file: File) => {
        if (!vendor?.id) return;
        try {
            const text = await file.text();
            const records = parseCsv(text);
            const contracts = records
                .map(r => ({
                    title: r.title || r.name || '',
                    start_date: r.start_date || r.start || undefined,
                    end_date: r.end_date || r.end || undefined,
                    value: r.value ? Number(r.value) : undefined,
                    currency: r.currency || undefined,
                    status: r.status || 'Active'
                }))
                .filter(r => r.title);

            if (contracts.length === 0) {
                toast.error('No valid contracts found in CSV');
                return;
            }

            await bulkCreateContracts.mutateAsync({ vendor_id: vendor.id, contracts });
            toast.success(`Successfully imported ${contracts.length} contracts`);
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to import contracts');
        }
    };

    const handleBulkDocuments = async (file: File) => {
        if (!vendor?.id) return;
        try {
            const text = await file.text();
            const records = parseCsv(text);
            const documents = records
                .map(r => ({
                    title: r.title || r.name || '',
                    type: r.type || undefined,
                    url: r.url || r.link || '',
                    status: r.status || 'Active',
                    expires_at: r.expires_at || r.expires || undefined
                }))
                .filter(r => r.title && r.url);

            if (documents.length === 0) {
                toast.error('No valid documents found in CSV');
                return;
            }

            await bulkCreateDocs.mutateAsync({ vendor_id: vendor.id, documents });
            toast.success(`Successfully imported ${documents.length} documents`);
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to import documents');
        }
    };

    const handleCreateDoc = async () => {
        if (!vendor?.id || !docDraft.title) return;
        try {
            let url = docDraft.url;
            if (!url && docFile) {
                const res = await uploadDoc.mutateAsync({ vendor_id: vendor.id, file: docFile });
                url = res.url;
            }
            if (!url) return;
            await createDoc.mutateAsync({ vendor_id: vendor.id, title: docDraft.title, type: docDraft.type, url, status: docDraft.status, expires_at: docDraft.expires_at });
            toast.success('Document uploaded successfully');
            setIsDocOpen(false);
            setDocDraft({ title: '' });
            setDocFile(null);
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to upload document');
        }
    };

    const handleCreateContract = async () => {
        if (!vendor?.id || !contractDraft.title) return;
        try {
            const code = generateContractCode();
            await createContract.mutateAsync({ vendor_id: vendor.id, contract_code: code, title: contractDraft.title, start_date: contractDraft.start_date, end_date: contractDraft.end_date, value: Number(contractDraft.value || 0) || undefined, currency: contractDraft.currency, status: contractDraft.status || 'Active' });
            toast.success('Contract created successfully');
            setIsContractOpen(false);
            setContractDraft({ title: '' });
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to create contract');
        }
    };

    const handleCreatePerf = async () => {
        if (!vendor?.id || !perfDraft.period_start || !perfDraft.period_end) return;
        try {
            await createPerf.mutateAsync({ vendor_id: vendor.id, ...perfDraft });
            toast.success('Performance entry added successfully');
            setIsPerfOpen(false);
            setPerfDraft({ period_start: '', period_end: '' });
        } catch (error) {
            toast.error((error as any)?.message || 'Failed to add performance entry');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading vendor...</p>
                </div>
            </div>
        );
    }
    if (error || !vendor) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-destructive">{(error as any)?.message || 'Vendor not found'}</div>
                            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-[#383839]">Vendor profile</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        <img src="/group0.svg" alt="edit" className="w-4 h-4 mr-2" />
                        Edit vendor
                    </Button>
                    <Button variant="outline" size="sm">
                        <img src="/proicons-shield-cancel0.svg" alt="suspend" className="w-4 h-4 mr-2" />
                        Suspend vendor
                    </Button>
                    <Button variant="outline" size="sm">
                        <img src="/uil-export0.svg" alt="export" className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-full">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'vetting', label: 'Vetting checklist' },
                    { id: 'classifications', label: 'Classifications' },
                    { id: 'contracts', label: 'Contracts' },
                    { id: 'performance', label: 'Performance' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex-1 sm:flex-none ${activeTab === tab.id ? 'bg-white text-[#7c3aed] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>{tab.label}</button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div>
                    <div className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="rounded-[12px] border border-[#EEF2F6] h-[136px]" style={{ boxShadow: '0px 12px 40px rgba(17, 12, 46, 0.06)' }}>
                                <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                                    <div className="mb-3 h-12 w-12 rounded-full bg-[#E6FAEF] flex items-center justify-center">
                                        <img src="/group0.svg" alt="Total spend" className="h-6 w-6" />
                                    </div>
                                    <div className="text-[32px] leading-[40px] font-semibold text-[#111827]">
                                        ${contractsData?.contracts?.reduce((sum: number, c: any) => sum + (Number(c.value) || 0), 0).toLocaleString() || '0'}
                                    </div>
                                    <div className="mt-1 text-sm text-[#6B7280]">Total spend (YTD)</div>
                                </CardContent>
                            </Card>
                            <Card className="rounded-[12px] border border-[#EEF2F6] h-[136px]" style={{ boxShadow: '0px 12px 40px rgba(17, 12, 46, 0.06)' }}>
                                <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                                    <div className="mb-3 h-12 w-12 rounded-full bg-[#E6FAEF] flex items-center justify-center">
                                        <img src="/group1.svg" alt="Active contracts" className="h-6 w-6" />
                                    </div>
                                    <div className="text-[32px] leading-[40px] font-semibold text-[#111827]">
                                        {contractsData?.contracts?.filter((c: any) => c.status === 'Active').length || 0}
                                    </div>
                                    <div className="mt-1 text-sm text-[#6B7280]">Active contracts</div>
                                </CardContent>
                            </Card>
                            <Card className="rounded-[12px] border border-[#EEF2F6] h-[136px]" style={{ boxShadow: '0px 12px 40px rgba(17, 12, 46, 0.06)' }}>
                                <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                                    <div className="mb-3 h-12 w-12 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                                        <img src="/layer-12.svg" alt="Pending invoices" className="h-6 w-6" />
                                    </div>
                                    <div className="text-[32px] leading-[40px] font-semibold text-[#111827]">
                                        {contractsData?.contracts?.filter((c: any) => c.status === 'Pending').length || 0}
                                    </div>
                                    <div className="mt-1 text-sm text-[#6B7280]">Pending invoices</div>
                                </CardContent>
                            </Card>
                            <Card className="rounded-[12px] border border-[#EEF2F6] h-[136px]" style={{ boxShadow: '0px 12px 40px rgba(17, 12, 46, 0.06)' }}>
                                <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
                                    <div className="mb-3 h-12 w-12 rounded-full bg-[#DBEAFE] flex items-center justify-center">
                                        <img src="/layer-13.svg" alt="On-time delivery" className="h-6 w-6" />
                                    </div>
                                    <div className="text-[32px] leading-[40px] font-semibold text-[#111827]">
                                        {performanceKPIs.avgDelivery}%
                                    </div>
                                    <div className="mt-1 text-sm text-[#6B7280]">On-time delivery rate</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Snapshot Section */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsSnapshotExpanded(!isSnapshotExpanded)}>
                                    <h3 className="text-lg font-semibold text-[#383839]">Snapshot</h3>
                                    <img
                                        src="/weui-arrow-filled0.svg"
                                        alt="expand"
                                        className={`w-4 h-4 transition-transform ${isSnapshotExpanded ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                {isSnapshotExpanded && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500">Vendor ID</div>
                                            <div className="text-sm text-[#383839]">{vendor?.id ? `VND-${vendor.id.slice(-6).toUpperCase()}` : '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Performance Score</div>
                                            <div className="text-sm text-[#383839]">{vendor?.rating || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Risk Level</div>
                                            <div className="text-sm text-[#383839]">
                                                {vendor?.rating != null ? (
                                                    vendor.rating >= 70 ? 'High' : vendor.rating >= 40 ? 'Medium' : 'Low'
                                                ) : '-'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Next Contract Expiry</div>
                                            <div className="text-sm text-[#383839]">
                                                {contractsData?.contracts?.find((c: any) => c.end_date)?.end_date ?
                                                    new Date(contractsData.contracts.find((c: any) => c.end_date).end_date).toLocaleDateString() : '-'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Information Section */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsContactExpanded(!isContactExpanded)}>
                                    <h3 className="text-lg font-semibold text-[#383839]">Contact Information</h3>
                                    <img
                                        src="/weui-arrow-filled1.svg"
                                        alt="expand"
                                        className={`w-4 h-4 transition-transform ${isContactExpanded ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                {isContactExpanded && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500">Name</div>
                                            <div className="text-sm text-[#383839]">{vendor?.vendor_name || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Email</div>
                                            <div className="text-sm text-[#383839]">{vendor?.email || '-'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Phone Number</div>
                                            <div className="text-sm text-[#383839]">{vendor?.phone || '-'}</div>
                                        </div>
                                        <div className="sm:col-span-2 lg:col-span-3">
                                            <div className="text-xs text-gray-500">Address</div>
                                            <div className="text-sm text-[#383839]">
                                                {[vendor?.city, vendor?.country].filter(Boolean).join(', ') || '-'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bottom Navigation */}
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                                onClick={() => setActiveTab('vetting')}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'vetting' && (
                <div className="space-y-[42px]">
                    {/* Company Section */}
                    <div className="bg-[#ffffff] rounded-[5px] border border-[#e1e1e1] p-[15px_17px]">
                        <div
                            className="flex items-center gap-1.5 mb-8 cursor-pointer"
                            onClick={() => setIsCompanyExpanded(!isCompanyExpanded)}
                        >
                            <img
                                src="/weui-arrow-filled1.svg"
                                alt="expand"
                                className={`w-2.5 h-5 transition-transform ${isCompanyExpanded ? 'rotate-180' : ''}`}
                            />
                            <div className="flex items-center gap-3">
                                <div className="text-[#383838] text-[17px] font-medium">Company</div>
                                <div className={`rounded-2xl px-1.5 py-1 flex items-center gap-[5px] ${companyInfo?.is_complete ? 'bg-[#dcfce7]' : 'bg-[#fef3c7]'
                                    }`}>
                                    <img
                                        src={companyInfo?.is_complete ? "/fluent-mdl-2-completed-solid0.svg" : "/fluent-mdl-2-completed-solid0.svg"}
                                        alt="status"
                                        className="w-3 h-3"
                                    />
                                    <div className={`text-[10px] font-normal ${companyInfo?.is_complete ? 'text-[#10bc4b]' : 'text-[#f59e0b]'
                                        }`}>
                                        {companyInfo?.is_complete ? 'Complete' : 'Incomplete'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isCompanyExpanded && (
                            <div className="space-y-[15px]">
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Company name</div>
                                    <div className="text-[#383838] text-[15px] font-medium">{companyInfo?.company_name || vendor?.vendor_name || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Registration number</div>
                                    <div className="text-[#383838] text-sm font-medium">{companyInfo?.registration_number || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Address</div>
                                    <div className="text-[#383838] text-sm font-medium">{companyInfo?.address || vendor?.address || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Country</div>
                                    <div className="text-[#383838] text-sm font-medium">{companyInfo?.country || vendor?.country || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Contact person</div>
                                    <div className="text-[#383838] text-sm font-medium">{companyInfo?.contact_person || vendor?.contact_person || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Email</div>
                                    <div className="text-[#383838] text-sm font-medium">{companyInfo?.email || vendor?.email || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Phone number</div>
                                    <div className="text-[#383838] text-sm font-medium">{companyInfo?.phone_number || vendor?.phone || '-'}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Banking & Tax Section */}
                    <div className="bg-[#ffffff] rounded-[5px] border border-[#e1e1e1] p-[15px_17px]">
                        <div
                            className="flex items-center gap-1.5 mb-8 cursor-pointer"
                            onClick={() => setIsBankingExpanded(!isBankingExpanded)}
                        >
                            <img
                                src="/weui-arrow-filled2.svg"
                                alt="expand"
                                className={`w-2.5 h-5 transition-transform ${isBankingExpanded ? 'rotate-180' : ''}`}
                            />
                            <div className="flex items-center gap-3">
                                <div className="text-[#383838] text-[17px] font-medium">Banking & Tax</div>
                                <div className={`rounded-2xl px-1.5 py-1 flex items-center gap-[5px] ${bankingInfo?.is_complete ? 'bg-[#dcfce7]' : 'bg-[#fef3c7]'
                                    }`}>
                                    <img
                                        src={bankingInfo?.is_complete ? "/fluent-mdl-2-completed-solid1.svg" : "/fluent-mdl-2-completed-solid1.svg"}
                                        alt="status"
                                        className="w-3 h-3"
                                    />
                                    <div className={`text-[10px] font-normal ${bankingInfo?.is_complete ? 'text-[#10bc4b]' : 'text-[#f59e0b]'
                                        }`}>
                                        {bankingInfo?.is_complete ? 'Complete' : 'Incomplete'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isBankingExpanded && (
                            <div className="space-y-[15px]">
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Bank name</div>
                                    <div className="text-[#383838] text-[15px] font-medium">{bankingInfo?.bank_name || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Account holder</div>
                                    <div className="text-[#383838] text-sm font-medium">{bankingInfo?.account_holder || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Account number</div>
                                    <div className="text-[#383838] text-sm font-medium">{bankingInfo?.account_number || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Tax ID</div>
                                    <div className="text-[#383838] text-sm font-medium">{bankingInfo?.tax_id || '-'}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Certificate & Documents Section */}
                    <div className="bg-[#ffffff] rounded-[5px] border border-[#e1e1e1] p-[15px_17px]">
                        <div
                            className="flex items-center gap-1.5 mb-8 cursor-pointer"
                            onClick={() => setIsCertificatesExpanded(!isCertificatesExpanded)}
                        >
                            <img
                                src="/weui-arrow-filled3.svg"
                                alt="expand"
                                className={`w-2.5 h-5 transition-transform ${isCertificatesExpanded ? 'rotate-180' : ''}`}
                            />
                            <div className="flex items-center gap-3">
                                <div className="text-[#383838] text-[17px] font-medium">Certificate & Documents</div>
                                <div className={`rounded-2xl px-1.5 py-1 flex items-center gap-[5px] ${certificates?.some(c => c.is_complete) ? 'bg-[#dcfce7]' : 'bg-[#fef3c7]'}`}>
                                    <img
                                        src={certificates?.some(c => c.is_complete) ? "/fluent-mdl-2-completed-solid2.svg" : "/fluent-mdl-2-completed-solid2.svg"}
                                        alt="status"
                                        className="w-3 h-3"
                                    />
                                    <div className={`text-[10px] font-normal ${certificates?.some(c => c.is_complete) ? 'text-[#10bc4b]' : 'text-[#f59e0b]'}`}>
                                        {certificates?.some(c => c.is_complete) ? 'Complete' : 'Incomplete'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isCertificatesExpanded && (
                            <div className="flex gap-[15px]">
                                {certificates && certificates.length > 0 ? (
                                    certificates.map((cert, index) => (
                                        <div key={cert.id} className="bg-[#ffffff] rounded-md border-2 border-[#f5f7fa] p-[9px_10px] flex flex-col gap-[22px] items-center w-[199px]">
                                            <div className="text-[#383838] text-sm font-normal capitalize">{cert.certificate_type.replace('_', ' ')}</div>
                                            <div className="flex flex-col gap-[9px] items-center w-full">
                                                <div className="bg-[#f5f7fa] rounded px-2 py-0.5 h-[25px] flex items-center justify-between w-full">
                                                    <div className="text-[#002da0] text-sm font-medium underline truncate">{cert.certificate_name}</div>
                                                    <img src={`/material-symbols-download${index % 3}.svg`} alt="download" className="w-[17px] h-[17px]" />
                                                </div>
                                                <div className={`text-[10px] font-light ${cert.status === 'expired' ? 'text-[#dd2222]' : 'text-[#383838]'
                                                    }`}>
                                                    {cert.valid_until ?
                                                        (cert.status === 'expired' ? `Expired - ${new Date(cert.valid_until).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` :
                                                            `Valid until ${new Date(cert.valid_until).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`) :
                                                        'No expiry date'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[#6b7280] text-sm">No certificates uploaded yet</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setActiveTab('overview')}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                                onClick={() => setActiveTab('contracts')}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'classifications' && (
                <div className="space-y-[42px]">
                    {/* Risk Assessment Section */}
                    <div className="bg-[#ffffff] rounded-[5px] border border-[#e1e1e1] p-[15px_17px]">
                        <div
                            className="flex items-center gap-1.5 mb-8 cursor-pointer"
                            onClick={() => setIsRiskExpanded(!isRiskExpanded)}
                        >
                            <img
                                src="/weui-arrow-filled0.svg"
                                alt="expand"
                                className={`w-2.5 h-5 transition-transform ${isRiskExpanded ? 'rotate-180' : ''}`}
                            />
                            <div className="flex items-center gap-3">
                                <div className="text-[#383838] text-[17px] font-medium">Risk Assessment</div>
                                <div className={`rounded-2xl px-1.5 py-1 flex items-center gap-[5px] ${riskAssessment?.risk_level === 'Low' ? 'bg-[#dcfce7]' :
                                    riskAssessment?.risk_level === 'Medium' ? 'bg-[#fef3c7]' :
                                        riskAssessment?.risk_level === 'High' ? 'bg-[#fecaca]' : 'bg-[#fef3c7]'
                                    }`}>
                                    <img
                                        src="/fluent-mdl-2-completed-solid0.svg"
                                        alt="status"
                                        className="w-3 h-3"
                                    />
                                    <div className={`text-[10px] font-normal ${riskAssessment?.risk_level === 'Low' ? 'text-[#10bc4b]' :
                                        riskAssessment?.risk_level === 'Medium' ? 'text-[#f59e0b]' :
                                            riskAssessment?.risk_level === 'High' ? 'text-[#dc2626]' : 'text-[#f59e0b]'
                                        }`}>
                                        {riskAssessment?.risk_level || 'Not Assessed'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isRiskExpanded && (
                            <div className="space-y-[15px]">
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Risk Level</div>
                                    <div className="text-[#383838] text-[15px] font-medium">{riskAssessment?.risk_level || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Risk Score</div>
                                    <div className="text-[#383838] text-sm font-medium">{riskAssessment?.risk_score || '-'}/100</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Assessment Date</div>
                                    <div className="text-[#383838] text-sm font-medium">{riskAssessment?.assessment_date ? new Date(riskAssessment.assessment_date).toLocaleDateString() : '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Assessed By</div>
                                    <div className="text-[#383838] text-sm font-medium">{riskAssessment?.assessed_by || '-'}</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Next Review</div>
                                    <div className="text-[#383838] text-sm font-medium">{riskAssessment?.next_review_date ? new Date(riskAssessment.next_review_date).toLocaleDateString() : '-'}</div>
                                </div>
                                {riskAssessment?.risk_factors && riskAssessment.risk_factors.length > 0 && (
                                    <div className="flex justify-between items-start">
                                        <div className="text-[#383838] text-sm font-normal">Risk Factors</div>
                                        <div className="text-[#383838] text-sm font-medium">{riskAssessment.risk_factors.join(', ')}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Performance Metrics Section */}
                    <div className="bg-[#ffffff] rounded-[5px] border border-[#e1e1e1] p-[15px_17px]">
                        <div
                            className="flex items-center gap-1.5 mb-8 cursor-pointer"
                            onClick={() => setIsPerformanceExpanded(!isPerformanceExpanded)}
                        >
                            <img
                                src="/weui-arrow-filled1.svg"
                                alt="expand"
                                className={`w-2.5 h-5 transition-transform ${isPerformanceExpanded ? 'rotate-180' : ''}`}
                            />
                            <div className="flex items-center gap-3">
                                <div className="text-[#383838] text-[17px] font-medium">Performance Metrics</div>
                                <div className={`rounded-2xl px-1.5 py-1 flex items-center gap-[5px] ${(performanceMetrics?.performance_score || 0) >= 80 ? 'bg-[#dcfce7]' :
                                    (performanceMetrics?.performance_score || 0) >= 60 ? 'bg-[#fef3c7]' : 'bg-[#fecaca]'
                                    }`}>
                                    <img
                                        src="/fluent-mdl-2-completed-solid1.svg"
                                        alt="status"
                                        className="w-3 h-3"
                                    />
                                    <div className={`text-[10px] font-normal ${(performanceMetrics?.performance_score || 0) >= 80 ? 'text-[#10bc4b]' :
                                        (performanceMetrics?.performance_score || 0) >= 60 ? 'text-[#f59e0b]' : 'text-[#dc2626]'
                                        }`}>
                                        {performanceMetrics?.performance_score ? `${performanceMetrics.performance_score}/100` : 'Not Rated'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isPerformanceExpanded && (
                            <div className="space-y-[15px]">
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Overall Score</div>
                                    <div className="text-[#383838] text-[15px] font-medium">{performanceMetrics?.performance_score || '-'}/100</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Quality Score</div>
                                    <div className="text-[#383838] text-sm font-medium">{performanceMetrics?.quality_score || '-'}/100</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Delivery Score</div>
                                    <div className="text-[#383838] text-sm font-medium">{performanceMetrics?.delivery_score || '-'}/100</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Cost Score</div>
                                    <div className="text-[#383838] text-sm font-medium">{performanceMetrics?.cost_score || '-'}/100</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Communication Score</div>
                                    <div className="text-[#383838] text-sm font-medium">{performanceMetrics?.communication_score || '-'}/100</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="text-[#383838] text-sm font-normal">Assessment Period</div>
                                    <div className="text-[#383838] text-sm font-medium">
                                        {performanceMetrics?.assessment_period_start && performanceMetrics?.assessment_period_end ?
                                            `${new Date(performanceMetrics.assessment_period_start).toLocaleDateString()} - ${new Date(performanceMetrics.assessment_period_end).toLocaleDateString()}` : '-'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Categories Section */}
                    <div className="bg-[#ffffff] rounded-[5px] border border-[#e1e1e1] p-[15px_17px]">
                        <div
                            className="flex items-center gap-1.5 mb-8 cursor-pointer"
                            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                        >
                            <img
                                src="/weui-arrow-filled2.svg"
                                alt="expand"
                                className={`w-2.5 h-5 transition-transform ${isCategoriesExpanded ? 'rotate-180' : ''}`}
                            />
                            <div className="flex items-center gap-3">
                                <div className="text-[#383838] text-[17px] font-medium">Vendor Categories</div>
                                <div className={`rounded-2xl px-1.5 py-1 flex items-center gap-[5px] ${categories && categories.length > 0 ? 'bg-[#dcfce7]' : 'bg-[#fef3c7]'
                                    }`}>
                                    <img
                                        src="/fluent-mdl-2-completed-solid2.svg"
                                        alt="status"
                                        className="w-3 h-3"
                                    />
                                    <div className={`text-[10px] font-normal ${categories && categories.length > 0 ? 'text-[#10bc4b]' : 'text-[#f59e0b]'
                                        }`}>
                                        {categories && categories.length > 0 ? `${categories.length} Categories` : 'No Categories'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isCategoriesExpanded && (
                            <div className="space-y-[15px]">
                                {categories && categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="text-[#383838] text-sm font-medium">{category.category_name}</div>
                                                <div className="text-[#6b7280] text-xs">{category.category_type}</div>
                                            </div>
                                            <div className="text-[#383838] text-xs">
                                                {new Date(category.assigned_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[#6b7280] text-sm text-center py-4">No categories assigned yet</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Compliance Status Section */}
                    <div className="bg-[#ffffff] rounded-[5px] border border-[#e1e1e1] p-[15px_17px]">
                        <div
                            className="flex items-center gap-1.5 mb-8 cursor-pointer"
                            onClick={() => setIsComplianceExpanded(!isComplianceExpanded)}
                        >
                            <img
                                src="/weui-arrow-filled3.svg"
                                alt="expand"
                                className={`w-2.5 h-5 transition-transform ${isComplianceExpanded ? 'rotate-180' : ''}`}
                            />
                            <div className="flex items-center gap-3">
                                <div className="text-[#383838] text-[17px] font-medium">Compliance Status</div>
                                <div className={`rounded-2xl px-1.5 py-1 flex items-center gap-[5px] ${complianceStatus?.some(c => c.compliance_status === 'Compliant') ? 'bg-[#dcfce7]' : 'bg-[#fef3c7]'
                                    }`}>
                                    <img
                                        src="/fluent-mdl-2-completed-solid0.svg"
                                        alt="status"
                                        className="w-3 h-3"
                                    />
                                    <div className={`text-[10px] font-normal ${complianceStatus?.some(c => c.compliance_status === 'Compliant') ? 'text-[#10bc4b]' : 'text-[#f59e0b]'
                                        }`}>
                                        {complianceStatus?.some(c => c.compliance_status === 'Compliant') ? 'Compliant' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isComplianceExpanded && (
                            <div className="space-y-[15px]">
                                {complianceStatus && complianceStatus.length > 0 ? (
                                    complianceStatus.map((compliance, index) => (
                                        <div key={compliance.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="text-[#383838] text-sm font-medium">{compliance.compliance_type}</div>
                                                <div className="text-[#6b7280] text-xs">{compliance.certificate_number || 'No certificate'}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`text-xs px-2 py-1 rounded ${compliance.compliance_status === 'Compliant' ? 'bg-green-100 text-green-800' :
                                                    compliance.compliance_status === 'Non-Compliant' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {compliance.compliance_status}
                                                </div>
                                                {compliance.expiry_date && (
                                                    <div className="text-[#6b7280] text-xs">
                                                        {new Date(compliance.expiry_date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[#6b7280] text-sm text-center py-4">No compliance records found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setActiveTab('vetting')}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                                onClick={() => setActiveTab('contracts')}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'contracts' && (
                <div className="space-y-6">
                    {/* Back Navigation */}

                    {/* Contract Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border border-gray-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {contractsData?.contracts?.reduce((sum, contract) => sum + (contract.value || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0'}
                                        </div>
                                        <div className="text-sm text-gray-600">Total contracts</div>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <img src="/group0.svg" alt="total" className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {contractsData?.contracts?.filter(c => c.status === 'Active').length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Active contracts</div>
                                    </div>
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <img src="/group1.svg" alt="active" className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {contractsData?.contracts?.filter(c => c.status === 'Overdue').length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Overdue contracts</div>
                                    </div>
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <img src="/group2.svg" alt="overdue" className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {contractsData?.contracts?.filter(c => {
                                                if (!c.end_date) return false;
                                                const endDate = new Date(c.end_date);
                                                const thirtyDaysFromNow = new Date();
                                                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                                                return endDate <= thirtyDaysFromNow && c.status === 'Active';
                                            }).length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Expiring soon (30 days)</div>
                                    </div>
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <img src="/group3.svg" alt="expiring" className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Service Contracts List */}
                    <Card className="border border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Service contracts list</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search contracts..."
                                            value={contractSearch}
                                            onChange={(e) => setContractSearch(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                                        />
                                        <img src="/search0.svg" alt="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <select
                                        value={contractFilter}
                                        onChange={(e) => setContractFilter(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Expired">Expired</option>
                                        <option value="Overdue">Overdue</option>
                                        <option value="Terminated">Terminated</option>
                                    </select>
                                    <Button
                                        onClick={() => setIsAddContractOpen(true)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                                    >
                                        <img src="/material-symbols-add-rounded0.svg" alt="add" className="w-4 h-4" />
                                        + Add contract
                                    </Button>
                                </div>
                            </div>

                            {/* Contracts Table */}
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Contract ID</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Title</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Value</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Start date</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">End date</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contractsLoading ? (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-gray-500">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Loading contracts...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            (contractsData?.contracts || [])
                                                .filter(contract => {
                                                    const matchesSearch = !contractSearch ||
                                                        contract.title?.toLowerCase().includes(contractSearch.toLowerCase()) ||
                                                        contract.contract_code?.toLowerCase().includes(contractSearch.toLowerCase());
                                                    const matchesFilter = contractFilter === 'all' || contract.status === contractFilter;
                                                    return matchesSearch && matchesFilter;
                                                })
                                                .map((contract) => (
                                                    <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">{contract.contract_code || 'N/A'}</td>
                                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{contract.title || 'N/A'}</td>
                                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                                            {contract.value ?
                                                                new Intl.NumberFormat('en-US', {
                                                                    style: 'currency',
                                                                    currency: contract.currency || 'USD'
                                                                }).format(contract.value) : 'N/A'
                                                            }
                                                        </td>
                                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                                            {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                                            {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                                contract.status === 'Expired' ? 'bg-red-100 text-red-800' :
                                                                    contract.status === 'Overdue' ? 'bg-yellow-100 text-yellow-800' :
                                                                        contract.status === 'Terminated' ? 'bg-gray-100 text-gray-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {contract.status || 'Unknown'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-xs h-7 px-3"
                                                                    onClick={() => {
                                                                        // TODO: Implement view contract functionality
                                                                        console.log('View contract:', contract.id);
                                                                    }}
                                                                >
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-xs h-7 px-3"
                                                                    onClick={() => {
                                                                        // TODO: Implement renew contract functionality
                                                                        console.log('Renew contract:', contract.id);
                                                                    }}
                                                                >
                                                                    Renew
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-xs h-7 px-3 text-red-600 border-red-300 hover:bg-red-50"
                                                                    onClick={async () => {
                                                                        if (window.confirm('Are you sure you want to delete this contract?')) {
                                                                            try {
                                                                                await deleteContract.mutateAsync(contract.id);
                                                                                toast.success('Contract deleted successfully');
                                                                            } catch (error) {
                                                                                console.error('Error deleting contract:', error);
                                                                                toast.error('Failed to delete contract');
                                                                            }
                                                                        }
                                                                    }}
                                                                    disabled={deleteContract.isPending}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                        )}
                                        {!contractsLoading && (!contractsData?.contracts || contractsData.contracts.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-gray-500">
                                                    No contracts found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-700">
                                    Showing {contractsData?.contracts?.length || 0} of {contractsData?.total || 0} contracts
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled>
                                        Previous
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setActiveTab('classifications')}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                                onClick={() => setActiveTab('performance')}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'performance' && (
                <div className="space-y-6">
                    {/* Back Navigation */}

                    {/* Performance Trend Chart */}
                    <Card className="border border-gray-200">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance trend</h3>
                            {performanceChartData.length > 0 ? (
                                <>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={performanceChartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis
                                                    dataKey="period"
                                                    tick={{ fontSize: 12, fill: '#666' }}
                                                    axisLine={{ stroke: '#e0e0e0' }}
                                                    tickLine={{ stroke: '#e0e0e0' }}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{ fontSize: 12, fill: '#666' }}
                                                    axisLine={{ stroke: '#e0e0e0' }}
                                                    tickLine={{ stroke: '#e0e0e0' }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'white',
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="delivery"
                                                    stroke="#7c3aed"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
                                                    activeDot={{ r: 6, stroke: '#7c3aed', strokeWidth: 2 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="quality"
                                                    stroke="#3b82f6"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="cost"
                                                    stroke="#ef4444"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                                                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="service"
                                                    stroke="#f59e0b"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                                                    activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Legend */}
                                    <div className="flex items-center justify-center gap-8 mt-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-0.5 bg-purple-600"></div>
                                            <span className="text-sm text-gray-700">Delivery</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-0.5 bg-blue-600"></div>
                                            <span className="text-sm text-gray-700">Quality</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-0.5 bg-red-600"></div>
                                            <span className="text-sm text-gray-700">Cost</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-0.5 bg-orange-500"></div>
                                            <span className="text-sm text-gray-700">Service</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-80 flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <div className="text-lg font-medium mb-2">No Performance Data</div>
                                        <div className="text-sm">Performance data will appear here once available</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Evaluation History Table */}
                    <Card className="border border-gray-200">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Evaluation history</h3>
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Period</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Overall score</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Delivery</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Quality</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Cost</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Service</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Reviewer</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {perf && perf.length > 0 ? (
                                            perf.map((performance, index) => (
                                                <tr key={performance.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                                                        {performance.period_start && performance.period_end ?
                                                            `Q${Math.ceil(new Date(performance.period_start).getMonth() / 3)} ${new Date(performance.period_start).getFullYear()}` :
                                                            'N/A'
                                                        }
                                                    </td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{performance.overall_score || 'N/A'}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{performance.delivery_score || 'N/A'}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{performance.quality_score || 'N/A'}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{performance.cost_score || 'N/A'}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{performance.overall_score || 'N/A'}</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">System</td>
                                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{performance.notes || 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="py-8 text-center text-gray-500">
                                                    No performance data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-end gap-4 mt-8">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 font-medium shadow-sm"
                        >
                            Submit for approval
                        </Button>
                    </div>
                </div>
            )}


            {/* Upload Document Modal */}
            {isDocOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Upload document</h3>
                            <button onClick={() => setIsDocOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Title</label>
                                <Input value={docDraft.title} onChange={e => setDocDraft(v => ({ ...v, title: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Type</label>
                                    <Input value={docDraft.type || ''} onChange={e => setDocDraft(v => ({ ...v, type: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                                    <Input value={docDraft.status || ''} onChange={e => setDocDraft(v => ({ ...v, status: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">File URL</label>
                                    <Input value={docDraft.url || ''} onChange={e => setDocDraft(v => ({ ...v, url: e.target.value }))} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Or upload file</label>
                                    <input type="file" accept="application/pdf,image/*" onChange={e => setDocFile(e.target.files?.[0] || null)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Expires at</label>
                                <Input type="date" value={docDraft.expires_at || ''} onChange={e => setDocDraft(v => ({ ...v, expires_at: e.target.value }))} />
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDocOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateDoc} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" disabled={createDoc.isPending || uploadDoc.isPending}>Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Contract Modal */}
            {isContractOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">New contract</h3>
                            <button onClick={() => setIsContractOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Title</label>
                                <Input value={contractDraft.title} onChange={e => setContractDraft(v => ({ ...v, title: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Start date</label>
                                    <Input type="date" value={contractDraft.start_date || ''} onChange={e => setContractDraft(v => ({ ...v, start_date: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">End date</label>
                                    <Input type="date" value={contractDraft.end_date || ''} onChange={e => setContractDraft(v => ({ ...v, end_date: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Value</label>
                                    <Input type="number" value={String(contractDraft.value || '')} onChange={e => setContractDraft(v => ({ ...v, value: Number(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Currency</label>
                                    <Input value={contractDraft.currency || ''} onChange={e => setContractDraft(v => ({ ...v, currency: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                                    <Input value={contractDraft.status || 'Active'} onChange={e => setContractDraft(v => ({ ...v, status: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsContractOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateContract} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" disabled={createContract.isPending}>Create</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Performance Modal */}
            {isPerfOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Add performance</h3>
                            <button onClick={() => setIsPerfOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Period start</label>
                                    <Input type="date" value={perfDraft.period_start} onChange={e => setPerfDraft(v => ({ ...v, period_start: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Period end</label>
                                    <Input type="date" value={perfDraft.period_end} onChange={e => setPerfDraft(v => ({ ...v, period_end: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Delivery</label>
                                    <Input type="number" value={String(perfDraft.delivery_score ?? '')} onChange={e => setPerfDraft(v => ({ ...v, delivery_score: Number(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Quality</label>
                                    <Input type="number" value={String(perfDraft.quality_score ?? '')} onChange={e => setPerfDraft(v => ({ ...v, quality_score: Number(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Cost</label>
                                    <Input type="number" value={String(perfDraft.cost_score ?? '')} onChange={e => setPerfDraft(v => ({ ...v, cost_score: Number(e.target.value) }))} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Overall</label>
                                    <Input type="number" value={String(perfDraft.overall_score ?? '')} onChange={e => setPerfDraft(v => ({ ...v, overall_score: Number(e.target.value) }))} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Notes</label>
                                <Input value={perfDraft.notes || ''} onChange={e => setPerfDraft(v => ({ ...v, notes: e.target.value }))} />
                            </div>
                        </div>
                        <div className="p-4 border-t flex items-center justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsPerfOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreatePerf} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" disabled={createPerf.isPending}>Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Vendor Modal */}
            <EditVendorModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                vendor={vendor}
                onSave={() => {
                    // Refresh data after save
                    window.location.reload();
                }}
            />

            {/* Add Contract Modal */}
            <AddContractModal
                isOpen={isAddContractOpen}
                onClose={() => setIsAddContractOpen(false)}
                vendorId={vendor?.id || ''}
                onSuccess={() => {
                    // Contract will be refreshed automatically via React Query
                }}
            />
        </div>
    );
};

export default VendorProfilePage;


