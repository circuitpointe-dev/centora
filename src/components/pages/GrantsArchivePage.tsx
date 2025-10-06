
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, Search, Eye, Filter, Grid, List, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useGrantsWithStats } from '@/hooks/grants/useGrantsWithStats';
import ArchivedGrantDetailsDialog from '@/components/grants/archive/ArchivedGrantDetailsDialog';

const GrantsArchivePage = () => {
  const { grants, loading } = useGrantsWithStats({ status: 'closed' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGrant, setSelectedGrant] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.grant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.donor_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || grant.program_area === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  // Generate statistics from real data
  const regionData = grants.reduce((acc, grant) => {
    if (grant.region) {
      acc[grant.region] = (acc[grant.region] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const regionChartData = Object.entries(regionData).map(([region, grants]) => ({
    region,
    grants
  }));

  const programAreaData = grants.reduce((acc, grant) => {
    if (grant.program_area) {
      acc[grant.program_area] = (acc[grant.program_area] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const programChartData = Object.entries(programAreaData).map(([name, value], index) => ({
    name,
    value,
    color: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#f59e0b'
  }));

  const totalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredGrants.slice(startIndex, startIndex + itemsPerPage);

  // Calculate average grant duration from real data
  const averageGrantDuration = grants.length > 0 ?
    grants.reduce((total, grant) => {
      const startDate = new Date(grant.start_date);
      const endDate = new Date(grant.end_date);
      const durationInMonths = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44); // Average days per month
      return total + durationInMonths;
    }, 0) / grants.length : 0;

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'bg-green-100 text-green-800';
    if (compliance >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getDisbursementColor = (rate: number) => {
    if (rate >= 95) return 'bg-green-100 text-green-800';
    if (rate >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading archived grants...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">
            Grants Archive
          </h1>
          <p className="text-gray-600">
            Historical grants database and long-term storage
          </p>
        </div>
      </div>

      {/* Stats and Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stat Cards Column */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-lg bg-purple-50">
                  <Archive className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{grants.length}</p>
                <p className="text-sm text-gray-600">Total Archived Grants</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-lg bg-blue-50">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {averageGrantDuration > 0 ? `${Math.round(averageGrantDuration)} months` : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Average Grant Duration</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Grants by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {regionChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Bar dataKey="grants" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No region data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Program Area Doughnut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Archived Grants by Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              {programChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={programChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {programChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No program data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Recent Archived Grants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-medium">
            <Archive className="h-5 w-5" />
            <span>Most Recent Archived Grants</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {grants.slice(0, 3).map((grant, index) => (
              <div key={grant.id} className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Grant Name</p>
                  <p className="font-medium">{grant.grant_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Donor</p>
                  <p className="font-medium">{grant.donor_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium">{new Date(grant.end_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {grant.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Compliance Rate</p>
                  <Badge className={getComplianceColor(grant.compliance_rate || 0)}>
                    {Math.round(grant.compliance_rate || 0)}%
                  </Badge>
                </div>
              </div>
            ))}
            {grants.length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No archived grants available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-medium">Archived Grants</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search grants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Program Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table View */}
          {viewMode === 'list' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grant Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Disbursement Rate</TableHead>
                  <TableHead>Reporting Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((grant) => (
                  <TableRow key={grant.id}>
                    <TableCell className="font-medium">{grant.grant_name}</TableCell>
                    <TableCell>{grant.donor_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        {grant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getComplianceColor(grant.compliance_rate || 0)}>
                        {Math.round(grant.compliance_rate || 0)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDisbursementColor(grant.disbursement_rate || 0)}>
                        {Math.round(grant.disbursement_rate || 0)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {grant.reporting_status === 'submitted' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm">{grant.reporting_status || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedGrant(grant);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentData.map((grant) => (
                <Card key={grant.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{grant.grant_name}</CardTitle>
                    <CardDescription>{grant.donor_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                          {grant.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Compliance:</span>
                        <Badge className={getComplianceColor(grant.compliance_rate || 0)}>
                          {Math.round(grant.compliance_rate || 0)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Disbursement:</span>
                        <Badge className={getDisbursementColor(grant.disbursement_rate || 0)}>
                          {Math.round(grant.disbursement_rate || 0)}%
                        </Badge>
                      </div>
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedGrant(grant);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredGrants.length)} of {filteredGrants.length} grants
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grant Details Dialog */}
      {selectedGrant && (
        <ArchivedGrantDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedGrant(null);
          }}
          grant={selectedGrant}
        />
      )}
    </div>
  );
};

export default GrantsArchivePage;
