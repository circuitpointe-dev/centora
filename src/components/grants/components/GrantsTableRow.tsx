
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, getReportingStatusColor } from '../utils/statusUtils';

interface Grant {
  id: number;
  grantName: string;
  organization: string;
  status: string;
  compliance: number;
  disbursement: number;
  reportingStatus: string;
  region: string;
  year: string;
}

interface GrantsTableRowProps {
  grant: Grant;
}

export const GrantsTableRow = ({ grant }: GrantsTableRowProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/grants/view/${grant.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/grants/view/${grant.id}?edit=true`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{grant.grantName}</TableCell>
      <TableCell>{grant.organization}</TableCell>
      <TableCell>
        <Badge className={`${getStatusColor(grant.status)} rounded-sm hover:${getStatusColor(grant.status)}`}>
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
        <Badge className={`${getReportingStatusColor(grant.reportingStatus)} rounded-sm hover:${getReportingStatusColor(grant.reportingStatus)}`}>
          {grant.reportingStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleView}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
