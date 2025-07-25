import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { overdueByItemType, complianceStatusData, upcomingDueDates } from './data/complianceMonitorData';

export const ComplianceCharts = () => {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  // Get dates that have due items
  const dueDates = upcomingDueDates.map(item => new Date(item.date));

  const isDueDate = (date: Date) => {
    return dueDates.some(dueDate => 
      dueDate.getDate() === date.getDate() &&
      dueDate.getMonth() === date.getMonth() &&
      dueDate.getFullYear() === date.getFullYear()
    );
  };

  const customDayContent = (day: Date) => {
    if (isDueDate(day)) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
            {day.getDate()}
          </div>
        </div>
      );
    }
    return <span>{day.getDate()}</span>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Overdue Compliance By Item Type - Bar Chart */}
      <Card className="h-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Overdue Compliance By Item Type</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={overdueByItemType} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={10}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Compliance Status - Doughnut Chart */}
      <Card className="h-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Compliance Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col items-center">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={complianceStatusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {complianceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {complianceStatusData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Due Dates - Calendar */}
      <Card className="h-80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Upcoming Due Dates</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-sm">
              {calendarDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={calendarDate}
            onSelect={setCalendarDate}
            className="rounded-md border-none p-0"
            components={{
              DayContent: ({ date }) => customDayContent(date)
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};