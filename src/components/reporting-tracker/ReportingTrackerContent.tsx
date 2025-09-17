import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Filter, Eye, RotateCcw, Send, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGrantReports } from '@/hooks/grants/useGrantReports';
import { useGrants } from '@/hooks/grants/useGrants';
import { GrantReport } from '@/types/grants';
import { ReportDetailsDialog } from './ReportDetailsDialog';

export const ReportingTrackerContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GrantReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();
  
  const { grants, loading: grantsLoading } = useGrants();
  const { reports, loading: reportsLoading, updateReport } = useGrantReports();

  // Transform backend data to frontend format
  const grantsWithReports = grants.map(grant => {
    const grantReports = reports.filter(report => report.grant_id === grant.id);
    
    return {
      id: grant.id,
      grantName: grant.grant_name,
      organization: grant.donor_name,
      reports: grantReports
    };
  });

  const filteredGrants = grantsWithReports.filter(grant => {
    const matchesSearch = 
      grant.grantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all' && typeFilter === 'all') {
      return matchesSearch;
    }

    const hasMatchingReport = grant.reports.some(report => {
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesType = typeFilter === 'all' || report.report_type === typeFilter;
      return matchesStatus && matchesType;
    });

    return matchesSearch && hasMatchingReport;
  });

  const totalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGrants = filteredGrants.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButton = (report: GrantReport) => {
    if (report.submitted) {
      return (
        <Button variant="ghost" size="sm" onClick={() => handleView(report)}>
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      );
    } else if (report.status === 'overdue') {
      return (
        <Button variant="ghost" size="sm" onClick={() => handleResubmit(report)}>
          <RotateCcw className="h-3 w-3 mr-1" />
          Resubmit
        </Button>
      );
    } else {
      return (
        <Button variant="ghost" size="sm" onClick={() => handleSubmit(report)}>
          <Upload className="h-3 w-3 mr-1" />
          Submit
        </Button>
      );
    }
  };

  const handleView = (report: GrantReport) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleResubmit = async (report: GrantReport) => {
    try {
      await updateReport(report.id, { 
        status: 'in_progress' as any,
        submitted: false,
        submitted_date: null
      });
      toast({
        title: "Report Updated",
        description: `${report.report_type} report marked for resubmission`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (report: GrantReport) => {
    try {
      await updateReport(report.id, { 
        status: 'submitted' as any,
        submitted: true,
        submitted_date: new Date().toISOString().split('T')[0]
      });
      toast({
        title: "Report Submitted",
        description: `${report.report_type} report has been submitted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    }
  };

  if (grantsLoading || reportsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Grant list</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search grant, organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-4 z-10 w-64">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="narrative">Narrative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setStatusFilter('all');
                      setTypeFilter('all');
                      setShowFilterDropdown(false);
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accordion list of grants */}
      <Card>
        <CardContent className="p-4">
          <Accordion type="multiple" className="w-full space-y-2">
            {paginatedGrants.map((grant) => (
              <AccordionItem key={grant.id} value={grant.id} className="border rounded-sm">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium text-left">{grant.grantName}</span>
                    <span className="text-sm text-gray-500">{grant.organization}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {grant.reports.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {grant.reports.map((report) => (
                          <Card key={report.id} className="p-3">
                            <div className="space-y-2">
                              <div className="text-center">
                                <h5 className="font-medium text-sm capitalize">{report.report_type}</h5>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Due Date</span>
                                  <span className="text-right">{new Date(report.due_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status</span>
                                  <Badge className={getStatusBadge(report.status)} variant="secondary">
                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Submitted</span>
                                  <span className="text-right">
                                    {report.submitted_date 
                                      ? new Date(report.submitted_date).toLocaleDateString() 
                                      : 'Not submitted'
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Action</span>
                                  <div className="text-right">
                                    {getActionButton(report)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No reports found for this grant
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredGrants.length)} of {filteredGrants.length} grant{filteredGrants.length === 1 ? '' : 's'}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Report Details Dialog */}
      <ReportDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        report={selectedReport}
      />
    </div>
  );
};