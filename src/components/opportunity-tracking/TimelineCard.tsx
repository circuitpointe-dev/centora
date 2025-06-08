
import React from "react";
import { Clock, Check, Circle, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface StatusTimelineItem {
  status: string;
  date: string;
  completed: boolean;
}

interface TimelineCardProps {
  statusTimeline: StatusTimelineItem[];
  sectionHeight?: string;
}

const TimelineCard: React.FC<TimelineCardProps> = ({
  statusTimeline,
  sectionHeight = "h-72"
}) => (
  <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight} overflow-y-auto`}>
    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
      <Clock className="h-4 w-4" />
      Status Timeline
    </h3>
    <div className="space-y-3 flex-1 overflow-y-auto">
      {statusTimeline.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center 
            ${item.completed ? "bg-green-500" : "bg-gray-200"}`}
          >
            {item.completed ? (
              <Check className="h-3 w-3 text-white" />
            ) : (
              <Circle className="h-3 w-3 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">
              {item.status}
            </div>
            {item.date && (
              <div className="text-xs text-gray-500">
                {format(new Date(item.date), "MMM dd, yyyy")}
              </div>
            )}
          </div>
          {index < statusTimeline.length - 1 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default TimelineCard;
