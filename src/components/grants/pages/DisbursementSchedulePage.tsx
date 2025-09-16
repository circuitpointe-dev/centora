import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';

export const DisbursementSchedulePage = () => {
  const { disbursements, loading, createDisbursement } = useGrantDisbursements();
  const [isCreating, setIsCreating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'released':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <Clock className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const totalAmount = disbursements.reduce((sum, d) => sum + Number(d.amount), 0);
  const releasedAmount = disbursements
    .filter(d => d.status === 'released')
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const pendingAmount = disbursements
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const handleCreateDisbursement = async () => {
    setIsCreating(true);
    try {
      // This would normally open a dialog for creating a new disbursement
      console.log('Create disbursement functionality');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading disbursements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Disbursement Schedule</h1>
          <p className="text-muted-foreground">
            Track grant funding disbursements and payment schedules
          </p>
        </div>
        <Button onClick={handleCreateDisbursement} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Disbursement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Released</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${releasedAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursements</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disbursements.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disbursement Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {disbursements.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Disbursements Scheduled</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first disbursement milestone
              </p>
              <Button onClick={handleCreateDisbursement}>
                <Plus className="h-4 w-4 mr-2" />
                Add Disbursement
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Disbursed On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disbursements.map((disbursement) => (
                    <TableRow key={disbursement.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(disbursement.status)}
                          <span className="font-medium">{disbursement.milestone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${Number(disbursement.amount).toLocaleString()} {disbursement.currency}
                      </TableCell>
                      <TableCell>{new Date(disbursement.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {disbursement.disbursed_on 
                          ? new Date(disbursement.disbursed_on).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(disbursement.status)}>
                          {disbursement.status.charAt(0).toUpperCase() + disbursement.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};