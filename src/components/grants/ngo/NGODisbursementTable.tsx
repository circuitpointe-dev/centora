import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';

interface NGODisbursementTableProps {
  grantId: string;
}

export const NGODisbursementTable = ({ grantId }: NGODisbursementTableProps) => {
  const { disbursements, loading } = useGrantDisbursements(grantId);

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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Disbursement Schedule</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading disbursements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Disbursement Schedule</h3>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Installment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Actual Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Conditions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disbursements.map((disbursement) => (
              <TableRow key={disbursement.id}>
                <TableCell className="font-medium">{disbursement.milestone}</TableCell>
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
                <TableCell className="max-w-xs">
                  <span className="text-sm text-muted-foreground">
                    {disbursement.milestone}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};