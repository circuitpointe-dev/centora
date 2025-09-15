import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, DollarSign, Calendar, FileText } from 'lucide-react';

interface NGOGrantStatsCardsProps {
  grantId: string;
}

export const GrantStatsCards = ({ grantId }: NGOGrantStatsCardsProps) => {
  // Mock data - in real app, this would come from props or API
  const stats = {
    compliance: 85,
    fundsReceived: '$45,000',
    nextReport: 'Sep 30, 2025',
    totalReports: 3
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Compliance */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Compliance Status</p>
              <p className="text-2xl font-bold text-green-600">{stats.compliance}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Funds Received */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Funds Received</p>
              <p className="text-2xl font-bold text-green-600">{stats.fundsReceived}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Next Report Due */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Report Due</p>
              <p className="text-2xl font-bold text-orange-600">{stats.nextReport}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      {/* Total Reports Submitted */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reports Submitted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalReports}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};