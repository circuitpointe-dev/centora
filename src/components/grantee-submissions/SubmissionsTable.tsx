import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, List, Filter, Eye, Loader2 } from 'lucide-react';
import { useGranteeSubmissions, type GranteeSubmission } from '@/hooks/grants/useGranteeSubmissions';
import SubmissionDetailDialog from './SubmissionDetailDialog';

export const SubmissionsTable = () => {
  const { submissions, loading, updateSubmissionStatus } = useGranteeSubmissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<GranteeSubmission | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const itemsPerPage = 8;

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      (submission.grant?.grant_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submission_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const normalizedStatus = submission.status === 'pending_review' ? 'Pending review' : 
                            submission.status === 'revision_requested' ? 'Revision requested' :
                            submission.status === 'approved' ? 'Approved' : submission.status;
    
    const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;
    const matchesType = typeFilter === 'all' || submission.submission_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status === 'pending_review' ? 'Pending review' : 
                            status === 'revision_requested' ? 'Revision requested' :
                            status === 'approved' ? 'Approved' : status;
    
    switch (normalizedStatus) {
      case 'Pending review':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'Revision requested':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleViewSubmission = (submission: GranteeSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading submissions...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Submissions inbox</h3>
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            new ({submissions.filter(s => s.status === 'pending_review').length})
          </span>
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
                        <SelectItem value="Pending review">Pending review</SelectItem>
                        <SelectItem value="Revision requested">Revision requested</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Submission Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        <SelectItem value="Narrative">Narrative</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="M & E">M & E</SelectItem>
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
                  <TableHead>Submission type</TableHead>
                  <TableHead>Grant name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Submitted on</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.submission_type}</TableCell>
                    <TableCell>{submission.grant?.grant_name || 'N/A'}</TableCell>
                    <TableCell>{submission.organization_name}</TableCell>
                    <TableCell>{new Date(submission.submitted_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={getStatusBadge(submission.status)}>
                        {submission.status === 'pending_review' ? 'Pending review' : 
                         submission.status === 'revision_requested' ? 'Revision requested' :
                         submission.status === 'approved' ? 'Approved' : submission.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewSubmission(submission)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedSubmissions.map((submission) => (
            <Card key={submission.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Submission type</span>
                  <span className="font-medium">{submission.submission_type}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grant name</span>
                  <span className="font-medium">{submission.grant?.grant_name || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Organization</span>
                  <span className="font-medium">{submission.organization_name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Submitted at</span>
                  <span className="font-medium">{new Date(submission.submitted_date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={getStatusBadge(submission.status)}>
                    {submission.status === 'pending_review' ? 'Pending review' : 
                     submission.status === 'revision_requested' ? 'Revision requested' :
                     submission.status === 'approved' ? 'Approved' : submission.status}
                  </span>
                </div>
                
                 <div className="flex justify-between items-center">
                   <span className="text-sm text-gray-600">Action</span>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     className="p-0 h-auto font-normal text-gray-600"
                     onClick={() => handleViewSubmission(submission)}
                   >
                     <Eye className="h-4 w-4 mr-1" />
                     View
                   </Button>
                 </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length} grant
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

    {/* Submission Detail Dialog */}
    <SubmissionDetailDialog
      submission={selectedSubmission}
      isOpen={showDetailDialog}
      onClose={() => setShowDetailDialog(false)}
    />
  </>
  );
};