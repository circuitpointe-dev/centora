import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, Upload, CheckCircle } from 'lucide-react';

interface DisbursementRecord {
  id: number;
  grantName: string;
  organization: string;
  totalGrant: number;
  amountDisbursed: number;
  dueDate: string;
  status: 'Pending' | 'Released' | 'Delayed';
}

const disbursementData: DisbursementRecord[] = [
  {
    id: 1,
    grantName: 'Clean Water 2',
    organization: 'UNICEF',
    totalGrant: 100000,
    amountDisbursed: 75000,
    dueDate: 'Jul 5, 2025',
    status: 'Pending',
  },
  {
    id: 2,
    grantName: 'EduBridge',
    organization: 'GAC',
    totalGrant: 200000,
    amountDisbursed: 150000,
    dueDate: 'Jul 5, 2025',
    status: 'Released',
  },
  {
    id: 3,
    grantName: 'Rural Health Initiative',
    organization: 'USAID',
    totalGrant: 180000,
    amountDisbursed: 65000,
    dueDate: 'Jul 5, 2025',
    status: 'Delayed',
  },
  {
    id: 4,
    grantName: 'Rural Health Initiative',
    organization: 'UNICEF',
    totalGrant: 80000,
    amountDisbursed: 40000,
    dueDate: 'Jul 8, 2025',
    status: 'Released',
  },
];

export const DisbursementTable = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = disbursementData.filter(item => {
    const matchesSearch = item.grantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Released': 'bg-green-100 text-green-800',
      'Delayed': 'bg-red-100 text-red-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const handleMarkAsDisbursed = (id: number) => {
    console.log('Mark as disbursed:', id);
  };

  const handleUploadReceipt = (id: number) => {
    console.log('Upload receipt:', id);
  };

  const renderListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Grant Name</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Total Grant</TableHead>
          <TableHead>Amount Disbursed</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.grantName}</TableCell>
            <TableCell>{item.organization}</TableCell>
            <TableCell>{formatCurrency(item.totalGrant)}</TableCell>
            <TableCell>{formatCurrency(item.amountDisbursed)}</TableCell>
            <TableCell>{item.dueDate}</TableCell>
            <TableCell>
              <Badge className={getStatusBadge(item.status)}>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAsDisbursed(item.id)}
                  className="text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark as Disbursed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUploadReceipt(item.id)}
                  className="text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload Receipt
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {currentData.map((item) => (
        <Card key={item.id} className="p-4">
          <CardContent className="p-0">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{item.grantName}</h3>
                <Badge className={getStatusBadge(item.status)}>
                  {item.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Organization:</span> {item.organization}</p>
                <p><span className="font-medium">Total Grant:</span> {formatCurrency(item.totalGrant)}</p>
                <p><span className="font-medium">Amount Disbursed:</span> {formatCurrency(item.amountDisbursed)}</p>
                <p><span className="font-medium">Due Date:</span> {item.dueDate}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAsDisbursed(item.id)}
                  className="text-xs"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Mark as Disbursed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUploadReceipt(item.id)}
                  className="text-xs"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg font-medium">Disbursement Monitor</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search grant, organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No disbursement records found.</p>
          </div>
        ) : (
          <>
            {viewMode === 'list' ? renderListView() : renderGridView()}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} grants
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};