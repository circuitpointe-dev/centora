import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Award, CheckCircle, Archive, TrendingUp, FileCheck, AlertCircle } from 'lucide-react';
import { GrantsStatisticsCards } from './GrantsStatisticsCards';
import { GrantsProgressCard } from './GrantsProgressCard';
import { GrantsTable } from './GrantsTable';
const GrantsDonorDashboard = () => {
  return <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-medium text-gray-900">
          Grants Dashboard
        </h1>
        
      </div>

      {/* Statistics Cards Section */}
      <GrantsStatisticsCards />

      {/* Grants Table Section */}
      <GrantsTable />
    </div>;
};
export default GrantsDonorDashboard;