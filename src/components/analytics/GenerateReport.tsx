import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const GenerateReport: React.FC = () => {
  // Metrics selection state
  const [metrics, setMetrics] = useState({
    proposalsSubmitted: false,
    successRate: false,
    totalFundsRaised: false,
    averageGrantSize: false,
    turnaroundTime: false,
    donorSegmentation: false,
  });

  // Filter selection state
  const [filters, setFilters] = useState({
    donor: false,
    team: false,
    sector: false,
    proposalStatus: false,
  });

  // Report format state
  const [reportFormat, setReportFormat] = useState({
    pdf: true,
    csv: false,
  });

  // Date range state
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date Range Required",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (Object.values(metrics).every((val) => !val)) {
      toast({
        title: "Metrics Required",
        description: "Please select at least one metric to include",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: `Your report for ${format(
        startDate,
        "MMM d, yyyy"
      )} to ${format(endDate, "MMM d, yyyy")} is being prepared`,
    });

    // Here you would implement the actual report generation API call
    console.log("Generating report with:", {
      metrics,
      filters,
      reportFormat,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 p-6">
      {/* Left Column - Configuration (30%) */}
      <div className="lg:col-span-3 space-y-6">
        {/* Metrics Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[{ id: "proposalsSubmitted", label: "Proposals Submitted" },
              { id: "successRate", label: "Success Rate (%)" },
              { id: "totalFundsRaised", label: "Total Funds Raised" },
              { id: "averageGrantSize", label: "Average Grant Size" },
              {
                id: "turnaroundTime",
                label: "Average Proposals Turnaround Time",
              },
              { id: "donorSegmentation", label: "Donor Segmentation" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={metrics[id as keyof typeof metrics]}
                  onCheckedChange={() =>
                    setMetrics((prev) => ({
                      ...prev,
                      [id]: !prev[id as keyof typeof metrics],
                    }))
                  }
                />
                <Label htmlFor={id}>{label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[{ id: "donor", label: "Donor" },
              { id: "team", label: "Team" },
              { id: "sector", label: "Sector" },
              { id: "proposalStatus", label: "Proposal status" },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-${id}`}
                  checked={filters[id as keyof typeof filters]}
                  onCheckedChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      [id]: !prev[id as keyof typeof filters],
                    }))
                  }
                />
                <Label htmlFor={`filter-${id}`}>{label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Date Range */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Date Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? format(startDate, "dd/MM/yyyy")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Report Format */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pdf"
                checked={reportFormat.pdf}
                onCheckedChange={() =>
                  setReportFormat((prev) => ({
                    ...prev,
                    pdf: !prev.pdf,
                  }))
                }
              />
              <Label htmlFor="pdf">PDF</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="csv"
                checked={reportFormat.csv}
                onCheckedChange={() =>
                  setReportFormat((prev) => ({
                    ...prev,
                    csv: !prev.csv,
                  }))
                }
              />
              <Label htmlFor="csv">CSV</Label>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={handleGenerate}>
          Generate Report
        </Button>
      </div>

      {/* Right Column - Preview (70%) */}
      <div className="lg:col-span-7 space-y-6">
        {/* File Format Visuals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reportFormat.pdf && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">PDF Preview</div>
                  <div className="text-sm text-gray-500">Document.pdf</div>
                </div>
                <div className="h-96 bg-white border flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-lg font-medium mb-2">
                      PDF Document Preview
                    </div>
                    <div className="text-sm text-gray-500">
                      {Object.entries(metrics)
                        .filter(([_, selected]) => selected)
                        .map(([key]) => (
                          <div key={key}>
                            {
                              {
                                proposalsSubmitted: "• Proposals Submitted",
                                successRate: "• Success Rate (%)",
                                totalFundsRaised: "• Total Funds Raised",
                                averageGrantSize: "• Average Grant Size",
                                turnaroundTime: "• Turnaround Time",
                                donorSegmentation: "• Donor Segmentation",
                              }[key]
                            }
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportFormat.csv && (
              <div className="border rounded-lg p-4 bg-gray-50 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">CSV Preview</div>
                  <div className="text-sm text-gray-500">Data.csv</div>
                </div>
                <div className="h-64 bg-white border overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        {Object.entries(metrics)
                          .filter(([_, selected]) => selected)
                          .map(([key]) => (
                            <th
                              key={key}
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {
                                {
                                  proposalsSubmitted: "Proposals",
                                  successRate: "Success Rate",
                                  totalFundsRaised: "Total Funds",
                                  averageGrantSize: "Avg Grant",
                                  turnaroundTime: "Turnaround",
                                  donorSegmentation: "Donor Seg.",
                                }[key]
                              }
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        {Object.entries(metrics)
                          .filter(([_, selected]) => selected)
                          .map(([key]) => (
                            <td
                              key={key}
                              className="px-4 py-2 text-sm text-gray-500"
                            >
                              Sample
                            </td>
                          ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!reportFormat.pdf && !reportFormat.csv && (
              <div className="h-64 bg-gray-50 border-2 border-dashed rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  Select PDF or CSV format to see preview
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Selections Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Selections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Selected Metrics</h3>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                {Object.entries(metrics)
                  .filter(([_, selected]) => selected)
                  .map(([key]) => (
                    <li key={key}>
                      {
                        {
                          proposalsSubmitted: "Proposals Submitted",
                          successRate: "Success Rate",
                          totalFundsRaised: "Total Funds Raised",
                          averageGrantSize: "Average Grant Size",
                          turnaroundTime: "Turnaround Time",
                          donorSegmentation: "Donor Segmentation",
                        }[key]
                      }
                    </li>
                  ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Date Range</h3>
              <p className="text-sm text-gray-600">
                {startDate && endDate
                  ? `${format(startDate, "MMM d, yyyy")} - ${format(
                      endDate,
                      "MMM d, yyyy"
                    )}`
                  : "Not selected"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateReport;
