
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { ReportViewDialog } from "./ReportViewDialog";

const FinalReportSection = (): JSX.Element => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Data for report items  
  const reportItems = [
    { role: "Grant Manager", date: "12/05/2025" },
    { role: "Grant Manager", date: "12/05/2025" },
    { role: "Grant Manager", date: "12/05/2025" },
    { role: "Grant Manager", date: "12/05/2025" },
    { role: "Grant Manager", date: "12/05/2025" },
  ];

  const handleReviewClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card className="flex flex-col rounded-sm h-fit">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-semibold text-black">
            Reviewer's Report
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="space-y-4">
            {reportItems.map((item, index) => (
              <div
                key={`report-item-${index}`}
                className="flex items-center justify-between w-full"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-black whitespace-nowrap">
                    {item.role}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.date}
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleReviewClick}
                  className="w-[131px] h-auto rounded-sm border-purple-600 text-purple-600 hover:bg-purple-50 font-medium"
                >
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ReportViewDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        report={null}
      />
    </>
  );
};

export default FinalReportSection;
