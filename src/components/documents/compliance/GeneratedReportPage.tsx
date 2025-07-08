import React from 'react';
import { ArrowLeft, Download, User, Check, Clock, X, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface GeneratedReportPageProps {
  onBack: () => void;
}

export const GeneratedReportPage = ({ onBack }: GeneratedReportPageProps) => {
  const statCards = [
    {
      title: "Total Policies Assigned",
      value: "34",
      icon: User,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      shadowColor: "shadow-blue-100/40",
    },
    {
      title: "Total Acknowledges",
      value: "180",
      icon: Check,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      shadowColor: "shadow-green-100/40",
    },
    {
      title: "Acknowledgement Rate",
      value: "45%",
      icon: Clock,
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      shadowColor: "shadow-yellow-100/40",
    },
    {
      title: "Policies Expired",
      value: "6",
      icon: X,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      shadowColor: "shadow-red-100/40",
    },
  ];

  // Mock data for bar chart
  const chartData = [
    { team: "Engineering", rate: 85 },
    { team: "Marketing", rate: 72 },
    { team: "Sales", rate: 78 },
    { team: "HR", rate: 92 },
    { team: "Finance", rate: 68 }
  ];

  // Mock data for pending items
  const pendingItemsData = [
    { userName: "John Smith", department: "Engineering", pending: 3, dueDate: "2024-01-15" },
    { userName: "Sarah Wilson", department: "Marketing", pending: 2, dueDate: "2024-01-18" },
    { userName: "Mike Johnson", department: "Sales", pending: 4, dueDate: "2024-01-12" },
    { userName: "Emily Davis", department: "HR", pending: 1, dueDate: "2024-01-20" },
    { userName: "Robert Brown", department: "Finance", pending: 3, dueDate: "2024-01-16" }
  ];

  // Mock data for expired policies
  const expiredPoliciesData = [
    { policyName: "Data Protection Policy", expiredDate: "2024-01-01", status: "Expired" },
    { policyName: "Security Guidelines", expiredDate: "2023-12-28", status: "Expired" },
    { policyName: "Code of Conduct", expiredDate: "2024-01-03", status: "Expired" },
    { policyName: "Remote Work Policy", expiredDate: "2023-12-30", status: "Expired" },
    { policyName: "IT Security Policy", expiredDate: "2024-01-05", status: "Expired" }
  ];

  // Mock data for audit history
  const auditHistoryData = [
    { dateTime: "2024-01-08 10:30", user: "Admin", action: "Policy Updated", policy: "Data Protection Policy", status: "Completed", actionType: "Download" },
    { dateTime: "2024-01-07 14:20", user: "John Smith", action: "Acknowledged", policy: "Security Guidelines", status: "Completed", actionType: "Download" },
    { dateTime: "2024-01-07 09:15", user: "Sarah Wilson", action: "Policy Viewed", policy: "Code of Conduct", status: "Completed", actionType: "Download" },
    { dateTime: "2024-01-06 16:45", user: "Admin", action: "Policy Created", policy: "Remote Work Policy", status: "Completed", actionType: "Download" },
    { dateTime: "2024-01-06 11:30", user: "Mike Johnson", action: "Acknowledged", policy: "IT Security Policy", status: "Completed", actionType: "Download" }
  ];

  const maxRate = Math.max(...chartData.map(d => d.rate));

  return (
    <div className="space-y-6">
      {/* Header with Back Button and Download */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Compliance Reports
        </Button>
        
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              className={`
                bg-white h-40 
                shadow-md ${card.shadowColor} 
                transition-all duration-300 ease-in-out 
                hover:shadow-lg hover:${card.shadowColor.replace("/40", "/60")} 
                hover:-translate-y-1
                border-0
              `}
            >
              <CardContent className="p-6 h-full">
                <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                  <div
                    className={`p-3 rounded-full ${card.iconBgColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-600">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bar Chart */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Policy Acknowledgement Rates by Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-600 text-right">
                  {item.team}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative">
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

      {/* Two Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users with Most Pending Items */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Users with Most Pending Items
            </CardTitle>
            <Button variant="link" className="text-violet-600 hover:text-violet-700 p-0">
              <ExternalLink className="w-4 h-4 mr-1" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingItemsData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.userName}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        {item.pending}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Expired Policies */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
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
                {expiredPoliciesData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.policyName}</TableCell>
                    <TableCell>{item.expiredDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Audit History */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Audit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Policy</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditHistoryData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.dateTime}</TableCell>
                  <TableCell>{item.user}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>{item.policy}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};