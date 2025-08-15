import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { TrendingUp } from "lucide-react";
import { useAggregatedFundingPeriods } from "@/hooks/useAggregatedFundingPeriods";
import { formatCurrency } from "@/utils/monthConversion";

const GivingChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Fetch aggregated funding periods data
  const { data, isLoading, error } = useAggregatedFundingPeriods(selectedYear || undefined);

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-sm text-muted-foreground">
            Total: {formatCurrency(data.amount)}
          </p>
          <p className="text-xs text-muted-foreground">
            {data.count} funding period{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <section className="bg-background rounded-sm p-6 shadow-sm h-[450px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="flex-1">
          <Skeleton className="w-full h-full" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background rounded-sm p-6 shadow-sm h-[450px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-medium text-foreground">Giving Overview</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-destructive">Error loading giving data</div>
        </div>
      </section>
    );
  }

  const monthlyData = data || [];
  const totalAmount = monthlyData.reduce((sum, item) => sum + item.amount, 0);
  const availableYears = [...new Set(monthlyData.map(item => item.year))].sort((a, b) => b - a);

  // Check if there's any data at all
  const hasAnyData = totalAmount > 0;

  return (
    <section className="bg-background rounded-sm p-6 shadow-sm h-[450px] flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-medium text-foreground">Giving Overview</h2>
          {selectedYear && hasAnyData && (
            <span className="text-sm text-muted-foreground">
              Total: {formatCurrency(totalAmount)}
            </span>
          )}
        </div>
        
        {/* Year selector dropdown */}
        {availableYears.length > 0 && (
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={(value) => setSelectedYear(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="All Years">
                {selectedYear || "All Years"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Years</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!hasAnyData ? (
          <EmptyState
            icon={TrendingUp}
            title="No Giving Data"
            description={selectedYear 
              ? `No donations recorded for ${selectedYear}. Try selecting a different year or add giving records.`
              : "No donations have been recorded yet. Start by adding giving records for your donors."
            }
            className="flex-1"
          />
        ) : (
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="monthName" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs text-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs text-muted-foreground"
                  tickFormatter={(value) => formatCurrency(value, 'USD').replace('$', '$')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(var(--primary))"
                  radius={[2, 2, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
};

export default GivingChart;