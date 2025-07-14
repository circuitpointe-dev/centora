import React, { useState } from 'react';
import { ArrowLeft, User, Check, Clock, X, ExternalLink, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CustomReportPageProps {
  onBack: () => void;
}

export const CustomReportPage = ({ onBack }: CustomReportPageProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');

  const metrics = [
    { id: 'acknowledgement', label: 'Acknowledgement Report' },
    { id: 'expired', label: 'Expired Policies Report' },
    { id: 'compliance', label: 'User Compliance Summary' },
    { id: 'audit', label: 'Audit Log Report' }
  ];

  const handleMetricChange = (metricId: string, checked: boolean) => {
    if (checked) {
      setSelectedMetrics([...selectedMetrics, metricId]);
    } else {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    }
  };

  const getReportContent = () => {
    if (selectedMetrics.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Select Metrics . . .
        </div>
      );
    }

    // Generate dynamic mock data based on selected metrics and date range
    const generateMockData = () => {
      const currentDate = new Date();
      const dateRangeMultiplier = startDate && endDate ? 
        Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) / 30 : 1;
      
      const hasAcknowledgement = selectedMetrics.includes('acknowledgement');
      const hasExpired = selectedMetrics.includes('expired');
      const hasCompliance = selectedMetrics.includes('compliance');
      const hasAudit = selectedMetrics.includes('audit');

      // Base values that change based on metrics and date range
      const baseAssigned = Math.floor(25 + (dateRangeMultiplier * 10));
      const baseAcknowledged = Math.floor(baseAssigned * (hasAcknowledgement ? 0.75 : 0.45));
      const baseExpired = Math.floor(hasExpired ? (dateRangeMultiplier * 8) : 3);
      const acknowledgementRate = Math.floor((baseAcknowledged / baseAssigned) * 100);

      const statCards = [];
      
      if (hasAcknowledgement || hasCompliance) {
        statCards.push({
          title: "Total Policies Assigned",
          value: baseAssigned.toString(),
          icon: User,
          iconBgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          shadowColor: "shadow-blue-100/40",
        });
        
        statCards.push({
          title: "Total Acknowledges",
          value: baseAcknowledged.toString(),
          icon: Check,
          iconBgColor: "bg-green-100",
          iconColor: "text-green-600",
          shadowColor: "shadow-green-100/40",
        });
        
        statCards.push({
          title: "Acknowledgement Rate",
          value: `${acknowledgementRate}%`,
          icon: Clock,
          iconBgColor: "bg-yellow-100",
          iconColor: "text-yellow-600",
          shadowColor: "shadow-yellow-100/40",
        });
      }

      if (hasExpired) {
        statCards.push({
          title: "Policies Expired",
          value: baseExpired.toString(),
          icon: X,
          iconBgColor: "bg-red-100",
          iconColor: "text-red-600",
          shadowColor: "shadow-red-100/40",
        });
      }

      // Chart data varies by compliance metric
      const chartData = hasCompliance ? [
        { team: "Engineering", rate: Math.floor(75 + (dateRangeMultiplier * 5)) },
        { team: "Marketing", rate: Math.floor(62 + (dateRangeMultiplier * 8)) },
        { team: "Sales", rate: Math.floor(68 + (dateRangeMultiplier * 6)) },
        { team: "HR", rate: Math.floor(82 + (dateRangeMultiplier * 4)) },
        { team: "Finance", rate: Math.floor(58 + (dateRangeMultiplier * 7)) }
      ] : [];

      // Pending items data for acknowledgement reports
      const pendingItemsData = hasAcknowledgement ? [
        { userName: "John Smith", department: "Engineering", pending: Math.floor(2 + dateRangeMultiplier), dueDate: "2024-01-15" },
        { userName: "Sarah Wilson", department: "Marketing", pending: Math.floor(1 + dateRangeMultiplier), dueDate: "2024-01-18" },
        { userName: "Mike Johnson", department: "Sales", pending: Math.floor(3 + dateRangeMultiplier), dueDate: "2024-01-12" },
        { userName: "Emily Davis", department: "HR", pending: Math.floor(1 + (dateRangeMultiplier * 0.5)), dueDate: "2024-01-20" },
        { userName: "Robert Brown", department: "Finance", pending: Math.floor(2 + dateRangeMultiplier), dueDate: "2024-01-16" }
      ] : [];

      // Expired policies data
      const expiredPoliciesData = hasExpired ? [
        { policyName: "Data Protection Policy", expiredDate: "2024-01-01", status: "Expired" },
        { policyName: "Security Guidelines", expiredDate: "2023-12-28", status: "Expired" },
        { policyName: "Code of Conduct", expiredDate: "2024-01-03", status: "Expired" },
        ...(dateRangeMultiplier > 1 ? [
          { policyName: "Remote Work Policy", expiredDate: "2023-12-30", status: "Expired" },
          { policyName: "IT Security Policy", expiredDate: "2024-01-05", status: "Expired" }
        ] : [])
      ] : [];

      // Audit history data
      const auditHistoryData = hasAudit ? [
        { dateTime: "2024-01-08 10:30", user: "Admin", action: "Policy Updated", policy: "Data Protection Policy", status: "Completed" },
        { dateTime: "2024-01-07 14:20", user: "John Smith", action: "Acknowledged", policy: "Security Guidelines", status: "Completed" },
        { dateTime: "2024-01-07 09:15", user: "Sarah Wilson", action: "Policy Viewed", policy: "Code of Conduct", status: "Completed" },
        ...(dateRangeMultiplier > 1 ? [
          { dateTime: "2024-01-06 16:45", user: "Admin", action: "Policy Created", policy: "Remote Work Policy", status: "Completed" },
          { dateTime: "2024-01-06 11:30", user: "Mike Johnson", action: "Acknowledged", policy: "IT Security Policy", status: "Completed" },
          { dateTime: "2024-01-05 14:15", user: "Emily Davis", action: "Policy Reviewed", policy: "HR Guidelines", status: "Completed" }
        ] : [])
      ] : [];

      return { statCards, chartData, pendingItemsData, expiredPoliciesData, auditHistoryData };
    };

    const { statCards, chartData, pendingItemsData, expiredPoliciesData, auditHistoryData } = generateMockData();

    const maxRate = chartData.length > 0 ? Math.max(...chartData.map(d => d.rate)) : 100;

    return (
      <div className="space-y-6">
        {/* Header with Download Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Generated Report</span>
            {startDate && endDate && (
              <span>({startDate} to {endDate})</span>
            )}
          </div>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Stat Cards */}
        {statCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card
                  key={index}
                  className={`
                    bg-white h-32 
                    shadow-md ${card.shadowColor} 
                    transition-all duration-300 ease-in-out 
                    hover:shadow-lg hover:${card.shadowColor.replace("/40", "/60")} 
                    hover:-translate-y-1
                    border-0
                  `}
                >
                  <CardContent className="p-4 h-full">
                    <div className="flex flex-col items-center justify-center text-center h-full space-y-2">
                      <div
                        className={`p-2 rounded-full ${card.iconBgColor} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className={`h-5 w-5 ${card.iconColor}`} />
                      </div>
                      <p className="text-xl font-semibold text-gray-900">
                        {card.value}
                      </p>
                      <p className="text-xs text-gray-600">{card.title}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Bar Chart */}
        {chartData.length > 0 && (
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Policy Acknowledgement Rates by Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-gray-600 text-right">
                      {item.team}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                      <div
                        className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.rate / maxRate) * 100}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {item.rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Two Tables Row */}
        {(pendingItemsData.length > 0 || expiredPoliciesData.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Users with Most Pending Items */}
            {pendingItemsData.length > 0 && (
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Users with Most Pending Items
                  </CardTitle>
                  <Button variant="link" className="text-violet-600 hover:text-violet-700 p-0 text-sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">User Name</TableHead>
                        <TableHead className="text-xs">Department</TableHead>
                        <TableHead className="text-xs">Pending</TableHead>
                        <TableHead className="text-xs">Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingItemsData.slice(0, 3).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-sm">{item.userName}</TableCell>
                          <TableCell className="text-sm">{item.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                              {item.pending}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{item.dueDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Expired Policies */}
            {expiredPoliciesData.length > 0 && (
              <Card className="bg-white border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Expired Policies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Policy Name</TableHead>
                        <TableHead className="text-xs">Expired Date</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiredPoliciesData.slice(0, 3).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-sm">{item.policyName}</TableCell>
                          <TableCell className="text-sm">{item.expiredDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Audit History */}
        {auditHistoryData.length > 0 && (
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900">
                Audit History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Date & Time</TableHead>
                    <TableHead className="text-xs">User</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                    <TableHead className="text-xs">Policy</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditHistoryData.slice(0, 3).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{item.dateTime}</TableCell>
                      <TableCell className="text-sm">{item.user}</TableCell>
                      <TableCell className="text-sm">{item.action}</TableCell>
                      <TableCell className="text-sm">{item.policy}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Compliance Reports
      </Button>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
        {/* Metrics Selection Column */}
        <Card className="lg:col-span-1 bg-white border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Select Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metrics Checkboxes */}
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={(checked) => 
                      handleMetricChange(metric.id, checked as boolean)
                    }
                    className="border-gray-300"
                  />
                  <Label
                    htmlFor={metric.id}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {metric.label}
                  </Label>
                </div>
              ))}
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Date Range</Label>
              
              <div className="space-y-2">
                <div>
                  <Label htmlFor="startDate" className="text-xs text-gray-600">
                    Start Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="endDate" className="text-xs text-gray-600">
                    End Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Report Format */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Report Format</Label>
              <RadioGroup value={reportFormat} onValueChange={setReportFormat}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="text-sm text-gray-700">PDF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="text-sm text-gray-700">CSV</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Report Column */}
        <Card className="lg:col-span-4 bg-white border border-gray-200 max-h-[calc(100vh-200px)] overflow-auto">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Report Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getReportContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};