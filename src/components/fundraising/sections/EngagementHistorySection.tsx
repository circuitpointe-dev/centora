
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const EngagementHistorySection = (): JSX.Element => {
  // Engagement history data
  const engagementEntries = [
    {
      date: "April 12th, 2024",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
    },
    {
      date: "April 12th, 2024",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
    },
    {
      date: "April 12th, 2024",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
    },
    {
      date: "April 12th, 2024",
      description:
        "Lorem ipsum dolor sit amet consectetur. Sodales malesuada aen ean erat cum pulvinar.",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-4 h-full">
      <h2 className="font-medium text-black text-base">
        Engagement History
      </h2>

      <Card className="w-full flex-1">
        <CardContent className="p-8 h-full flex flex-col">
          <div className="flex flex-col items-start gap-6 w-full flex-1">
            {engagementEntries.map((entry, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-2 px-2.5 py-3 w-full rounded-[5px]"
              >
                <h3 className="font-semibold text-[#383839] text-sm w-full">
                  {entry.date}
                </h3>
                <p className="text-[#383839b2] text-sm w-full">
                  {entry.description}
                </p>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="mt-10 text-violet-600 border-violet-600"
          >
            Add Engagement Entry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
