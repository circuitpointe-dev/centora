import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
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
import { useFundraisingStats } from "@/hooks/useFundraisingStats";
import { useDonors } from "@/hooks/useDonors";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useProposals } from "@/hooks/useProposals";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const GenerateReport: React.FC = () => {
  // Fetch real data
  const { data: fundraisingStats } = useFundraisingStats();
  const { data: donors = [] } = useDonors();
  const { data: opportunities = [] } = useOpportunities();
  const { data: proposals = [] } = useProposals();
  const { data: analyticsData } = useAnalyticsData();

  // Loading state
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerate = async () => {
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

    if (!reportFormat.pdf && !reportFormat.csv) {
      toast({
        title: "Format Required",
        description: "Please select at least one report format (PDF or CSV)",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Filter proposals by date range
      const filteredProposals = proposals.filter(p => {
        const createdDate = new Date(p.created_at);
        return createdDate >= startDate && createdDate <= endDate;
      });

      // Calculate metrics based on selections
      const reportData: any = {
        period: `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`,
        generatedAt: new Date().toISOString(),
      };

      if (metrics.proposalsSubmitted) {
        reportData.proposalsSubmitted = filteredProposals.length;
      }

      if (metrics.successRate) {
        const approved = filteredProposals.filter(p => p.status === 'approved').length;
        reportData.successRate = filteredProposals.length > 0 
          ? ((approved / filteredProposals.length) * 100).toFixed(2) 
          : 0;
      }

      if (metrics.totalFundsRaised) {
        reportData.totalFundsRaised = fundraisingStats?.fundsRaised || 0;
      }

      if (metrics.averageGrantSize) {
        reportData.averageGrantSize = fundraisingStats?.avgGrantSize || 0;
      }

      if (metrics.turnaroundTime) {
        // Calculate average days from creation to approval
        const approvedProposals = filteredProposals.filter(p => p.status === 'approved' && p.updated_at);
        if (approvedProposals.length > 0) {
          const totalDays = approvedProposals.reduce((sum, p) => {
            const created = new Date(p.created_at);
            const updated = new Date(p.updated_at!);
            const days = Math.floor((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0);
          reportData.averageTurnaroundTime = Math.round(totalDays / approvedProposals.length);
        } else {
          reportData.averageTurnaroundTime = 0;
        }
      }

      if (metrics.donorSegmentation) {
        reportData.donorSegmentation = analyticsData?.donorSegmentation?.Type || [];
      }

      // Generate PDF if selected
      if (reportFormat.pdf) {
        generatePDFReport(reportData);
      }

      // Generate CSV if selected
      if (reportFormat.csv) {
        generateCSVReport(reportData);
      }

      toast({
        title: "Report Generated",
        description: `Your report for ${format(startDate, "MMM d, yyyy")} to ${format(endDate, "MMM d, yyyy")} has been downloaded`,
      });
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDFReport = (reportData: any) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fundraising Analytics Report - ${reportData.period}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 1.1em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }
        .stat-card h3 {
            margin: 0 0 15px 0;
            color: #4a5568;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .stat-value {
            font-size: 2.2em;
            font-weight: 700;
            color: #2d3748;
            margin: 0;
        }
        .footer {
            text-align: center;
            color: #718096;
            margin-top: 40px;
            padding: 20px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Fundraising Analytics Report</h1>
        <p>Period: ${reportData.period}</p>
        <p>Generated: ${new Date(reportData.generatedAt).toLocaleString()}</p>
    </div>

    <div class="stats-grid">
        ${reportData.proposalsSubmitted !== undefined ? `
        <div class="stat-card">
            <h3>Proposals Submitted</h3>
            <p class="stat-value">${reportData.proposalsSubmitted}</p>
        </div>
        ` : ''}
        
        ${reportData.successRate !== undefined ? `
        <div class="stat-card">
            <h3>Success Rate</h3>
            <p class="stat-value">${reportData.successRate}%</p>
        </div>
        ` : ''}
        
        ${reportData.totalFundsRaised !== undefined ? `
        <div class="stat-card">
            <h3>Total Funds Raised</h3>
            <p class="stat-value">$${reportData.totalFundsRaised.toLocaleString()}</p>
        </div>
        ` : ''}
        
        ${reportData.averageGrantSize !== undefined ? `
        <div class="stat-card">
            <h3>Average Grant Size</h3>
            <p class="stat-value">$${reportData.averageGrantSize.toLocaleString()}</p>
        </div>
        ` : ''}
        
        ${reportData.averageTurnaroundTime !== undefined ? `
        <div class="stat-card">
            <h3>Average Turnaround Time</h3>
            <p class="stat-value">${reportData.averageTurnaroundTime} days</p>
        </div>
        ` : ''}
    </div>

    <div class="footer">
        <p>This report was generated by Centora ERP System</p>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fundraising-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSVReport = (reportData: any) => {
    const rows = [
      ['Metric', 'Value'],
    ];

    if (reportData.proposalsSubmitted !== undefined) {
      rows.push(['Proposals Submitted', reportData.proposalsSubmitted.toString()]);
    }
    if (reportData.successRate !== undefined) {
      rows.push(['Success Rate (%)', reportData.successRate.toString()]);
    }
    if (reportData.totalFundsRaised !== undefined) {
      rows.push(['Total Funds Raised ($)', reportData.totalFundsRaised.toString()]);
    }
    if (reportData.averageGrantSize !== undefined) {
      rows.push(['Average Grant Size ($)', reportData.averageGrantSize.toString()]);
    }
    if (reportData.averageTurnaroundTime !== undefined) {
      rows.push(['Average Turnaround Time (days)', reportData.averageTurnaroundTime.toString()]);
    }

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fundraising-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

        <Button 
          className="w-full" 
          size="lg" 
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Report'
          )}
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
