import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { grantsData } from './data/grantsData';

// Focus area colors matching the custom instructions
const PROGRAM_AREA_COLORS = {
  'Health': '#22c55e',        // Green for Health
  'Education': '#3b82f6',     // Blue for Education  
  'Girl Child': '#3b82f6',    // Blue for Education-related (Girl Child)
  'WASH': '#22c55e',          // Green for Health-related (WASH)
  'Livelihoods': '#f59e0b'    // Amber for Livelihoods
};

const REGION_COLORS = {
  'Latin America': '#3b82f6',
  'Europe': '#ef4444',
  'Sub-Saharan Africa': '#22c55e',
  'South Asia': '#f59e0b'
};

const STATUS_COLORS = {
  'On track': '#22c55e',
  'At risk': '#f59e0b',
  'Behind schedule': '#ef4444'
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-4 mt-4">
    {payload.map((entry: any, index: number) => (
      <div key={index} className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm text-gray-600">
          {entry.payload.name}: {entry.payload.value}
        </span>
      </div>
    ))}
  </div>
);

export const ActiveGrantsStatCards = () => {
  // Filter only active grants
  const activeGrants = grantsData.filter(grant => grant.status === 'Active');

  // Program Area Data
  const programAreaData = Object.entries(
    activeGrants.reduce((acc, grant) => {
      acc[grant.programArea] = (acc[grant.programArea] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name,
    value,
    fill: PROGRAM_AREA_COLORS[name as keyof typeof PROGRAM_AREA_COLORS] || '#6b7280'
  }));

  // Region Data
  const regionData = Object.entries(
    activeGrants.reduce((acc, grant) => {
      acc[grant.region] = (acc[grant.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name,
    value,
    fill: REGION_COLORS[name as keyof typeof REGION_COLORS] || '#6b7280'
  }));

  // Status Data
  const statusData = Object.entries(
    activeGrants.reduce((acc, grant) => {
      acc[grant.trackStatus] = (acc[grant.trackStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name,
    value,
    fill: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || '#6b7280'
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Program Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Active grants by program area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programAreaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {programAreaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Region Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Active grants by region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Active grants by status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};