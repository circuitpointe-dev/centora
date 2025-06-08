
import React from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface TimelineItem {
  status: string;
  date: string;
  completed: boolean;
}

interface TimelineCardProps {
  statusTimeline: TimelineItem[];
  sectionHeight?: string;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  statusTimeline,
  sectionHeight = "h-72"
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight}`}>
      <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Timeline
      </h3>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {statusTimeline.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.completed
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                {index < statusTimeline.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  item.completed ? "text-gray-900" : "text-gray-500"
                }`}>
                  {item.status}
                </div>
                {item.date && (
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(item.date), "MMM dd, yyyy")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;
