
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NGOStatisticsCards } from './ngo/NGOStatisticsCards';
import { ToDoRemindersSection } from './ngo/ToDoRemindersSection';
import { NGOGrantsTable } from './ngo/NGOGrantsTable';

const GrantsNGODashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Grants Dashboard
          </h1>
        </div>
        
        {/* Period Filter */}
        <div className="w-auto">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards Section */}
      <NGOStatisticsCards />

      {/* To Do & Reminders Section */}
      <ToDoRemindersSection />

      {/* Grants Table Section */}
      <NGOGrantsTable />
    </div>
  );
};

export default GrantsNGODashboard;
