import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Filter, Eye, RotateCcw, Send } from 'lucide-react';
import { reportSubmissionData, type GrantSubmissionData, type ReportSubmissionData } from './data/reportSubmissionData';
import { useToast } from '@/hooks/use-toast';

export const ReportingTrackerContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const filteredGrants = reportSubmissionData.filter(grant => {
    const matchesSearch = 
      grant.grantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status and type across all reports in all periods
    if (statusFilter === 'all' && typeFilter === 'all') {
      return matchesSearch;
    }

    const hasMatchingReport = grant.periods.some(period =>
      period.reports.some(report => {
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        const matchesType = typeFilter === 'all' || report.reportType === typeFilter;
        return matchesStatus && matchesType;
      })
    );

    return matchesSearch && hasMatchingReport;
  });

  const totalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGrants = filteredGrants.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: ReportSubmissionData['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not submitted':
        return 'bg-red-100 text-red-800';
      case 'Awaiting reviewer feedback':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButton = (report: ReportSubmissionData) => {
    switch (report.action) {
      case 'View':
        return (
          <Button variant="ghost" size="sm" onClick={() => handleView(report)}>
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        );
      case 'Resubmit':
        return (
          <Button variant="ghost" size="sm" onClick={() => handleResubmit(report)}>
            <RotateCcw className="h-3 w-3 mr-1" />
            Resubmit
          </Button>
        );
      case 'Submit':
        return (
          <Button variant="ghost" size="sm" onClick={() => handleSubmit(report)}>
            <Send className="h-3 w-3 mr-1" />
            Submit
          </Button>
        );
      default:
        return null;
    }
  };

  const handleView = (report: ReportSubmissionData) => {
    toast({
      title: "View Report",
      description: `Viewing ${report.reportType} report`,
    });
  };

  const handleResubmit = (report: ReportSubmissionData) => {
    toast({
      title: "Resubmit Report",
      description: `Resubmitting ${report.reportType} report`,
    });
  };

  const handleSubmit = (report: ReportSubmissionData) => {
    toast({
      title: "Submit Report",
      description: `Submitting ${report.reportType} report`,
    });
  };

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
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending review">Pending review</SelectItem>
                        <SelectItem value="Not submitted">Not submitted</SelectItem>
                        <SelectItem value="Awaiting reviewer feedback">Awaiting reviewer feedback</SelectItem>
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
                        <SelectItem value="Narrative">Narrative</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="M&E">M&E</SelectItem>
                        <SelectItem value="Report">Report</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
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
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {grant.periods.map((period) => (
                      <div key={period.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-sm">{period.name}</h4>
                          <span className="text-xs text-gray-500">{period.dateRange}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                          {period.reports.map((report) => (
                            <Card key={report.id} className="p-3">
                              <div className="space-y-2">
                                <div className="text-center">
                                  <h5 className="font-medium text-sm">{report.reportType}</h5>
                                </div>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <Badge className={getStatusBadge(report.status)} variant="secondary">
                                      {report.status}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Comments</span>
                                    <span className="text-right max-w-20 truncate">{report.comments}</span>
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
                      </div>
                    ))}
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
    </div>
  );
};