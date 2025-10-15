import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  UserPlus,
  FileText,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ArrowDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const HRDashboard = () => {
  // Mock data for charts
  const headcountData = [
    { month: 'Jan', value: 240 },
    { month: 'Feb', value: 245 },
    { month: 'Mar', value: 250 },
    { month: 'Apr', value: 256 },
  ];

  const attritionData = [
    { reason: 'Voluntary', jan: 2, feb: 3, mar: 1, apr: 2 },
    { reason: 'Involuntary', jan: 1, feb: 1, mar: 2, apr: 1 },
    { reason: 'Other', jan: 0, feb: 1, mar: 0, apr: 1 },
  ];

  const recruitingFunnelData = [
    { stage: 'Applied', value: 80 },
    { stage: 'Screen', value: 50 },
    { stage: 'Interview', value: 25 },
    { stage: 'Offer', value: 5 },
  ];

  const trainingData = [
    { name: 'Acknowledged', value: 35, color: '#10B981' },
    { name: 'Pending', value: 10, color: '#F59E0B' },
  ];

  const COLORS = ['#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Headcount */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">256</div>
            <div className="text-sm text-violet-600">(+4%)</div>
            <div className="text-sm text-gray-600">Headcount</div>
          </CardContent>
        </Card>

        {/* New hires */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">New hires</div>
          </CardContent>
        </Card>

        {/* Attrition */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ArrowDown className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">9.4%</div>
            <div className="text-sm text-violet-600">(-0.2%)</div>
            <div className="text-sm text-gray-600">Attrition (TTM)</div>
          </CardContent>
        </Card>

        {/* Open reqs */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">18</div>
            <div className="text-sm text-gray-600">Open reqs</div>
          </CardContent>
        </Card>

        {/* Policy Ack rate */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">88%</div>
            <div className="text-sm text-gray-600">Policy Ack rate</div>
          </CardContent>
        </Card>

        {/* Expiring docs */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">14</div>
            <div className="text-sm text-gray-600">Expiring docs</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Headcount trend (12 month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={headcountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 40]} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attrition by Reason */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Attrition by reason</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attritionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="reason" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jan" fill="#7C3AED" name="Jan" />
                <Bar dataKey="feb" fill="#7C3AED" name="Feb" />
                <Bar dataKey="mar" fill="#7C3AED" name="Mar" />
                <Bar dataKey="apr" fill="#7C3AED" name="Apr" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recruiting Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recruiting funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recruitingFunnelData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-violet-600 h-2 rounded-full" 
                        style={{ width: `${(item.value / 80) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Training completion by org unit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={trainingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trainingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Acknowledged</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Action center</CardTitle>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Auto refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Approvals */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Approvals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Leave requests</p>
                  </div>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                    Approve
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Offers</p>
                  </div>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                    Approve
                  </Button>
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Compliance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Expiring documents</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Notify
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Overdue policies</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Escalate
                  </Button>
                </div>
              </div>
            </div>

            {/* Upcoming */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Upcoming</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quarter hiring review</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Plan
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Training refresh for sales</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Assign
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRDashboard;
