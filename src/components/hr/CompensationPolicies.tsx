import React, { useState } from 'react';
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

  // Handle policy acknowledgment
  const handlePolicyAcknowledge = () => {
    console.log('Policy acknowledged:', selectedPolicy?.title);
    setIsPolicyModalOpen(false);
    setSelectedPolicy(null);
  };

  // Handle send reminders
  const handleSendReminders = () => {
    console.log('Sending reminders for:', selectedPolicy?.title);
    // Here you would typically handle sending reminders
  };

  // Handle escalate acknowledgements
  const handleEscalateAcknowledgements = (policy: any) => {
    setSelectedEscalatePolicy(policy);
    setIsEscalateModalOpen(true);
  };

  // Handle send escalation
  const handleSendEscalation = () => {
    console.log('Sending escalation for:', selectedEscalatePolicy?.policy);
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

  // Handle send renewal reminder
  const handleSendRenewalReminder = () => {
    console.log('Sending renewal reminder for:', selectedDocument?.owner);
    setIsDocumentModalOpen(false);
    setSelectedDocument(null);
  };

  // Handle upload renewed document
  const handleUploadRenewedDocument = () => {
    console.log('Uploading renewed document for:', selectedDocument?.owner);
    setIsDocumentModalOpen(false);
    setSelectedDocument(null);
  };

  // Mock data for key metrics
  const metricsData = [
    { 
      icon: BarChart3, 
      number: '4', 
      label: 'Total benchmark', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      icon: CheckCircle, 
      number: '0.94', 
      label: 'Average compa-ratio', 
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subtitle: 'healthy'
    },
    { 
      icon: AlertTriangle, 
      number: '0', 
      label: 'Out of band', 
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    { 
      icon: Clock, 
      number: '78%', 
      label: 'Pending approvals', 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  // Mock data for salary benchmarking table
  const salaryBenchmarkData = [
    {
      id: 1,
      role: 'SE II (L5)',
      location: 'Lagos',
      marketData: {
        p25: '7.2m NGN',
        p50: '8.5m NGN',
        p75: '9.8m NGN'
      },
      internalBand: '7.0m NGN - 9.5m NGN'
    },
    {
      id: 2,
      role: 'Product manager (L6)',
      location: 'Nairobi',
      marketData: {
        p25: '3.2m KES',
        p50: '4.1m KES',
        p75: '5.0m KES'
      },
      internalBand: '7.0m NGN - 9.5m NGN'
    },
    {
      id: 3,
      role: 'Data analyst (L4)',
      location: 'Accra',
      marketData: {
        p25: '85k GHS',
        p50: '105k GHS',
        p75: '125k GHS'
      },
      internalBand: '7.0m NGN - 9.5m NGN'
    },
    {
      id: 4,
      role: 'Operation lead (L5)',
      location: 'Kampala',
      marketData: {
        p25: '85.0m UGX',
        p50: '100.0m UGX',
        p75: '115.0m UGX'
      },
      internalBand: '7.0m NGN - 9.5m NGN'
    }
  ];

  // Mock data for HR policies
  const policyData = [
    {
      id: 1,
      title: 'Code of conduct',
      category: 'Ethics',
      updated: 'Jul 2, 2025',
      version: 'v3',
      ackRate: 96,
      hasLowAck: false
    },
    {
      id: 2,
      title: 'Data privacy policy',
      category: 'Compliance',
      updated: 'Aug 15, 2025',
      version: 'v2',
      ackRate: 89,
      hasLowAck: true
    },
    {
      id: 3,
      title: 'Incident response plan',
      category: 'Security',
      updated: 'Sep 1, 2025',
      version: 'v4',
      ackRate: 92,
      hasLowAck: true
    },
    {
      id: 4,
      title: 'Remote work guidelines',
      category: 'HR',
      updated: 'Nov 20, 2025',
      version: 'v3',
      ackRate: 100,
      hasLowAck: false
    },
    {
      id: 5,
      title: 'Diversity and inclusion policy',
      category: 'Culture',
      updated: 'Oct 10, 2025',
      version: 'v1',
      ackRate: 85,
      hasLowAck: true
    }
  ];

  // Mock data for acknowledgements
  const acknowledgementsData = [
    {
      id: 1,
      policy: 'Code of conduct',
      org: 'Sales',
      assigned: 124,
      acknowledged: 121,
      overdue: 3,
      lastRemind: 'Aug 15, 2025'
    },
    {
      id: 2,
      policy: 'Customer feedback',
      org: 'Support',
      assigned: 88,
      acknowledged: 71,
      overdue: 17,
      lastRemind: 'Jul 30, 2025'
    },
    {
      id: 3,
      policy: 'Project updates',
      org: 'Development',
      assigned: 24,
      acknowledged: 24,
      overdue: 0,
      lastRemind: 'Sep 10, 2025'
    },
    {
      id: 4,
      policy: 'Budget review',
      org: 'Finance',
      assigned: 42,
      acknowledged: 39,
      overdue: 3,
      lastRemind: 'Oct 1, 2025'
    }
  ];

  // Mock data for document expiry
  const documentExpiryData = [
    {
      id: 1,
      owner: 'Jane Doe',
      department: 'Engineering',
      type: 'Work permit',
      country: 'Nigeria',
      number: 'WP-2024-8834',
      expiry: 'Jul 30, 2025',
      status: 'expiring',
      daysUntilExpiry: 30
    },
    {
      id: 2,
      owner: 'Ryan Cole',
      department: 'Engineering',
      type: 'ID Card',
      country: 'Nigeria',
      number: 'WP-2024-8834',
      expiry: 'Jul 30, 2025',
      status: 'valid',
      daysUntilExpiry: null
    },
    {
      id: 3,
      owner: 'Maria Garcia',
      department: 'HR',
      type: 'Professional License',
      country: 'Nigeria',
      number: 'WP-2024-8834',
      expiry: 'Jul 30, 2025',
      status: 'expiring',
      daysUntilExpiry: 60
    },
    {
      id: 4,
      owner: 'Alex Brown',
      department: 'Sales',
      type: 'Passport',
      country: 'Nigeria',
      number: 'WP-2024-8834',
      expiry: 'Jul 30, 2025',
      status: 'expired',
      daysUntilExpiry: null
    }
  ];

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
            {metricsData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <div className={`w-8 h-8 mx-auto mb-2 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{item.number}</div>
                    {item.subtitle && (
                      <div className={`text-xs ${item.color} mb-1`}>{item.subtitle}</div>
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
                    {salaryBenchmarkData.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-foreground">{item.role}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-muted-foreground">{item.location}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex gap-4 text-sm">
                              <span className="text-muted-foreground">P25: {item.marketData.p25}</span>
                              <span className="text-muted-foreground">P50: {item.marketData.p50}</span>
                              <span className="text-muted-foreground">P75: {item.marketData.p75}</span>
                            </div>
                            {/* Visual range bar */}
                            <div className="w-full h-2 bg-gradient-to-r from-orange-300 via-yellow-300 to-green-300 rounded-full"></div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-muted-foreground">{item.internalBand}</div>
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
                    {policyData.map((policy) => (
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
                          <span className="text-muted-foreground">{policy.updated}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-xs">
                            {policy.version}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">{policy.ackRate}%</span>
                            {policy.hasLowAck && (
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
                        </td>
                      </tr>
                    ))}
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
                    <p className="text-2xl font-bold text-foreground">281</p>
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
                      <p className="text-2xl font-bold text-foreground">256</p>
                      <p className="text-sm text-green-600 font-medium">(91%)</p>
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
                    <p className="text-2xl font-bold text-foreground">25</p>
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

            {/* Acknowledgements Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground w-12"></th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Policy / Org</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Assigned</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Acknowledge</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Overdue</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last remind</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acknowledgementsData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-foreground">{item.policy}</div>
                              <div className="text-sm text-muted-foreground">{item.org}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-muted-foreground">{item.assigned}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-muted-foreground">{item.acknowledged}</span>
                              <span className="text-sm text-muted-foreground">
                                ({Math.round((item.acknowledged / item.assigned) * 100)}%)
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {item.overdue > 0 ? (
                              <div className="flex items-center space-x-1">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-red-600">{item.overdue}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-muted-foreground">{item.lastRemind}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1"
                              >
                                <Bell className="w-3 h-3" />
                                Remind
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => handleEscalateAcknowledgements(item)}
                              >
                                <ArrowUp className="w-3 h-3" />
                                Escalate
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                    {documentExpiryData.map((item) => (
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
