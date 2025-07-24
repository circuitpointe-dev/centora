import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, List, Filter, Eye } from 'lucide-react';
import { submissionsData, type Submission } from './data/submissionsData';

export const SubmissionsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredSubmissions = submissionsData.filter(submission =>
    submission.grantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.submissionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: Submission['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
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

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Submissions inbox</h3>
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            new (19)
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
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
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
                    <TableCell className="font-medium">{submission.submissionType}</TableCell>
                    <TableCell>{submission.grantName}</TableCell>
                    <TableCell>{submission.organization}</TableCell>
                    <TableCell>{submission.submittedOn}</TableCell>
                    <TableCell>
                      <span className={getStatusBadge(submission.status)}>
                        {submission.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
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
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Submission type</p>
                    <p className="font-medium">{submission.submissionType}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Grant name</p>
                  <p className="font-medium">{submission.grantName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Organization</p>
                  <p className="font-medium">{submission.organization}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Submitted at</p>
                  <p className="font-medium">{submission.submittedOn}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={getStatusBadge(submission.status)}>
                    {submission.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Action</p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto font-normal text-gray-600">
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
  );
};