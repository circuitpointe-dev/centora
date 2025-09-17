import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useGrants } from '@/hooks/grants/useGrants';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';
import { useGrantDisbursements } from '@/hooks/grants/useGrantDisbursements';
import { useGrantReports } from '@/hooks/grants/useGrantReports';
import { Link } from 'react-router-dom';

export const GrantsManagerDashboard = () => {
  const { grants, loading: grantsLoading } = useGrants();
  const { compliance, loading: complianceLoading } = useGrantCompliance();
  const { disbursements, loading: disbursementsLoading } = useGrantDisbursements();
  const { reports, loading: reportsLoading } = useGrantReports();

  const isLoading = grantsLoading || complianceLoading || disbursementsLoading || reportsLoading;

  // Calculate key metrics
  const activeGrants = grants.filter(g => g.status === 'active').length;
  const totalPortfolioValue = grants.reduce((sum, g) => sum + Number(g.amount), 0);
  const complianceRate = compliance.length > 0 ? 
    (compliance.filter(c => c.status === 'completed').length / compliance.length) * 100 : 0;
  const overdueItems = [
    ...compliance.filter(c => c.status === 'overdue'),
    ...reports.filter(r => r.status === 'overdue')
  ].length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grants Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage your entire grants portfolio
          </p>
        </div>
        <Link to="/dashboard/grants/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Grant
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeGrants}</div>
            <p className="text-xs text-muted-foreground">
              +{grants.filter(g => g.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalPortfolioValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total active grants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{Math.round(complianceRate)}%</div>
            <p className="text-xs text-muted-foreground">
              Requirements completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueItems}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/dashboard/grants/compliance-checklist">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Compliance</h3>
                  <p className="text-sm text-muted-foreground">Track requirements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/grants/disbursement-schedule">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Disbursements</h3>
                  <p className="text-sm text-muted-foreground">Payment schedules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/grants/reports-submissions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Reports</h3>
                  <p className="text-sm text-muted-foreground">Submission tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/grants/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Profile</h3>
                  <p className="text-sm text-muted-foreground">Manage settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Grants */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Grants</CardTitle>
              <Link to="/dashboard/grants">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {grants.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No grants found</p>
            ) : (
              <div className="space-y-3">
                {grants.slice(0, 5).map((grant) => (
                  <div key={grant.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
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
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Compliance Deadlines */}
              {compliance
                .filter(c => c.status === 'in_progress')
                .slice(0, 3)
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.requirement}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(item.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              
              {/* Report Deadlines */}
              {reports
                .filter(r => !r.submitted && r.status === 'upcoming')
                .slice(0, 2)
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-orange-50">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.report_type}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(item.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}

              {compliance.filter(c => c.status === 'in_progress').length === 0 && 
               reports.filter(r => !r.submitted && r.status === 'upcoming').length === 0 && (
                <p className="text-muted-foreground text-center py-4">No upcoming deadlines</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};