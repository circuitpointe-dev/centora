
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
import { generateAnalyticsReport, downloadAnalyticsReport, AnalyticsReportData } from "@/utils/analyticsExport";
import { useFundraisingStats } from "@/hooks/useFundraisingStats";
import { useDonors } from "@/hooks/useDonors";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useProposals } from "@/hooks/useProposals";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

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

  // Fetch real data for export
  const { data: fundraisingStats } = useFundraisingStats();
  const { data: donors = [] } = useDonors();
  const { data: opportunities = [] } = useOpportunities();
  const { data: proposals = [] } = useProposals();
  const { data: analyticsData } = useAnalyticsData();

  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl === "generate-report") {
      setActiveTab("generate-report");
    } else {
      setActiveTab("analytics");
    }
  }, [tabFromUrl]);

  const handleExport = async () => {
    try {
      setIsLoading(true);

      // Generate the report data with real data
      const reportData: AnalyticsReportData = {
        period: selectedPeriod === 'custom' && startDate && endDate
          ? `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
          : selectedPeriod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        generatedAt: new Date().toISOString(),
        fundraisingStats: {
          totalProposals: fundraisingStats?.totalProposals || 0,
          conversionRate: fundraisingStats?.conversionRate || 0,
          activeOpportunities: fundraisingStats?.activeOpportunities || 0,
          fundsRaised: fundraisingStats?.fundsRaised || 0,
          avgGrantSize: fundraisingStats?.avgGrantSize || 0,
          proposalsInProgress: fundraisingStats?.proposalsInProgress || 0,
          pendingReviews: fundraisingStats?.pendingReviews || 0,
          upcomingDeadlines: fundraisingStats?.upcomingDeadlines || 0,
          archivedProposals: fundraisingStats?.archivedProposals || 0,
        },
        donorStats: {
          totalDonors: donors.length,
          activeDonors: donors.filter(donor => donor.status === 'active').length,
        },
        opportunityStats: {
          totalOpportunities: opportunities.length,
          byStatus: opportunities.reduce((acc, opp) => {
            acc[opp.status] = (acc[opp.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
        proposalStats: {
          totalProposals: proposals.length,
          byStatus: proposals.reduce((acc, proposal) => {
            acc[proposal.status] = (acc[proposal.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
        fundingData: {
          bySector: analyticsData?.fundingRaised?.Sector || [],
          byDonorType: analyticsData?.fundingRaised?.['Donor Type'] || [],
        },
        donorSegmentation: {
          byType: analyticsData?.donorSegmentation?.Type || [],
          bySector: analyticsData?.donorSegmentation?.Sector || [],
        },
      };

      // Create and download the report
      downloadAnalyticsReport(reportData, selectedPeriod);

      toast({
        title: "Report Exported",
        description: "Your fundraising analytics report has been generated and downloaded.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
