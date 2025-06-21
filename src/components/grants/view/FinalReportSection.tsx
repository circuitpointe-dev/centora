
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const FinalReportSection = (): JSX.Element => {
  // Data for report items  
  const reportItems = [
    { role: "Grant Manager", date: "12/05/2025" },
    { role: "Grant Manager", date: "12/05/2025" },
    { role: "Grant Manager", date: "12/05/2025" },
    { role: "Grant Manager", date: "12/05/2025" },
    { role: "Grant Manager", date: "12/05/2025" },
  ];

  return (
    <Card className="flex flex-col gap-6 p-7 flex-1 self-stretch rounded-sm">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold text-black">
          Final Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-6">
        {reportItems.map((item, index) => (
          <div
            key={`report-item-${index}`}
            className="flex items-center justify-between w-full"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm text-black whitespace-nowrap">
                {item.role}
              </div>
              <div className="text-xs text-gray-500">
                {item.date}
              </div>
            </div>
            <Button
              variant="outline"
              className="w-[131px] h-auto rounded-sm border-purple-600 text-purple-600 hover:bg-purple-50 font-medium"
            >
              Review
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FinalReportSection;
