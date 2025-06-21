
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const GrantsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    grantName: '',
    organization: '',
    status: 'all',
    reportingStatus: 'all',
    region: 'all',
    year: 'all'
  });

  // Mock data for grants
  const grantsData = [
    {
      id: 1,
      grantName: "Education Access Initiative",
      organization: "Learn Together Foundation",
      status: "Active",
      compliance: 95,
      disbursement: 75,
      reportingStatus: "All Submitted",
      region: "North America",
      year: "2024"
    },
    {
      id: 2,
      grantName: "Healthcare Improvement Project",
      organization: "Health for All NGO",
      status: "Pending",
      compliance: 88,
      disbursement: 0,
      reportingStatus: "2 Reports Due",
      region: "Africa",
      year: "2024"
    },
    {
      id: 3,
      grantName: "Clean Water Access",
      organization: "Water Solutions Inc",
      status: "Overdue",
      compliance: 72,
      disbursement: 45,
      reportingStatus: "1 Report Due",
      region: "Asia",
      year: "2023"
    },
    {
      id: 4,
      grantName: "Youth Development Program",
      organization: "Future Leaders Org",
      status: "Active",
      compliance: 92,
      disbursement: 80,
      reportingStatus: "No Reports",
      region: "Europe",
      year: "2024"
    },
    {
      id: 5,
      grantName: "Environmental Conservation",
      organization: "Green Earth Foundation",
      status: "Closed",
      compliance: 100,
      disbursement: 100,
      reportingStatus: "All Submitted",
      region: "South America",
      year: "2023"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportingStatusColor = (status: string) => {
    if (status === 'All Submitted') return 'bg-green-100 text-green-800';
    if (status === 'No Reports') return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(grantsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = grantsData.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle>Grants Portfolio</CardTitle>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Grant
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Grant Name"
              value={filters.grantName}
              onChange={(e) => setFilters({...filters, grantName: e.target.value})}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Organization"
              value={filters.organization}
              onChange={(e) => setFilters({...filters, organization: e.target.value})}
              className="pl-10"
            />
          </div>
          <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.reportingStatus} onValueChange={(value) => setFilters({...filters, reportingStatus: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Reporting Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="submitted">All Submitted</SelectItem>
              <SelectItem value="due">Reports Due</SelectItem>
              <SelectItem value="none">No Reports</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.region} onValueChange={(value) => setFilters({...filters, region: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="south-america">South America</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grant Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Disbursement</TableHead>
                <TableHead>Reporting Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((grant) => (
                <TableRow key={grant.id}>
                  <TableCell className="font-medium">{grant.grantName}</TableCell>
                  <TableCell>{grant.organization}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(grant.status)}>
                      {grant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${grant.compliance}%` }}
                        />
                      </div>
                      <span className="text-sm">{grant.compliance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${grant.disbursement}%` }}
                        />
                      </div>
                      <span className="text-sm">{grant.disbursement}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getReportingStatusColor(grant.reportingStatus)}>
                      {grant.reportingStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};
