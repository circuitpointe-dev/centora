
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import GenerateReport from "@/components/analytics/GenerateReport";
import { AnalyticsTabNavigation } from "@/components/analytics/AnalyticsTabNavigation";
import { PeriodSelector } from "@/components/analytics/PeriodSelector";
import { CustomPeriodDialog } from "@/components/analytics/CustomPeriodDialog";
import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const periodOptions = [
  { label: "This Month", value: "this-month" },
  { label: "This Quarter", value: "this-quarter" },
  { label: "Last 12 Months", value: "last-12-months" },
  { label: "Custom", value: "custom" },
];

const FundraisingAnalyticsPage: React.FC = () => {
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
    <div>
      {/* Title */}
      <h1 className="text-xl font-medium text-gray-900">Analytics</h1>
      
      {/* Tabs */}
      <AnalyticsTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Top bar with period selector and actions (only for analytics) */}
      {activeTab === "analytics" && (
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          currentPeriodText={currentPeriodText}
          isLoading={isLoading}
          filterOpen={filterOpen}
          onFilterOpenChange={setFilterOpen}
          onExport={handleExport}
        />
      )}

      {/* Custom Period Dialog */}
      <CustomPeriodDialog
        open={customPeriodOpen}
        onOpenChange={setCustomPeriodOpen}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApply={handleCustomPeriodApply}
      />

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
        <AnalyticsContent selectedPeriod={selectedPeriod} />
      )}
    </div>
  );
};

export default FundraisingAnalyticsPage;
