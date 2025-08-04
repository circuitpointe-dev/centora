import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { complianceData } from '../data/complianceData';

interface NGOComplianceTableProps {
  grantId: number;
}

export const NGOComplianceTable = ({ grantId }: NGOComplianceTableProps) => {
  // Filter compliance data for this specific grant
  const grantCompliance = complianceData.filter(item => item.grantId === grantId);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compliance Requirements</h3>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requirement</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Evidence Document</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grantCompliance.map((requirement) => (
              <TableRow key={requirement.id}>
                <TableCell className="font-medium">{requirement.requirement}</TableCell>
                <TableCell>{new Date(requirement.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(requirement.status)}>
                    {requirement.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {requirement.evidenceDocument ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{requirement.evidenceDocument}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {requirement.status === 'Completed' ? (
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};