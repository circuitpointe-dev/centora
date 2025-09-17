
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getReportingStatusColor } from '../utils/statusUtils';
import { GrantWithStats } from '@/hooks/grants/useGrantsWithStats';

interface ActiveGrantsTableRowProps {
  grant: GrantWithStats;
}

export const ActiveGrantsTableRow = ({ grant }: ActiveGrantsTableRowProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    console.log('Viewing grant:', grant.id, grant);
    navigate(`/dashboard/grants/view/${grant.id}`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{grant.grant_name}</TableCell>
      <TableCell>{grant.donor_name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${grant.compliance_rate}%` }}
            />
          </div>
          <span className="text-sm">{grant.compliance_rate}%</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${grant.disbursement_rate}%` }}
            />
          </div>
          <span className="text-sm">{grant.disbursement_rate}%</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={`${getReportingStatusColor(grant.reporting_status)} rounded-sm hover:${getReportingStatusColor(grant.reporting_status)}`}>
          {grant.reporting_status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleView}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
