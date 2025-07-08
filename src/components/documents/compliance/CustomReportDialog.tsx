import React, { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CustomReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CustomReportDialog = ({ open, onOpenChange }: CustomReportDialogProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportFormat, setReportFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const metrics = [
    { id: "acknowledgement", label: "Acknowledgement Report" },
    { id: "expired", label: "Expired Policies Report" },
    { id: "compliance", label: "User Compliance Summary" },
    { id: "audit", label: "Audit Log Report" },
  ];

  const handleMetricChange = (metricId: string, checked: boolean) => {
    if (checked) {
      setSelectedMetrics([...selectedMetrics, metricId]);
    } else {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 2000);
  };

  const renderPreview = () => {
    if (isGenerating) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Generating Report...</p>
          </div>
        </div>
      );
    }

    if (showReport) {
      return (
        <div className="space-y-6 h-full overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900">Custom Compliance Report</h3>
          
          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xl font-semibold">34</p>
                  <p className="text-xs text-gray-500">Total Policies Assigned</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xl font-semibold">180</p>
                  <p className="text-xs text-gray-500">Total Acknowledges</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xl font-semibold">45%</p>
                  <p className="text-xs text-gray-500">Acknowledgement Rate</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xl font-semibold">6</p>
                  <p className="text-xs text-gray-500">Policies Expired</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Policy Acknowledgement Rates by Team</h4>
              <span className="text-xs text-gray-500">View All</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-12">IT</span>
                <div className="flex-1 bg-gray-100 rounded h-8 relative">
                  <div className="bg-blue-600 h-full rounded" style={{width: '85%'}}></div>
                </div>
                <span className="text-xs text-gray-600 w-8">85%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-12">HR</span>
                <div className="flex-1 bg-gray-100 rounded h-8 relative">
                  <div className="bg-blue-600 h-full rounded" style={{width: '60%'}}></div>
                </div>
                <span className="text-xs text-gray-600 w-8">60%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-12">Finance</span>
                <div className="flex-1 bg-gray-100 rounded h-8 relative">
                  <div className="bg-blue-600 h-full rounded" style={{width: '75%'}}></div>
                </div>
                <span className="text-xs text-gray-600 w-8">75%</span>
              </div>
            </div>
          </div>

          {/* Two Column Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Users with Most Pending Items</h4>
                <span className="text-xs text-gray-500">View All</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">John Smith</span>
                  <span className="text-red-600">5 pending</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Sarah Johnson</span>
                  <span className="text-red-600">3 pending</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Mike Wilson</span>
                  <span className="text-red-600">2 pending</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">Expired Policies</h4>
                <span className="text-xs text-gray-500">View All</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Data Security Policy</span>
                  <span className="text-red-600">2 days ago</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Code of Conduct</span>
                  <span className="text-red-600">1 week ago</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Safety Guidelines</span>
                  <span className="text-red-600">3 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit History */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-3">Audit History</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">14 Jan 2025 08:30</span>
                  <span className="text-gray-600">John Smith</span>
                  <span className="text-gray-600">Acknowledged</span>
                  <span className="text-gray-600">Data Security Policy</span>
                </div>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">Completed</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">13 Jan 2025 14:22</span>
                  <span className="text-gray-600">Sarah Johnson</span>
                  <span className="text-gray-600">Viewed</span>
                  <span className="text-gray-600">Code of Conduct</span>
                </div>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">Viewed</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">12 Jan 2025 11:15</span>
                  <span className="text-gray-600">Mike Wilson</span>
                  <span className="text-gray-600">Downloaded</span>
                  <span className="text-gray-600">Safety Guidelines</span>
                </div>
                <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">Downloaded</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedMetrics.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Select Metrics...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Selected Metrics:</p>
          <ul className="list-disc list-inside space-y-1">
            {selectedMetrics.map(metricId => {
              const metric = metrics.find(m => m.id === metricId);
              return <li key={metricId} className="text-sm text-gray-800">{metric?.label}</li>;
            })}
          </ul>
        </div>
        <p className="text-sm text-gray-500">Configure date range and click "Generate Report" to proceed.</p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Compliance Reports
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column - Form */}
          <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-8">
              {/* Select Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Metrics</h3>
                <div className="space-y-3">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={metric.id}
                        checked={selectedMetrics.includes(metric.id)}
                        onCheckedChange={(checked) => handleMetricChange(metric.id, checked as boolean)}
                      />
                      <Label htmlFor={metric.id} className="text-sm text-gray-700">
                        {metric.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="startDate" className="text-sm text-gray-700">Start Date</Label>
                    <div className="relative mt-1">
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-10"
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-sm text-gray-700">End Date</Label>
                    <div className="relative mt-1">
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-10"
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Format */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Format</h3>
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

              {/* Generate Button */}
              <Button
                onClick={handleGenerateReport}
                disabled={selectedMetrics.length === 0 || isGenerating}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="w-2/3 p-6 bg-gray-50">
            <div className="h-full">
              {renderPreview()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};