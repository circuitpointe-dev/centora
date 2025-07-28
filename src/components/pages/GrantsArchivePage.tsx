
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, Search, Eye, Filter, Grid, List, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import ArchivedGrantDetailsDialog from '@/components/grants/archive/ArchivedGrantDetailsDialog';

// Sample data
const archivedGrantsData = [
  {
    id: 1,
    name: "Clean Water Initiative",
    organization: "WaterAid Foundation",
    status: "Closed",
    compliance: 95,
    disbursementRate: 100,
    reportingStatus: "Complete",
    programArea: "Health"
  },
  {
    id: 2,
    name: "Education for All",
    organization: "Education Trust",
    status: "Closed",
    compliance: 88,
    disbursementRate: 95,
    reportingStatus: "Complete",
    programArea: "Education"
  },
  {
    id: 3,
    name: "Rural Healthcare",
    organization: "Medical Relief Org",
    status: "Closed",
    compliance: 92,
    disbursementRate: 98,
    reportingStatus: "Pending",
    programArea: "Health"
  },
];

const regionData = [
  { region: 'Africa', grants: 45 },
  { region: 'Asia', grants: 38 },
  { region: 'Americas', grants: 32 },
  { region: 'Europe', grants: 28 },
  { region: 'Oceania', grants: 13 },
];

const programAreaData = [
  { name: 'Health', value: 89, color: '#10b981' },
  { name: 'Education', value: 67, color: '#3b82f6' },
];

const GrantsArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGrant, setSelectedGrant] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredGrants = archivedGrantsData.filter(grant => {
    const matchesSearch = grant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || grant.programArea === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  const totalPages = Math.ceil(filteredGrants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredGrants.slice(startIndex, startIndex + itemsPerPage);

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
                <p className="text-2xl font-bold text-gray-900">156</p>
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
                <p className="text-2xl font-bold text-gray-900">18 months</p>
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Bar dataKey="grants" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={programAreaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {programAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
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
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Grant Name</p>
                <p className="font-medium">Clean Water Initiative</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Organization</p>
                <p className="font-medium">WaterAid Foundation</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Archived Date</p>
                <p className="font-medium">March 15, 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Final Status</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Successful</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Grant Name</p>
                <p className="font-medium">Education for All</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Organization</p>
                <p className="font-medium">Education Trust</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Archived Date</p>
                <p className="font-medium">February 28, 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Final Status</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Successful</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Grant Name</p>
                <p className="font-medium">Rural Healthcare</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Organization</p>
                <p className="font-medium">Medical Relief Org</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Archived Date</p>
                <p className="font-medium">January 20, 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Final Status</p>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
              </div>
            </div>
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
                    <TableCell className="font-medium">{grant.name}</TableCell>
                    <TableCell>{grant.organization}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        {grant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getComplianceColor(grant.compliance)}>
                        {grant.compliance}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDisbursementColor(grant.disbursementRate)}>
                        {grant.disbursementRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {grant.reportingStatus === 'Complete' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm">{grant.reportingStatus}</span>
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
                    <CardTitle className="text-base">{grant.name}</CardTitle>
                    <CardDescription>{grant.organization}</CardDescription>
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
                        <Badge className={getComplianceColor(grant.compliance)}>
                          {grant.compliance}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Disbursement:</span>
                        <Badge className={getDisbursementColor(grant.disbursementRate)}>
                          {grant.disbursementRate}%
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
