
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
    <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
      <Clock className="h-4 w-4" />
      Status Timeline
    </h3>
    <div className="relative flex-1">
      {statusTimeline.map((item, index) => (
        <div key={index} className="relative pb-6 last:pb-0">
          {/* Connecting line */}
          {index < statusTimeline.length - 1 && (
            <div className="absolute left-2 top-6 w-0.5 h-full bg-gray-200"></div>
          )}
          
          <div className="flex items-start gap-3">
            <div
              className={`relative z-10 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border-2 
              ${item.completed 
                ? "bg-green-500 border-green-500" 
                : "bg-white border-gray-300"
              }`}
            >
              {item.completed ? (
                <Check className="h-3 w-3 text-white" />
              ) : (
                <Circle className="h-3 w-3 text-gray-400 fill-current" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}>
                {item.status}
              </div>
              {item.date && (
                <div className="text-xs text-gray-500 mt-1">
                  {format(new Date(item.date), "MMM dd, yyyy")}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TimelineCard;
