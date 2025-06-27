
import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { donorSegmentationData, PIE_COLORS } from "../data/analyticsData";

export function DonorSegmentationChart() {
  const [donorSegmentFilter, setDonorSegmentFilter] = useState("Type");
  
  const currentDonorData = donorSegmentationData[donorSegmentFilter as keyof typeof donorSegmentationData];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[16px] font-semibold">Donor Segmentation</CardTitle>
          <Select value={donorSegmentFilter} onValueChange={setDonorSegmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Type">Type</SelectItem>
              <SelectItem value="Sector">Sector</SelectItem>
              <SelectItem value="Geography">Geography</SelectItem>
              <SelectItem value="Interest Tags">Interest Tags</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-56">
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={200} height={180}>
            <PieChart>
              <Pie
                data={currentDonorData}
                cx="50%" cy="50%" 
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {currentDonorData.map((entry, idx) => (
                  <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => [`${value}%`, "Percentage"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3">
            {currentDonorData.map((entry, idx) => (
              <div className="flex items-center gap-2 text-sm" key={entry.name}>
                <span
                  className="block w-3 h-3 rounded-full"
                  style={{ background: PIE_COLORS[idx] }}
                />
                <span className="text-gray-700">{entry.name}</span>
                <span className="text-gray-500">({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
