import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Plus,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import ExitDetailView from './ExitDetailView';
import ExitInterviewLog from './ExitInterviewLog';

const Exits = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('exit-feedback');
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedExit, setSelectedExit] = useState(null);

  // Mock data for exit feedback
  const exitFeedbackData = [
    {
      id: 1,
      person: 'Jane Doe',
      employeeId: 'EX-1042',
      type: 'Voluntary',
      effectiveDate: 'Jul 2, 2025',
      reasons: ['Time conflict', 'Work-life balance'],
      status: 'Review',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      person: 'John Smith',
      employeeId: 'EX-2045',
      type: 'Involuntary',
      effectiveDate: 'Aug 15, 2023',
      reasons: ['Performance'],
      status: 'Submitted',
      statusColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 3,
      person: 'Alice Johnson',
      employeeId: 'EX-3098',
      type: 'End of contract',
      effectiveDate: 'Sep 10, 2024',
      reasons: ['Program completion'],
      status: 'Closed',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 4,
      person: 'Michael Brown',
      employeeId: 'EX-4123',
      type: 'Voluntary',
      effectiveDate: 'Oct 5, 2023',
      reasons: ['Better offer', 'Compensation'],
      status: 'Invited',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 5,
      person: 'Emily White',
      employeeId: 'EX-5146',
      type: 'Voluntary',
      effectiveDate: 'Nov 20, 2025',
      reasons: ['Career growth', 'Relocation'],
      status: 'Closed',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 6,
      person: 'David Green',
      employeeId: 'EX-6178',
      type: 'Voluntary',
      effectiveDate: 'Dec 30, 2023',
      reasons: ['Better offer'],
      status: 'Draft',
      statusColor: 'bg-gray-100 text-gray-800'
    }
  ];

  const handleStartExit = () => {
    navigate('/dashboard/hr/start-exit');
  };

  const handleViewExit = (exit) => {
    setSelectedExit(exit);
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedExit(null);
  };

  return (
    <div className="space-y-6">
      {showDetailView ? (
        <ExitDetailView onBack={handleBackToList} />
      ) : (
        <>
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exits</h1>
          </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger value="exit-feedback">Exit feedback</TabsTrigger>
          <TabsTrigger value="exit-interview-log">Exit interview log</TabsTrigger>
        </TabsList>

        <TabsContent value="exit-feedback" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* In Progress Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                      <MoreHorizontal className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">In progress</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rehire-eligible Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                      <RotateCcw className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Rehire-eligible</p>
                    <p className="text-2xl font-bold text-gray-900">80%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exit Feedback Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Exit feedback</h2>
              
              {/* Search and Filter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search...."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button 
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                  onClick={handleStartExit}
                >
                  <Plus className="w-4 h-4" />
                  Start exit
                </Button>
              </div>
            </div>

            {/* Exit Feedback Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Person</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Effective date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Reason(s)</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exitFeedbackData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{item.person}</div>
                              <div className="text-sm text-gray-600">{item.employeeId}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">{item.type}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-700">{item.effectiveDate}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {item.reasons.map((reason, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`${item.statusColor} text-xs`}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => handleViewExit(item)}
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exit-interview-log" className="space-y-6 mt-6">
          <ExitInterviewLog />
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
};

export default Exits;
