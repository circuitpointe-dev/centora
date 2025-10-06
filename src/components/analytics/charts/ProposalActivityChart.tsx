
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { CustomLegend } from "./CustomLegend";

export function ProposalActivityChart() {
  const [proposalActivityFilter, setProposalActivityFilter] = useState("Donor");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [visibleLines, setVisibleLines] = useState({
    submitted: true,
    approved: true,
  });

  const { data: analyticsData, isLoading } = useAnalyticsData();

  // Get proposal activity data based on selected filter
  const getProposalActivityData = () => {
    if (!analyticsData?.proposalActivity) return [];
    return analyticsData.proposalActivity[proposalActivityFilter as keyof typeof analyticsData.proposalActivity] || [];
  };

  const currentActivityData = getProposalActivityData();

  const toggleLine = (lineKey: string) => {
    setVisibleLines((prev) => ({
      ...prev,
      [lineKey]: !prev[lineKey as keyof typeof prev],
    }));
  };

  // Define the line configurations (removed total and drafted)
  const lineConfigs = [
    { key: "submitted", name: "Proposals Submitted", color: "#818CF8" },
    { key: "approved", name: "Approved Proposals", color: "#22C55E" },
  ];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[16px] font-semibold">
            Proposal Activity Trend
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={proposalActivityFilter}
              onValueChange={setProposalActivityFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Donor">Donor</SelectItem>
                <SelectItem value="Sector">Sector</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-64">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading proposal activity...</div>
          </div>
        ) : currentActivityData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">No proposal activity data available</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentActivityData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              {lineConfigs.map(
                (line) =>
                  visibleLines[line.key as keyof typeof visibleLines] && (
                    <Line
                      key={line.key}
                      type="natural"
                      dataKey={line.key}
                      name={line.name}
                      stroke={line.color}
                      dot={false}
                    />
                  )
              )}
              <Legend
                content={
                  <CustomLegend
                    visibleLines={visibleLines}
                    toggleLine={toggleLine}
                    lineConfigs={lineConfigs}
                  />
                }
              />
              <RechartsTooltip />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
