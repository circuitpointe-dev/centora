import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Clock } from 'lucide-react';
import { useFundingCyclesData, FundingCycleData } from '@/hooks/useFundingCyclesData';

const FundingCycles: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data, isLoading, error } = useFundingCyclesData(selectedYear || undefined);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getMonthName = (monthNum: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNum - 1] || '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funding Cycles</CardTitle>
          <CardDescription>Overview of funding cycles for your donors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funding Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading funding cycles data</p>
        </CardContent>
      </Card>
    );
  }

  const fundingCycles = data?.fundingCycles || [];
  const availableYears = data?.availableYears || [];

  if (fundingCycles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funding Cycles</CardTitle>
          <CardDescription>Overview of funding cycles for your donors</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Clock}
            title="No funding cycles found"
            description="Create funding cycles to track donor funding periods and commitments."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Cycles</CardTitle>
        <CardDescription>
          {fundingCycles.length} funding cycle{fundingCycles.length !== 1 ? 's' : ''} found
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableYears.length > 0 && (
          <div className="flex items-center space-x-2">
            <label htmlFor="year-select" className="text-sm font-medium">
              Filter by year:
            </label>
            <Select 
              value={selectedYear?.toString() || "all"} 
              onValueChange={(value) => setSelectedYear(value === "all" ? null : Number(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-4">
          {fundingCycles.map((cycle) => (
            <div
              key={cycle.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cycle.color }}
                />
                <div>
                  <h4 className="font-medium">{cycle.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {getMonthName(cycle.startMonth)} - {getMonthName(cycle.endMonth)} {cycle.year}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cycle.status)}`}>
                {cycle.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FundingCycles;