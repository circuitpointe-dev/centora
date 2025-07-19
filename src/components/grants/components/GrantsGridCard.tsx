import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Edit } from 'lucide-react';
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

interface GrantsGridCardProps {
  grant: Grant;
}

export const GrantsGridCard: React.FC<GrantsGridCardProps> = ({ grant }) => {
  const navigate = useNavigate();
  
  const handleView = () => {
    navigate(`/dashboard/grants/view/${grant.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Grant Name */}
        <div>
          <h3 className="font-medium text-foreground mb-1">Grant name</h3>
          <p className="text-sm text-muted-foreground">{grant.grantName}</p>
        </div>

        {/* Organization */}
        <div>
          <h3 className="font-medium text-foreground mb-1">Organization</h3>
          <p className="text-sm text-muted-foreground text-right">{grant.organization}</p>
        </div>

        {/* Compliance */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-foreground">Compliance</h3>
            <span className="text-sm text-muted-foreground">{grant.compliance}%</span>
          </div>
          <Progress value={grant.compliance} className="h-2" />
        </div>

        {/* Disbursement */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-foreground">Disbursement</h3>
            <span className="text-sm text-muted-foreground">{grant.disbursement}%</span>
          </div>
          <Progress value={grant.disbursement} className="h-2" />
        </div>

        {/* Reporting Status */}
        <div>
          <h3 className="font-medium text-foreground mb-1">Reporting Status</h3>
          <p className="text-sm text-muted-foreground">{grant.reportingStatus}</p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">Status</h3>
          <Badge 
            variant="secondary" 
            className={`${getStatusColor(grant.status)} text-black border-0`}
          >
            {grant.status}
          </Badge>
        </div>

        {/* Actions */}
        <div>
          <h3 className="font-medium text-foreground mb-2">Action</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleView}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};