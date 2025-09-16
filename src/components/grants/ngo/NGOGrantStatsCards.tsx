import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, DollarSign, Calendar, FileText } from 'lucide-react';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';
import { useGrantReports } from '@/hooks/grants/useGrantReports';

interface NGOGrantStatsCardsProps {
  grantId: string;
}

export const GrantStatsCards = ({ grantId }: NGOGrantStatsCardsProps) => {
  const { compliance } = useGrantCompliance(grantId);
  const { disbursements } = useGrantDisbursements(grantId);
  const { reports } = useGrantReports(grantId);

  // Calculate stats from real data
  const completedCompliance = compliance.filter(c => c.status === 'completed').length;
  const complianceRate = compliance.length > 0 ? Math.round((completedCompliance / compliance.length) * 100) : 0;
  
  const releasedAmount = disbursements
    .filter(d => d.status === 'released')
    .reduce((sum, d) => sum + Number(d.amount), 0);
  
  const nextReport = reports
    .filter(r => !r.submitted && r.status === 'upcoming')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
  
  const submittedReports = reports.filter(r => r.submitted).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Compliance */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Compliance Status</p>
              <p className="text-2xl font-bold text-green-600">{complianceRate}%</p>
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
              <p className="text-2xl font-bold text-green-600">${releasedAmount.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-orange-600">
                {nextReport ? new Date(nextReport.due_date).toLocaleDateString() : 'No upcoming reports'}
              </p>
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
              <p className="text-2xl font-bold text-blue-600">{submittedReports}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};