import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Cell,
  Legend
} from 'recharts';
import { useHRStats, useHeadcountTrend, useAttritionData, useRecruitingFunnel, useTrainingCompletion } from '@/hooks/hr/useHRStats';
import {
  usePendingLeaveRequests,
  useApproveLeaveRequest,
  usePendingOffers,
  useApproveOffer,
  useExpiringDocuments,
  useNotifyExpiringDocuments
} from '@/hooks/hr/useHRActions';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const HRDashboard = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Data hooks
  const { data: hrStats, isLoading: statsLoading } = useHRStats();
  const { data: headcountTrend, isLoading: trendLoading } = useHeadcountTrend();
  const { data: attritionData, isLoading: attritionLoading } = useAttritionData();
  const { data: recruitingFunnel, isLoading: funnelLoading } = useRecruitingFunnel();
  const { data: trainingCompletion, isLoading: trainingLoading } = useTrainingCompletion();

  // Action hooks
  const { data: leaveRequests } = usePendingLeaveRequests();
  const { data: pendingOffers } = usePendingOffers();
  const { data: expiringDocs } = useExpiringDocuments();
  const approveLeave = useApproveLeaveRequest();
  const approveOffer = useApproveOffer();
  const notifyDocs = useNotifyExpiringDocuments();

  // Auto refresh functionality
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['hr-stats'] });
      queryClient.invalidateQueries({ queryKey: ['hr-pending-leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['hr-pending-offers'] });
      queryClient.invalidateQueries({ queryKey: ['hr-expiring-documents'] });
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, queryClient]);

  const handleApproveLeave = async (leaveId: string) => {
    try {
      await approveLeave.mutateAsync(leaveId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleApproveOffer = async (offerId: string) => {
    try {
      await approveOffer.mutateAsync(offerId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleNotifyDocuments = async () => {
    if (!expiringDocs || expiringDocs.length === 0) {
      toast({
        title: 'No documents',
        description: 'There are no expiring documents to notify.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await notifyDocs.mutateAsync(expiringDocs.map(doc => doc.id));
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Format data for charts
  const headcountChartData = headcountTrend || [];
  const attritionChartData = attritionData || [];
  const funnelChartData = recruitingFunnel || [];
  const trainingChartData = trainingCompletion || [
    { name: 'Acknowledged', value: 0 },
    { name: 'Pending', value: 0 }
  ];

  const COLORS = ['#10B981', '#F59E0B'];
  const maxFunnelValue = Math.max(...(funnelChartData.map(f => f.value) || [1]));

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {/* Headcount */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <img src="/assets/hr/fluent-text-word-count-24-filled0.svg" alt="Headcount" className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : (hrStats?.headcount || 0).toLocaleString()}
            </div>
            <div className="text-sm font-medium text-violet-600 mb-1">
              {hrStats?.headcountChange && hrStats.headcountChange > 0 ? '+' : ''}
              {hrStats?.headcountChange ? hrStats.headcountChange.toFixed(1) : '0'}%
            </div>
            <div className="text-xs text-gray-500">Headcount</div>
          </CardContent>
        </Card>

        {/* New Hires */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <img src="/assets/hr/fluent-people-12-filled0.svg" alt="New Hires" className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : hrStats?.newHires || 0}
            </div>
            <div className="text-xs text-gray-500">New hires</div>
          </CardContent>
        </Card>

        {/* Attrition */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <img src="/assets/hr/fluent-text-word-count-24-filled0.svg" alt="Attrition" className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : hrStats?.attritionRate.toFixed(1) || '0.0'}%
            </div>
            <div className="text-sm font-medium text-violet-600 mb-1">
              {hrStats?.attritionChange && hrStats.attritionChange < 0 ? '' : '+'}
              {hrStats?.attritionChange ? hrStats.attritionChange.toFixed(1) : '0.0'}%
            </div>
            <div className="text-xs text-gray-500">Attrition (TTM)</div>
          </CardContent>
        </Card>

        {/* Open Reqs */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <img src="/assets/hr/fluent-mdl-2-recruitment-management0.svg" alt="Open Reqs" className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : hrStats?.openReqs || 0}
            </div>
            <div className="text-xs text-gray-500">Open reqs</div>
          </CardContent>
        </Card>

        {/* Policy Ack Rate */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <img src="/assets/hr/material-symbols-policy-outline0.svg" alt="Policy" className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : Math.round(hrStats?.policyAckRate || 0)}%
            </div>
            <div className="text-xs text-gray-500">Policy Ack rate</div>
          </CardContent>
        </Card>

        {/* Training */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <img src="/assets/hr/healthicons-i-training-class0.svg" alt="Training" className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : Math.round(hrStats?.trainingCompletion || 0)}%
            </div>
            <div className="text-xs text-gray-500">Training</div>
          </CardContent>
        </Card>

        {/* Expiring Docs */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
              <img src="/assets/hr/pajamas-expire0.svg" alt="Expiring" className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : hrStats?.expiringDocs || 0}
            </div>
            <div className="text-xs text-gray-500">Expiring docs</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Headcount trend (12 month)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {trendLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <AreaChart data={headcountChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    domain={[0, 'dataMax']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7C3AED"
                    fill="#7C3AED"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attrition by Reason */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Attrition by reason</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {attritionLoading ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <BarChart data={attritionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="voluntary" stackId="a" fill="#7C3AED" name="Voluntary" />
                  <Bar dataKey="involuntary" stackId="a" fill="#9F7AEA" name="Involuntary" />
                  <Bar dataKey="other" stackId="a" fill="#C4B5FD" name="Other" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recruiting Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recruiting funnel</CardTitle>
          </CardHeader>
          <CardContent>
            {funnelLoading ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {funnelChartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 w-20 text-left">{item.stage}</span>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                        <div
                          className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${maxFunnelValue > 0 ? (item.value / maxFunnelValue) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Training completion by org unit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                {trainingLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <PieChart>
                    <Pie
                      data={trainingChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ value }) => value}
                    >
                      {trainingChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                {trainingChartData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Action center</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                setAutoRefresh(!autoRefresh);
                if (!autoRefresh) {
                  queryClient.invalidateQueries({ queryKey: ['hr-'] });
                  toast({
                    title: 'Auto refresh enabled',
                    description: 'Dashboard will refresh every 30 seconds.',
                  });
                } else {
                  toast({
                    title: 'Auto refresh disabled',
                  });
                }
              }}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Auto refreshing...' : 'Auto refresh'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Approvals */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Approvals</h3>
              <div className="space-y-3">
                {leaveRequests && leaveRequests.length > 0 ? (
                  leaveRequests.slice(0, 2).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Leave requests</p>
                        <p className="text-xs text-gray-500">{request.employee_name}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                        onClick={() => handleApproveLeave(request.id)}
                        disabled={approveLeave.isPending}
                      >
                        {approveLeave.isPending ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Approve'
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Leave requests</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                      disabled
                    >
                      Approve
                    </Button>
                  </div>
                )}

                {pendingOffers && pendingOffers.length > 0 ? (
                  pendingOffers.slice(0, 1).map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Offers</p>
                        <p className="text-xs text-gray-500">{offer.candidate_name}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                        onClick={() => handleApproveOffer(offer.id)}
                        disabled={approveOffer.isPending}
                      >
                        {approveOffer.isPending ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Approve'
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Offers</p>
                    </div>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" disabled>
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Compliance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Expiring documents</p>
                    <p className="text-xs text-gray-500">
                      {expiringDocs && expiringDocs.length > 0
                        ? `${expiringDocs.length} documents`
                        : 'No documents'
                      }
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="disabled:opacity-50"
                    onClick={handleNotifyDocuments}
                    disabled={notifyDocs.isPending || !expiringDocs || expiringDocs.length === 0}
                  >
                    {notifyDocs.isPending ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Notify'
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Overdue policies</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-gray-100"
                    onClick={async () => {
                      // In a real scenario, this would escalate policies
                      toast({
                        title: 'Policy escalation',
                        description: 'Overdue policies have been escalated to management.',
                      });
                    }}
                  >
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-gray-100"
                    onClick={() => {
                      toast({
                        title: 'Planning initiated',
                        description: 'Quarter hiring review plan has been created. You will be notified when it\'s ready.',
                      });
                    }}
                  >
                    Plan
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Training refresh for sales</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-gray-100"
                    onClick={() => {
                      toast({
                        title: 'Training assigned',
                        description: 'Training refresh for sales team has been assigned and notifications sent.',
                      });
                    }}
                  >
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
