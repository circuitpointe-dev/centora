
import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fundingRaisedData } from "../data/analyticsData";

export function FundingRaisedChart() {
  const [fundingRaisedFilter, setFundingRaisedFilter] = useState("Sector");
  
  const currentFundingData = fundingRaisedData[fundingRaisedFilter as keyof typeof fundingRaisedData];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[16px] font-semibold">Funding Raised</CardTitle>
          <Select value={fundingRaisedFilter} onValueChange={setFundingRaisedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sector">Sector</SelectItem>
              <SelectItem value="Donor Type">Donor Type</SelectItem>
              <SelectItem value="Teams">Teams</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentFundingData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
            <Bar 
              dataKey="value" 
              fill="#22C55E" 
              barSize={30} 
              radius={[8, 8, 0, 0]}
            />
            <RechartsTooltip 
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]} 
              cursor={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
