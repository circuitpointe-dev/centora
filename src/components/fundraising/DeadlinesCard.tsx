
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeadlineItem, deadlinesData } from "@/data/fundraisingData";

interface DeadlineProps {
  item: DeadlineItem;
  isLast: boolean;
}

const Deadline: React.FC<DeadlineProps> = ({ item, isLast }) => {
  const cardBgColors = {
    Urgent: "bg-red-100",
    "Due Soon": "bg-orange-100",
    Upcoming: "bg-green-100",
  };
  const statusBgColors = {
    Urgent: "bg-red-600",
    "Due Soon": "bg-orange-600",
    Upcoming: "bg-green-600",
  };

  return (
    <div className={`${!isLast ? 'mb-4' : ''}`}>
      <div className={`p-4 rounded-lg ${cardBgColors[item.status]}`}>
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
          <p className="text-xs text-gray-600">{item.organization}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{item.dueDate}</span>
            <span
              className={`${statusBgColors[item.status]} text-white text-xs px-3 py-1.5 rounded-md`}
            >
              {item.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeadlinesCard: React.FC = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex-1 overflow-y-auto">
          {deadlinesData.map((item, idx) => (
            <Deadline
              key={item.id}
              item={item}
              isLast={idx === deadlinesData.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
