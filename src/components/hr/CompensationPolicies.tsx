import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Upload,
  Plus,
  Eye,
  DollarSign,
  FileText,
  RotateCcw,
  ArrowUp,
  Bell
} from 'lucide-react';
import UploadMarketDataModal from './UploadMarketDataModal';
import NewSalarySimulation from './NewSalarySimulation';
import SalaryBenchmarkDetail from './SalaryBenchmarkDetail';
import PolicyDetailModal from './PolicyDetailModal';
import EscalateAcknowledgementsModal from './EscalateAcknowledgementsModal';
import DocumentDetailsModal from './DocumentDetailsModal';
import { useEmployeeDocuments } from '@/hooks/hr/useEmployeeDocuments';
import { useEmployees } from '@/hooks/hr/useEmployees';
import { useSalaryBenchmarks } from '@/hooks/hr/useSalaryBenchmarks';
import { useAcknowledgePolicy, usePolicies, usePolicyAcknowledgments, PolicyAck, useSendPolicyReminder, useEmailPolicyAction } from '@/hooks/hr/usePolicies';
import { useCompensationMetrics } from '@/hooks/hr/useCompensationMetrics';
import { usePolicyAckSummary } from '@/hooks/hr/usePolicyAckSummary';
import { useSendDocumentReminder } from '@/hooks/hr/useDocumentReminder';

const CompensationPolicies = () => {
  const [activeTab, setActiveTab] = useState('salary-benchmarks');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showBenchmarkDetail, setShowBenchmarkDetail] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [selectedEscalatePolicy, setSelectedEscalatePolicy] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Handle file import
  const handleFileImport = (file: File) => {
    console.log('Importing file:', file.name);
    // Here you would typically handle the file import logic
    // For now, we'll just log it
  };

  // Handle policy view
  const handlePolicyView = (policy: any) => {
    setSelectedPolicy(policy);
    setIsPolicyModalOpen(true);
  };

  // Handle policy acknowledgment (real)
  const handlePolicyAcknowledge = () => {
    if (!selectedPolicy) return;
    acknowledge.mutate({ policy_id: (selectedPolicy as any).id });
    setIsPolicyModalOpen(false);
    setSelectedPolicy(null);
  };

  // Handle send reminders (real)
  const handleSendReminders = () => {
    if (!selectedPolicy) return;
    emailPolicy.mutate({ policy_id: (selectedPolicy as any).id, action: 'remind' });
  };

  // Handle escalate acknowledgements
  const handleEscalateAcknowledgements = (policy: any) => {
    setSelectedEscalatePolicy({
      policy: policy.title || policy.policy || 'Unknown Policy',
      org: policy.category || 'General',
      overdue: policy.overdue || 0,
      policy_id: policy.policy_id || policy.id
    });
    setIsEscalateModalOpen(true);
  };

  // Handle send escalation
  const handleSendEscalation = () => {
    if (!selectedEscalatePolicy?.policy_id) return;
    emailPolicy.mutate({ policy_id: selectedEscalatePolicy.policy_id, action: 'escalate' });
    setIsEscalateModalOpen(false);
    setSelectedEscalatePolicy(null);
  };

  // Handle schedule for later
  const handleScheduleForLater = () => {
    console.log('Scheduling escalation for later:', selectedEscalatePolicy?.policy);
    setIsEscalateModalOpen(false);
    setSelectedEscalatePolicy(null);
  };

  // Handle document view
  const handleDocumentView = (document: any) => {
    setSelectedDocument(document);
    setIsDocumentModalOpen(true);
  };

  // Document reminder mutation
  const sendDocReminder = useSendDocumentReminder();

  // Handle send renewal reminder
  const handleSendRenewalReminder = () => {
    if (!selectedDocument?.id) return;
    sendDocReminder.mutate({ document_id: selectedDocument.id });
    setIsDocumentModalOpen(false);
    setSelectedDocument(null);
  };

  // Handle upload renewed document
  const handleUploadRenewedDocument = () => {
    console.log('Uploading renewed document for:', selectedDocument?.owner);
    setIsDocumentModalOpen(false);
    setSelectedDocument(null);
  };

  // Live metrics
  const { data: metrics } = useCompensationMetrics();

  // Real salary benchmarks
  const [searchText, setSearchText] = useState('');
  const { data: salaryBenchmarkData = [], isLoading: isBenchmarksLoading } = useSalaryBenchmarks(searchText);

  // Real policies and acknowledgments
  const { data: policyData = [], isLoading: isPoliciesLoading } = usePolicies();
  const { data: allAcks = [] } = usePolicyAcknowledgments();
  const acknowledge = useAcknowledgePolicy();
  const stampReminder = useSendPolicyReminder();
  const emailPolicy = useEmailPolicyAction();

  // Acknowledgements tab: search state and live data
  const [ackSearchText, setAckSearchText] = useState('');
  const { data: ackSummary, isLoading: isAckSummaryLoading } = usePolicyAckSummary(ackSearchText);

  // Document expiry: search state
  const [docSearchText, setDocSearchText] = useState('');

  // Real data for document expiry (with search)
  const { data: documents = [], isLoading: isDocsLoading } = useEmployeeDocuments(docSearchText);

  const documentExpiryData = useMemo(() => {
    const today = new Date();
    return documents.map((d: any) => {
      // Extract employee from joined query result
      const emp = d.hr_employees || (Array.isArray(d.hr_employees) ? d.hr_employees[0] : null);
      const owner = emp ? `${emp.first_name || ''} ${emp.last_name || ''}`.trim() : '—';
      const department = emp?.department || '';
      const expiryDate = d.expiry_date ? new Date(d.expiry_date) : null;
      let status: 'expiring' | 'valid' | 'expired' = 'valid';
      let daysUntilExpiry: number | null = null;
      if (expiryDate) {
        const diff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff < 0) status = 'expired';
        else if (diff <= 60) { status = 'expiring'; daysUntilExpiry = diff; }
      }
      return {
        id: d.id,
        owner,
        department,
        type: d.document_type,
        country: '', // Not in current schema
        number: d.document_number || '',
        expiry: expiryDate ? expiryDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
        status,
        daysUntilExpiry,
        employee_id: d.employee_id,
      };
    });
  }, [documents]);

  return (
    <div className="space-y-6">
      {showBenchmarkDetail ? (
        <SalaryBenchmarkDetail
          onBack={() => setShowBenchmarkDetail(false)}
          onRunSimulation={() => setShowSimulation(true)}
        />
      ) : showSimulation ? (
        <NewSalarySimulation onBack={() => setShowSimulation(false)} />
      ) : (
        <>
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="salary-benchmarks">Salary benchmarks</TabsTrigger>
              <TabsTrigger value="policy-portal">Policy portal</TabsTrigger>
              <TabsTrigger value="acknowledgements">Acknowledgements</TabsTrigger>
              <TabsTrigger value="document-expiry">Document expiry</TabsTrigger>
            </TabsList>

            {/* Salary Benchmarks Tab */}
            <TabsContent value="salary-benchmarks" className="space-y-6 mt-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[{
                  icon: BarChart3,
                  number: metrics?.totalBenchmarks ?? 0,
                  label: 'Total benchmark',
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-100'
                }, {
                  icon: CheckCircle,
                  number: metrics ? metrics.averageCompaRatio.toFixed(2) : '0.00',
                  label: 'Average compa-ratio',
                  color: 'text-green-600',
                  bgColor: 'bg-green-100',
                  subtitle: 'healthy'
                }, {
                  icon: AlertTriangle,
                  number: metrics?.outOfBand ?? 0,
                  label: 'Out of band',
                  color: 'text-red-600',
                  bgColor: 'bg-red-100'
                }, {
                  icon: Clock,
                  number: metrics ? `${metrics.pendingApprovalsPct}%` : '0%',
                  label: 'Pending approvals',
                  color: 'text-yellow-600',
                  bgColor: 'bg-yellow-100'
                }].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={index} className="text-center">
                      <CardContent className="p-4">
                        <div className={`w-8 h-8 mx-auto mb-2 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">{item.number}</div>
                        {('subtitle' in item) && (item as any).subtitle && (
                          <div className={`text-xs ${item.color} mb-1`}>{(item as any).subtitle}</div>
                        )}
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Salary Benchmarking Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Salary Benchmarking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-2 flex-1">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search..."
                          className="pl-10"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => setIsUploadModalOpen(true)}
                      >
                        <Upload className="w-4 h-4" />
                        Upload market data
                      </Button>
                      <Button
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                        onClick={() => setShowSimulation(true)}
                      >
                        <Plus className="w-4 h-4" />
                        New stimulation
                      </Button>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role / Level</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Market data (P25 / P50 / P75)</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Internal band</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isBenchmarksLoading ? (
                          <tr><td className="py-6 px-4 text-muted-foreground" colSpan={5}>Loading benchmarks…</td></tr>
                        ) : salaryBenchmarkData.length === 0 ? (
                          <tr><td className="py-6 px-4 text-muted-foreground" colSpan={5}>No salary benchmarks.</td></tr>
                        ) : salaryBenchmarkData.map((item: any) => (
                          <tr key={item.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-foreground">{item.role_level}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-muted-foreground">{item.location}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex gap-4 text-sm">
                                  <span className="text-muted-foreground">P25: {item.market_p25 || '—'}</span>
                                  <span className="text-muted-foreground">P50: {item.market_p50 || '—'}</span>
                                  <span className="text-muted-foreground">P75: {item.market_p75 || '—'}</span>
                                </div>
                                {/* Visual range bar */}
                                <div className="w-full h-2 bg-gradient-to-r from-orange-300 via-yellow-300 to-green-300 rounded-full"></div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-muted-foreground">{item.internal_band || '—'}</div>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => setShowBenchmarkDetail(true)}
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Policy Portal Tab */}
            <TabsContent value="policy-portal" className="space-y-6 mt-6">
              {/* HR Policy Portal Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">HR Policy Portal</h2>

                {/* Search and Filter */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search...."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Policy Data Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground w-12"></th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Updated</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Version</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ack rate</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isPoliciesLoading ? (
                          <tr><td className="py-6 px-4 text-muted-foreground" colSpan={7}>Loading policies…</td></tr>
                        ) : policyData.length === 0 ? (
                          <tr><td className="py-6 px-4 text-muted-foreground" colSpan={7}>No policies found.</td></tr>
                        ) : policyData.map((policy: any) => {
                          const policyAcks = (allAcks as PolicyAck[]).filter(a => a.policy_id === policy.id);
                          const assigned = policyAcks.length;
                          const acknowledged = policyAcks.filter(a => a.status === 'acknowledged').length;
                          const ackRate = assigned > 0 ? Math.round((acknowledged / assigned) * 100) : 0;
                          const hasLowAck = ackRate < 90;
                          return (
                            <tr key={policy.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium text-foreground">{policy.title}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="secondary" className="text-xs">
                                  {policy.category}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-muted-foreground">{policy.updated_at_date ? new Date(policy.updated_at_date).toLocaleDateString() : '—'}</span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="secondary" className="text-xs">
                                  {policy.version}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <span className="text-muted-foreground">{ackRate}%</span>
                                  {hasLowAck && (
                                    <Badge variant="destructive" className="text-xs bg-red-600 text-white">
                                      Low
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handlePolicyView(policy)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-2"
                                  onClick={() => emailPolicy.mutate({ policy_id: policy.id, action: 'remind' })}
                                >
                                  Remind
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-2"
                                  onClick={() => acknowledge.mutate({ policy_id: policy.id })}
                                >
                                  Acknowledge
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Acknowledgements Tab */}
            <TabsContent value="acknowledgements" className="space-y-6 mt-6 pb-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Assigned Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                          <RotateCcw className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Total assigned</p>
                        <p className="text-2xl font-bold text-foreground">
                          {isAckSummaryLoading ? '—' : (ackSummary?.totals.totalAssigned ?? 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Acknowledged Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Acknowledged</p>
                        <div className="flex items-baseline space-x-2">
                          <p className="text-2xl font-bold text-foreground">
                            {isAckSummaryLoading ? '—' : (ackSummary?.totals.totalAcknowledged ?? 0)}
                          </p>
                          {!isAckSummaryLoading && ackSummary && ackSummary.totals.totalAssigned > 0 && (
                            <p className="text-sm text-green-600 font-medium">
                              ({Math.round((ackSummary.totals.totalAcknowledged / ackSummary.totals.totalAssigned) * 100)}%)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Overdue Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                        <p className="text-2xl font-bold text-foreground">
                          {isAckSummaryLoading ? '—' : (ackSummary?.totals.totalOverdue ?? 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Policy Acknowledgements Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Policy Acknowledgements</h2>

                  {/* Search and Filter */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search policies..."
                        className="pl-10 w-64"
                        value={ackSearchText}
                        onChange={(e) => setAckSearchText(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Acknowledgements Table */}
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground w-12"></th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Policy / Category</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Assigned</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Acknowledge</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Overdue</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last remind</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isAckSummaryLoading ? (
                            <tr><td className="py-6 px-4 text-muted-foreground" colSpan={7}>Loading acknowledgments…</td></tr>
                          ) : !ackSummary || ackSummary.rows.length === 0 ? (
                            <tr><td className="py-6 px-4 text-muted-foreground" colSpan={7}>No policy acknowledgments found.</td></tr>
                          ) : ackSummary.rows.map((row) => {
                            const ackPct = row.assigned > 0 ? Math.round((row.acknowledged / row.assigned) * 100) : 0;
                            const lastRemind = row.last_reminded_at ? new Date(row.last_reminded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                            return (
                              <tr key={row.policy_id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <div>
                                    <div className="font-medium text-foreground">{row.title}</div>
                                    <div className="text-sm text-muted-foreground">{row.category || '—'}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-muted-foreground">{row.assigned}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-muted-foreground">{row.acknowledged}</span>
                                    {row.assigned > 0 && (
                                      <span className="text-sm text-muted-foreground">
                                        ({ackPct}%)
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {row.overdue > 0 ? (
                                    <div className="flex items-center space-x-1">
                                      <AlertTriangle className="w-4 h-4 text-red-600" />
                                      <span className="text-red-600">{row.overdue}</span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-muted-foreground">{lastRemind}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      onClick={() => {
                                        emailPolicy.mutate({ policy_id: row.policy_id, action: 'remind' });
                                      }}
                                      disabled={emailPolicy.isPending}
                                    >
                                      <Bell className="w-3 h-3" />
                                      Remind
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      onClick={() => handleEscalateAcknowledgements({ policy_id: row.policy_id, title: row.title, category: row.category, overdue: row.overdue })}
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                      Escalate
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Document Expiry Tab */}
            <TabsContent value="document-expiry" className="space-y-6 mt-6">
              {/* Document Expiry Monitor Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Document Expiry Monitor</h2>

                {/* Search and Filter */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search...."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Document Expiry Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground w-12"></th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Owner</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Country</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Number</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Expiry</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isDocsLoading ? (
                          <tr><td className="py-6 px-4 text-muted-foreground" colSpan={8}>Loading documents…</td></tr>
                        ) : documentExpiryData.length === 0 ? (
                          <tr><td className="py-6 px-4 text-muted-foreground" colSpan={8}>No employee documents found.</td></tr>
                        ) : documentExpiryData.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-foreground">{item.owner}</div>
                                <div className="text-sm text-muted-foreground">{item.department}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-muted-foreground">{item.type}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-muted-foreground">{item.country}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-muted-foreground">{item.number}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-muted-foreground">{item.expiry}</span>
                            </td>
                            <td className="py-3 px-4">
                              {item.status === 'expiring' && (
                                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                  Expiring in {item.daysUntilExpiry}d
                                </Badge>
                              )}
                              {item.status === 'valid' && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Valid
                                </Badge>
                              )}
                              {item.status === 'expired' && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  Expired
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleDocumentView(item)}
                                >
                                  <Eye className="w-3 h-3" />
                                  View
                                </Button>
                                {item.status !== 'valid' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => {
                                      sendDocReminder.mutate({ document_id: item.id });
                                    }}
                                    disabled={sendDocReminder.isPending}
                                  >
                                    <Bell className="w-3 h-3" />
                                    Remind
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Upload Market Data Modal */}
          <UploadMarketDataModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onImport={handleFileImport}
          />

          {/* Policy Detail Modal */}
          <PolicyDetailModal
            isOpen={isPolicyModalOpen}
            onClose={() => setIsPolicyModalOpen(false)}
            onAcknowledge={handlePolicyAcknowledge}
            onSendReminders={handleSendReminders}
            policy={selectedPolicy}
            assignedCount={(allAcks as PolicyAck[]).filter(a => a.policy_id === (selectedPolicy as any)?.id).length}
            acknowledgedCount={(allAcks as PolicyAck[]).filter(a => a.policy_id === (selectedPolicy as any)?.id && a.status === 'acknowledged').length}
            pendingCount={(allAcks as PolicyAck[]).filter(a => a.policy_id === (selectedPolicy as any)?.id && a.status !== 'acknowledged').length}
          />

          {/* Escalate Acknowledgements Modal */}
          <EscalateAcknowledgementsModal
            isOpen={isEscalateModalOpen}
            onClose={() => setIsEscalateModalOpen(false)}
            onSendEscalation={handleSendEscalation}
            onScheduleForLater={handleScheduleForLater}
            policy={selectedEscalatePolicy}
          />

          {/* Document Details Modal */}
          <DocumentDetailsModal
            isOpen={isDocumentModalOpen}
            onClose={() => setIsDocumentModalOpen(false)}
            onSendReminder={handleSendRenewalReminder}
            onUploadRenewed={handleUploadRenewedDocument}
            document={selectedDocument}
          />
        </>
      )}
    </div>
  );
};

export default CompensationPolicies;
