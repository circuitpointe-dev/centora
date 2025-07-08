import React, { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

  const getPreviewContent = () => {
    if (selectedMetrics.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Select Metrics . . .
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Selected Metrics:</h3>
        <ul className="space-y-2">
          {selectedMetrics.map(metricId => {
            const metric = metrics.find(m => m.id === metricId);
            return (
              <li key={metricId} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-600 rounded-full"></div>
                <span className="text-sm text-gray-700">{metric?.label}</span>
              </li>
            );
          })}
        </ul>
        {startDate && endDate && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Date Range: {startDate} to {endDate}
            </p>
          </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
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

            {/* Generate Report Button */}
            <Button
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              disabled={selectedMetrics.length === 0}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Preview Column */}
        <Card className="lg:col-span-2 bg-white border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Report Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getPreviewContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};