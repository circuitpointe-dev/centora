import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Eye
} from 'lucide-react';
import { useGrants } from '@/hooks/grants/useGrants';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';
import { useGrantReports } from '@/hooks/grants/useGrantReports';
import { Link } from 'react-router-dom';

export const GrantsOverviewPage = () => {
  const { grants, loading: grantsLoading } = useGrants();
  const { compliance, loading: complianceLoading } = useGrantCompliance();
  const { disbursements, loading: disbursementsLoading } = useGrantDisbursements();
  const { reports, loading: reportsLoading } = useGrantReports();

  const isLoading = grantsLoading || complianceLoading || disbursementsLoading || reportsLoading;

  // Calculate statistics
  const activeGrants = grants.filter(g => g.status === 'active').length;
  const totalValue = grants.reduce((sum, g) => sum + Number(g.amount), 0);
  const completedCompliance = compliance.filter(c => c.status === 'completed').length;
  const overdueCompliance = compliance.filter(c => c.status === 'overdue').length;
  const releasedDisbursements = disbursements.filter(d => d.status === 'released').length;
  const submittedReports = reports.filter(r => r.submitted).length;
  const overdueReports = reports.filter(r => r.status === 'overdue').length;

  // Recent activity
  const recentGrants = grants
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const upcomingDeadlines = [
    ...compliance
      .filter(c => c.status === 'in_progress')
      .map(c => ({ type: 'Compliance', name: c.requirement, date: c.due_date })),
    ...reports
      .filter(r => !r.submitted && r.status === 'upcoming')
      .map(r => ({ type: 'Report', name: r.report_type, date: r.due_date }))
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading grants overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grants Overview</h1>
          <p className="text-muted-foreground">
            Complete overview of your grants management activities
          </p>
        </div>
        <Link to="/dashboard/grants/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Grant
          </Button>
        </Link>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGrants}</div>
            <p className="text-xs text-muted-foreground">
              Total portfolio value: ${totalValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCompliance}</div>
            <p className="text-xs text-muted-foreground">
              {overdueCompliance > 0 && (
                <span className="text-red-600">{overdueCompliance} overdue</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disbursements</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{releasedDisbursements}</div>
            <p className="text-xs text-muted-foreground">
              Released milestones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedReports}</div>
            <p className="text-xs text-muted-foreground">
              {overdueReports > 0 && (
                <span className="text-red-600">{overdueReports} overdue</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Grants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Grants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentGrants.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No grants found</p>
            ) : (
              <div className="space-y-4">
                {recentGrants.map((grant) => (
                  <div key={grant.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{grant.grant_name}</p>
                      <p className="text-sm text-muted-foreground">{grant.donor_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={grant.status === 'active' ? 'default' : 'secondary'}>
                        {grant.status}
                      </Badge>
                      <Link to={`/dashboard/grants/view/${grant.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No upcoming deadlines</p>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{deadline.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {deadline.type} • Due {new Date(deadline.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {deadline.type === 'Compliance' && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                      {deadline.type === 'Report' && (
                        <FileText className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/dashboard/grants/compliance-checklist">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Compliance Checklist
              </Button>
            </Link>
            <Link to="/dashboard/grants/disbursement-schedule">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Disbursement Schedule
              </Button>
            </Link>
            <Link to="/dashboard/grants/reports-submissions">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Reports & Submissions
              </Button>
            </Link>
            <Link to="/dashboard/grants/profile">
              <Button variant="outline" className="w-full justify-start">
                <Award className="h-4 w-4 mr-2" />
                Grant Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};