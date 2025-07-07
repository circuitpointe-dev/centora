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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Custom Compliance Report</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Selected Metrics:</p>
            <ul className="list-disc list-inside space-y-1">
              {selectedMetrics.map(metricId => {
                const metric = metrics.find(m => m.id === metricId);
                return <li key={metricId} className="text-sm text-gray-800">{metric?.label}</li>;
              })}
            </ul>
            <p className="text-sm text-gray-600 mt-4">Date Range: {startDate || "N/A"} - {endDate || "N/A"}</p>
            <p className="text-sm text-gray-600">Format: {reportFormat.toUpperCase()}</p>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-medium mb-4">Report Data Preview</h4>
            <div className="text-sm text-gray-600">
              <p>• Total policies tracked: 34</p>
              <p>• Acknowledgement rate: 78%</p>
              <p>• Expired policies: 6</p>
              <p>• Compliance score: 82%</p>
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
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
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
          <div className="w-1/2 p-6 bg-gray-50">
            <div className="h-full">
              {renderPreview()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};