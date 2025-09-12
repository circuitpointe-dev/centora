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
import { useComplianceStats, useTeamComplianceRates, usePendingUsers, useExpiredPolicies, useAuditHistory } from '@/hooks/useComplianceReports';

interface CustomReportPageProps {
  onBack: () => void;
}

export const CustomReportPage = ({ onBack }: CustomReportPageProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');

  // Fetch real data from backend
  const { data: complianceStats } = useComplianceStats(selectedMetrics, { start: startDate, end: endDate });
  const { data: teamRates } = useTeamComplianceRates(selectedMetrics);
  const { data: pendingUsers } = usePendingUsers(selectedMetrics);
  const { data: expiredPolicies } = useExpiredPolicies(selectedMetrics);
  const { data: auditHistory } = useAuditHistory(selectedMetrics);

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

    // Use real data instead of mock data
    const statCards = [];
    
    if (complianceStats && (selectedMetrics.includes('acknowledgement') || selectedMetrics.includes('compliance'))) {
      statCards.push(
        {
          title: "Total Policies Assigned",
          value: complianceStats.totalPoliciesAssigned.toString(),
          icon: User,
          iconBgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          shadowColor: "shadow-blue-100/40",
        },
        {
          title: "Total Acknowledges", 
          value: complianceStats.totalAcknowledged.toString(),
          icon: Check,
          iconBgColor: "bg-green-100",
          iconColor: "text-green-600",
          shadowColor: "shadow-green-100/40",
        },
        {
          title: "Acknowledgement Rate",
          value: `${complianceStats.acknowledgementRate}%`,
          icon: Clock,
          iconBgColor: "bg-yellow-100",
          iconColor: "text-yellow-600",
          shadowColor: "shadow-yellow-100/40",
        }
      );

      if (selectedMetrics.includes('expired')) {
        statCards.push({
          title: "Policies Expired",
          value: complianceStats.policiesExpired.toString(),
          icon: X,
          iconBgColor: "bg-red-100",
          iconColor: "text-red-600",
          shadowColor: "shadow-red-100/40",
        });
      }
    }

    const chartData = teamRates || [];
    const pendingItemsData = pendingUsers || [];
    const expiredPoliciesData = expiredPolicies || [];
    const auditHistoryData = auditHistory || [];

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
                <Card key={index} className="bg-white h-32 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 border-0">
                  <CardContent className="p-4 h-full">
                    <div className="flex flex-col items-center justify-center text-center h-full space-y-2">
                      <div className={`p-2 rounded-full ${card.iconBgColor}`}>
                        <Icon className={`h-5 w-5 ${card.iconColor}`} />
                      </div>
                      <p className="text-xl font-semibold text-gray-900">{card.value}</p>
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
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-0"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Compliance Reports
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
        <Card className="lg:col-span-1 bg-white border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Select Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={(checked) => 
                      handleMetricChange(metric.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={metric.id} className="text-sm text-gray-700 cursor-pointer">
                    {metric.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-white border border-gray-200 overflow-auto">
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