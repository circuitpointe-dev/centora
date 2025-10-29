import React, { useState, useMemo } from 'react';
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
import { useExits } from '@/hooks/hr/useExits';
import { useEmployees } from '@/hooks/hr/useEmployees';

const Exits = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('exit-feedback');
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedExit, setSelectedExit] = useState(null);

  // Live data from database
  const { data: exits, isLoading: exitsLoading } = useExits();
  const { data: employees } = useHREmployees();

  // Transform exit records to match UI format
  const exitFeedbackData = useMemo(() => {
    if (!exits) return [];

    return exits.map((exit) => {
      const employee = employees?.find(e => e.id === exit.employee_id);
      const statusColors: { [key: string]: string } = {
        review: 'bg-yellow-100 text-yellow-800',
        submitted: 'bg-purple-100 text-purple-800',
        closed: 'bg-green-100 text-green-800',
        invited: 'bg-blue-100 text-blue-800',
        draft: 'bg-muted text-gray-800',
      };

      return {
        id: exit.id,
        person: employee ? `${employee.first_name} ${employee.last_name}` : 'Former Employee',
        employeeId: employee?.employee_id || '—',
        type: exit.exit_reason ? exit.exit_reason.charAt(0).toUpperCase() + exit.exit_reason.slice(1) : '—',
        effectiveDate: new Date(exit.exit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        reasons: exit.exit_type ? [exit.exit_type] : [],
        status: 'Review', // Can add status field to schema later
        statusColor: statusColors.review || 'bg-muted text-gray-800',
        exitData: exit, // Store full exit record for detail view
      };
    });
  }, [exits, employees]);

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
            <h1 className="text-2xl font-bold text-foreground">Exits</h1>
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-muted">
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
                        <p className="text-sm text-muted-foreground mb-1">In progress</p>
                        <p className="text-2xl font-bold text-foreground">
                          {exitFeedbackData.filter(e => e.status === 'Review' || e.status === 'Invited').length}
                        </p>
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
                        <p className="text-sm text-muted-foreground mb-1">Completed</p>
                        <p className="text-2xl font-bold text-foreground">
                          {exitFeedbackData.filter(e => e.status === 'Closed').length}
                        </p>
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
                        <p className="text-sm text-muted-foreground mb-1">Rehire-eligible</p>
                        <p className="text-2xl font-bold text-foreground">80%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Exit Feedback Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Exit feedback</h2>

                  {/* Search and Filter */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Person</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Effective date</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reason(s)</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exitFeedbackData.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium text-foreground">{item.person}</div>
                                  <div className="text-sm text-muted-foreground">{item.employeeId}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-foreground">{item.type}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-foreground">{item.effectiveDate}</span>
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
