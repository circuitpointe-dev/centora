import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, List, Filter, Send, UserPlus, Eye } from 'lucide-react';
import { reportingData, type ReportingItem } from './data/reportingData';
import { useToast } from '@/hooks/use-toast';

export const ReportingTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const itemsPerPage = 8;
  const { toast } = useToast();

  const filteredReports = reportingData.filter(report => {
    const matchesSearch = 
      report.grantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.reportType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: ReportingItem['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Not submitted':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Submitted':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Reviewed':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleSendReminder = (reportId: string) => {
    toast({
      title: "Reminder Sent",
      description: "Reminder has been sent to the grantee.",
    });
  };

  const handleAssignReviewer = (reportId: string) => {
    toast({
      title: "Reviewer Assignment",
      description: "Reviewer assignment dialog would open here.",
    });
  };

  const handleViewReport = (reportId: string) => {
    toast({
      title: "View Report",
      description: "Report details would open here.",
    });
  };

  const getActionButton = (report: ReportingItem) => {
    if (report.status === 'Not submitted') {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleSendReminder(report.id)}
        >
          <Send className="h-4 w-4 mr-1" />
          Send reminder
        </Button>
      );
    } else if (report.status === 'Submitted' && report.reviewer === 'Unassigned') {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleAssignReviewer(report.id)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Assign reviewer
        </Button>
      );
    } else {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleViewReport(report.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View report
        </Button>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Reporting tracker</h3>
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
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
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
                        <SelectItem value="Not submitted">Not submitted</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
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

      {/* Content - List or Grid View */}
      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grant name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Report type</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.grantName}</TableCell>
                    <TableCell>{report.organization}</TableCell>
                    <TableCell>{report.reportType}</TableCell>
                    <TableCell>{report.dueDate}</TableCell>
                    <TableCell>
                      <span className={getStatusBadge(report.status)}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell>{report.reviewer}</TableCell>
                    <TableCell>
                      {getActionButton(report)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedReports.map((report) => (
            <Card key={report.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grant name</span>
                  <span className="font-medium text-right">{report.grantName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Organization</span>
                  <span className="font-medium text-right">{report.organization}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Report type</span>
                  <span className="font-medium text-right">{report.reportType}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due date</span>
                  <span className="font-medium text-right">{report.dueDate}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={getStatusBadge(report.status)}>
                    {report.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reviewer</span>
                  <span className="font-medium text-right">{report.reviewer}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Action</span>
                  <div className="text-right">
                    {getActionButton(report)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
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