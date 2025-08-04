import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface NGODisbursementTableProps {
  grantId: number;
}

interface Disbursement {
  id: number;
  installment: string;
  amount: string;
  scheduledDate: string;
  actualDate?: string;
  status: 'Received' | 'Pending' | 'Delayed';
  conditions?: string;
}

export const NGODisbursementTable = ({ grantId }: NGODisbursementTableProps) => {
  // Mock data - in real app, this would be fetched based on grantId
  const disbursements: Disbursement[] = [
    {
      id: 1,
      installment: "Initial Payment (30%)",
      amount: "$15,000",
      scheduledDate: "2025-01-15",
      actualDate: "2025-01-15",
      status: "Received",
      conditions: "Grant agreement signed"
    },
    {
      id: 2,
      installment: "Second Payment (40%)",
      amount: "$20,000",
      scheduledDate: "2025-06-30",
      actualDate: "2025-06-28",
      status: "Received",
      conditions: "Q1 & Q2 reports submitted"
    },
    {
      id: 3,
      installment: "Final Payment (30%)",
      amount: "$15,000",
      scheduledDate: "2025-12-31",
      status: "Pending",
      conditions: "Final report and compliance requirements met"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                <TableCell className="font-medium">{disbursement.installment}</TableCell>
                <TableCell className="font-semibold text-green-600">{disbursement.amount}</TableCell>
                <TableCell>{new Date(disbursement.scheduledDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {disbursement.actualDate 
                    ? new Date(disbursement.actualDate).toLocaleDateString()
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(disbursement.status)}>
                    {disbursement.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <span className="text-sm text-muted-foreground">
                    {disbursement.conditions}
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