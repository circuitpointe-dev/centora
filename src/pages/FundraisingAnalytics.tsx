
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnalyticsStatCards } from "@/components/analytics/AnalyticsStatCards";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import GenerateReport from "@/components/analytics/GenerateReport"; // Import the GenerateReport component
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Filter,
  Download,
  Calendar as CalendarIcon,
  FileText,
  BarChart, // Using BarChart as a placeholder icon for Analytics
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const tabDefs = [
  {
    label: "Analytics",
    value: "analytics",
    icon: <BarChart size={16} />, // Placeholder icon
  },
  {
    label: "Generate Report",
    value: "generate-report",
    icon: <FileText size={16} />,
  },
];

const periodOptions = [
  { label: "This Month", value: "this-month" },
  { label: "This Quarter", value: "this-quarter" },
  { label: "Last 12 Months", value: "last-12-months" },
  { label: "Custom", value: "custom" },
];

const FundraisingAnalytics: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<"generate-report" | "analytics">(
    tabFromUrl === "generate-report" ? "generate-report" : "analytics"
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [customPeriodOpen, setCustomPeriodOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl === "generate-report") {
      setActiveTab("generate-report");
    } else {
      setActiveTab("analytics");
    }
  }, [tabFromUrl]);

  function handleExport() {
    toast({
      title: "Report Exported",
      description:
        "Your fundraising analytics report has been generated and downloaded.",
    });
  }

  const handlePeriodChange = async (value: string) => {
    setIsLoading(true);
    try {
      setSelectedPeriod(value);
      if (value === "custom") {
        setCustomPeriodOpen(true);
      }
      // Simulate data loading
      await new Promise((resolve) => setTimeout(resolve, 800));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomPeriodApply = async () => {
    if (startDate && endDate) {
      setIsLoading(true);
      try {
        setCustomPeriodOpen(false);
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast({
          title: "Custom Period Applied",
          description: `Analytics updated for ${format(
            startDate,
            "PPP"
          )} to ${format(endDate, "PPP")}`,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get current period display text
  const currentPeriodText =
    periodOptions.find((opt) => opt.value === selectedPeriod)?.label ||
    (startDate && endDate
      ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d,")}}`
      : "Select Period");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {tabDefs.map((tab) => (
          <button
            key={tab.value}
            onClick={() =>
              setActiveTab(tab.value as "generate-report" | "analytics")
            }
            className={`text-base font-medium px-3 py-2 rounded transition flex items-center gap-2 ${
              activeTab === tab.value
                ? "text-violet-700 border-b-2 border-violet-700 bg-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      {/* Top bar with period selector and actions (only for analytics) */}
      {activeTab === "analytics" && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
          {/* Period selector with loading state */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border-b-2 border-violet-700">
            <CalendarIcon size={16} className="text-violet-700" />
            {isLoading ? (
              <div className="flex items-center gap-2 w-40">
                <Loader2 className="h-4 w-4 animate-spin text-violet-700" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <>
                <Select
                  value={selectedPeriod}
                  onValueChange={handlePeriodChange}
                >
                  <SelectTrigger className="w-40 border-0 p-0 h-auto shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Current period indicator badge */}
                <span className="ml-2 text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded-full">
                  {currentPeriodText}
                </span>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 ml-auto">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={18} /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                {/* Filter content */}
              </PopoverContent>
            </Popover>
            <Button variant="default" className="gap-2" onClick={handleExport}>
              <Download size={18} /> Export
            </Button>
          </div>
        </div>
      )}

      {/* Custom Period Dialog (still available when on Analytics tab) */}
      <Dialog open={customPeriodOpen} onOpenChange={setCustomPeriodOpen}>
        {/* Dialog content */}
      </Dialog>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-violet-700" />
        </div>
      )}

      {/* Conditionally render components based on the active tab */}
      {activeTab === "generate-report" ? (
        <GenerateReport />
      ) : (
        <>
          {/* Stat cards */}
          <AnalyticsStatCards
            variant="this-month"
            selectedPeriod={selectedPeriod}
          />

          {/* Analytics charts */}
          <div className="mt-4">
            <AnalyticsCharts selectedPeriod={selectedPeriod} />
          </div>
        </>
      )}
    </div>
  );
};

export default FundraisingAnalytics;
