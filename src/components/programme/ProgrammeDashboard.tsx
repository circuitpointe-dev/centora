import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock,
  AlertTriangle,
  Download,
  Search,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { ProgrammeStatsCards } from './ProgrammeStatsCards';
import { ProgrammeProjectHealthChart } from './ProgrammeProjectHealthChart';
import { ProgrammeBudgetUtilizationChart } from './ProgrammeBudgetUtilizationChart';


const financialAllocationData = [
  { name: 'Project A', value: 350 },
  { name: 'Project B', value: 280 },
  { name: 'Project C', value: 380 },
  { name: 'Project D', value: 150 },
];

const upcomingMilestones = [
  { title: 'Project Review', status: 'On Track', date: 'Apr 15', project: 'Educative Initiative', color: 'bg-green-500' },
  { title: 'Budget Approval', status: 'At Risk', date: 'Apr 15', project: 'Educative Initiative', color: 'bg-yellow-500' },
  { title: 'Team Meeting', status: 'At Risk', date: 'Apr 16', project: 'Educative Initiative', color: 'bg-yellow-500' },
  { title: 'Report Submission Meeting', status: 'Delayed', date: 'Apr 10', project: 'Educative Initiative', color: 'bg-red-500' },
];

const risksAndAlerts = [
  { priority: 'High Priority', description: 'Budget overrun detected in Project X', color: 'text-red-600' },
  { priority: 'Medium Priority', description: 'Budget overrun detected in Project X', color: 'text-yellow-600' },
  { priority: 'Low Priority', description: 'Budget overrun detected in Project X', color: 'text-green-600' },
];

const pendingActions = [
  { action: 'Review Project Proposal', dueDate: 'Due: Today', assignee: 'John Doe' },
  { action: 'Approve Budget Request', dueDate: 'Due: June 10', assignee: 'John Doe' },
  { action: 'Update Risk Assessment', dueDate: 'Due: June 16', assignee: 'John Doe' },
];

const ProgrammeDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Programme Management Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects, products, reports..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <ProgrammeStatsCards />

      {/* Project Health and Budget Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgrammeProjectHealthChart />
        <ProgrammeBudgetUtilizationChart />
      </div>

        {/* Financial Allocation */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Financial Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialAllocationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 400]} tickCount={9} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" style={{ filter: 'none' }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upcomingMilestones.map((milestone, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${milestone.color}`}></div>
                    <span className="text-xs text-gray-500">{milestone.status}</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{milestone.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{milestone.project}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {milestone.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risks & Alerts and Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Top Risks & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {risksAndAlerts.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className={`h-4 w-4 mt-0.5 ${risk.color}`} />
                    <div>
                      <p className={`text-sm font-medium ${risk.color}`}>{risk.priority}</p>
                      <p className="text-sm text-gray-600">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingActions.map((action, index) => (
                  <div key={index} className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 mt-0.5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{action.action}</p>
                        <p className="text-xs text-gray-500">{action.dueDate}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600">{action.assignee}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default ProgrammeDashboard;