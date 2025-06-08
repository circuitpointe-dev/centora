
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { turnaroundData } from "../data/analyticsData";

export function TurnaroundTimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[16px] font-semibold">Proposals Turnaround Time</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={turnaroundData}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 30]} ticks={[0, 5, 10, 15, 20, 25, 30]} />
            <YAxis dataKey="stage" type="category" />
            <Bar dataKey="days" fill="#2563EB" barSize={24} radius={[6, 6, 6, 6]} />
            <RechartsTooltip formatter={(value) => [`${value} days`, "Days"]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
