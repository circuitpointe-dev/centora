import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, User, Check, Clock, X, ExternalLink, BarChart3, Users, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { usePolicyStats, usePolicyAcknowledgments } from '@/hooks/usePolicyDocuments';

interface GeneratedReportPageProps {
  onBack: () => void;
}

export const GeneratedReportPage = ({ onBack }: GeneratedReportPageProps) => {
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Fetch real data from backend
  const { data: stats, isLoading: statsLoading } = usePolicyStats();
  const { data: acknowledgments, isLoading: acknowledgementsLoading } = usePolicyAcknowledgments();

  // Generate chart data from real acknowledgments
  const chartData = React.useMemo(() => {
    if (!acknowledgments) return [];
    
    const teamStats = acknowledgments.reduce((acc, ack) => {
      const department = ack.user?.department || 'Unassigned';
      if (!acc[department]) {
        acc[department] = { acknowledged: 0, total: 0 };
      }
      acc[department].acknowledged += 1;
      acc[department].total += 1;
      return acc;
    }, {} as Record<string, { acknowledged: number; total: number }>);

    return Object.entries(teamStats).map(([team, data]) => ({
      team,
      rate: Math.round((data.acknowledged / Math.max(data.total, 1)) * 100)
    }));
  }, [acknowledgments]);

  // Generate pending items from real data
  const pendingItemsData = React.useMemo(() => {
    if (!acknowledgments) return [];
    
    return acknowledgments
      .filter(ack => !ack.acknowledged_at)
      .slice(0, 5)
      .map(ack => ({
        userName: ack.user?.full_name || 'Unknown User',
        department: ack.user?.department || 'Unknown',
        pending: 1,
        dueDate: ack.policy_document?.expires_date || new Date().toISOString().split('T')[0]
      }));
  }, [acknowledgments]);

  // Generate expired policies data
  const expiredPoliciesData = React.useMemo(() => {
    if (!acknowledgments) return [];
    
    const now = new Date();
    return acknowledgments
      .filter(ack => {
        const expiryDate = ack.policy_document?.expires_date ? new Date(ack.policy_document.expires_date) : null;
        return expiryDate && expiryDate < now;
      })
      .slice(0, 5)
      .map(ack => ({
        policyName: ack.policy_document?.title || 'Unknown Policy',
        expiredDate: ack.policy_document?.expires_date || '',
        status: 'Expired' as const
      }));
  }, [acknowledgments]);

  // Generate audit history from acknowledgments
  const auditHistoryData = React.useMemo(() => {
    if (!acknowledgments) return [];
    
    return acknowledgments
      .slice(0, 5)
      .map(ack => ({
        action: 'Policy Acknowledged',
        user: ack.user?.full_name || 'Unknown User',
        timestamp: ack.acknowledged_at,
        details: `Acknowledged ${ack.policy_document?.title || 'policy'}`
      }));
  }, [acknowledgments]);

  const statCards = [
    {
      title: "Total Policies Assigned",
      value: acknowledgments?.length.toString() || "0",
      icon: User,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      shadowColor: "shadow-blue-100/40",
    },
    {
      title: "Total Acknowledges",
      value: stats?.acknowledged.toString() || "0",
      icon: Check,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      shadowColor: "shadow-green-100/40",
    },
    {
      title: "Acknowledgement Rate",
      value: stats ? `${Math.round((stats.acknowledged / Math.max(stats.totalEmployees, 1)) * 100)}%` : "0%",
      icon: TrendingUp,
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      shadowColor: "shadow-yellow-100/40",
    },
    {
      title: "Policies Expired",
      value: expiredPoliciesData.length.toString(),
      icon: X,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      shadowColor: "shadow-red-100/40",
    },
  ];

  if (statsLoading || acknowledgementsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Report</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Team/Department</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Teams">All Teams</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Timeframe</Label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                  <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                  <SelectItem value="This Year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Policy Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  <SelectItem value="HR Policies">HR Policies</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={index} className={`${card.shadowColor} shadow-lg border-0`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.iconBgColor} p-3 rounded-full`}>
                    <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acknowledgment Rate by Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Acknowledgment Rate by Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis />
                  <Bar dataKey="rate" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Acknowledgments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingItemsData.length > 0 ? (
                pendingItemsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.userName}</p>
                      <p className="text-sm text-gray-600">{item.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.pending} pending</p>
                      <p className="text-sm text-red-600">Due: {item.dueDate}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No pending acknowledgments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expired Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Expired Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Expired Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiredPoliciesData.length > 0 ? (
                  expiredPoliciesData.map((policy, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{policy.policyName}</TableCell>
                      <TableCell>{policy.expiredDate}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{policy.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No expired policies
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Audit History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditHistoryData.length > 0 ? (
                auditHistoryData.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};