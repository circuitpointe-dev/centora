import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Grid, List, Upload, CheckCircle, Eye, FileText, Loader2 } from 'lucide-react';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';

export const DisbursementTable = () => {
  const { disbursements, loading, markAsDisbursed, uploadReceipt } = useGrantDisbursements();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Transform disbursements data for table display
  const disbursementData = disbursements.map(d => ({
    id: d.id,
    grantName: 'Sample Grant',
    organization: 'Sample Organization',
    totalGrant: d.amount,
    amountDisbursed: d.amount,
    dueDate: new Date(d.due_date).toLocaleDateString(),
    status: d.status === 'pending' && new Date(d.due_date) < new Date() ? 'Delayed' : 
            d.status === 'pending' ? 'Pending' : 'Released',
    isDisbursed: d.status === 'released',
    disbursedOn: d.disbursed_on,
    rawData: d
  }));

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

  const handleMarkAsDisbursed = (record: any) => {
    setSelectedRecord(record);
    setShowConfirmDialog(true);
  };

  const confirmMarkAsDisbursed = async () => {
    if (selectedRecord) {
      await markAsDisbursed(selectedRecord.rawData.id);
    }
    setShowConfirmDialog(false);
    setSelectedRecord(null);
  };

  const handleUploadReceipt = (record: any) => {
    setSelectedRecord(record);
    setShowUploadDialog(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const submitReceipt = async () => {
    if (selectedRecord && uploadedFile) {
      await uploadReceipt(selectedRecord.rawData.id, uploadedFile);
    }
    setShowUploadDialog(false);
    setSelectedRecord(null);
    setUploadedFile(null);
  };

  const handleViewReceipt = (record: any) => {
    toast({
      title: "Viewing Receipt",
      description: `Opening receipt for ${record.grantName}`,
    });
  };

  const getActionButtons = (item: any) => {
    if (!item.isDisbursed) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleMarkAsDisbursed(item)}
          className="text-xs"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Mark as Disbursed
        </Button>
      );
    }

    if (item.isDisbursed && !item.hasReceipt) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleUploadReceipt(item)}
          className="text-xs"
        >
          <Upload className="h-3 w-3 mr-1" />
          Upload Receipt
        </Button>
      );
    }

    if (item.hasReceipt) {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleViewReceipt(item)}
          className="text-xs"
        >
          <Eye className="h-3 w-3 mr-1" />
          View Receipt
        </Button>
      );
    }

    return null;
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
                {getActionButtons(item)}
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
                {getActionButtons(item)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading disbursement data...</span>
        </CardContent>
      </Card>
    );
  }

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
          </>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Disbursement</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark "{selectedRecord?.grantName}" as disbursed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMarkAsDisbursed}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Receipt Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Receipt</DialogTitle>
            <DialogDescription>
              Upload receipt for "{selectedRecord?.grantName}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="receipt-file">Select Receipt File</Label>
              <Input
                id="receipt-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="mt-1"
              />
            </div>
            {uploadedFile && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <FileText className="h-4 w-4" />
                <span>{uploadedFile.name}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitReceipt} disabled={!uploadedFile}>
              Upload Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};