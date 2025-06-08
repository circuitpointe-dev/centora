
import React from "react";
import { format, differenceInDays } from "date-fns";
import { Opportunity } from "@/types/opportunity";
import { CircleCheck, CircleMinus, CircleAlert, CircleDot } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PipelineCardProps {
  opportunity: Opportunity;
  onClick: (opportunity: Opportunity) => void;
}

// Helper to check if a deadline is urgent (within 7 days)
const isUrgent = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays >= 0;
};

// Helper to check if a deadline is due soon (within 14 days)
const isDueSoon = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 14 && diffDays > 7;
};

// Helper to determine status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Identified":
      return "bg-gray-400";
    case "Qualified":
      return "bg-orange-400";
    case "Sent":
      return "bg-blue-500";
    case "Approved":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
};

// Helper to determine status icon
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "Identified":
      return <CircleDot className="h-5 w-5 text-gray-600" />;
    case "Qualified":
      return <CircleAlert className="h-5 w-5 text-orange-600" />;
    case "Sent":
      return <CircleMinus className="h-5 w-5 text-blue-600" />;
    case "Approved":
      return <CircleCheck className="h-5 w-5 text-green-600" />;
    default:
      return <CircleDot className="h-5 w-5 text-gray-600" />;
  }
};

// Helper to get days remaining until deadline
const getDaysRemaining = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  return differenceInDays(deadlineDate, today);
};

// Helper to get urgency text for tooltip
const getUrgencyText = (deadline: string): string => {
  const daysRemaining = getDaysRemaining(deadline);
  
  if (daysRemaining < 0) {
    return "Passed deadline";
  } else if (daysRemaining <= 7) {
    return `Urgent: Due in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`;
  } else if (daysRemaining <= 14) {
    return `Due Soon: ${daysRemaining} days left`;
  } else {
    return `${daysRemaining} days until deadline`;
  }
};

const PipelineCard: React.FC<PipelineCardProps> = ({
  opportunity,
  onClick,
}) => {
  const deadlineDate = new Date(opportunity.deadline);
  const formattedDeadline = format(deadlineDate, "MMM dd, yyyy");

  // Determine the deadline urgency class
  let deadlineClass = "text-green-500"; // Default - not urgent
  let deadlineBgClass = "bg-green-50/40";
  
  if (isUrgent(opportunity.deadline)) {
    deadlineClass = "text-red-500 font-bold";
    deadlineBgClass = "bg-red-50/40";
  } else if (isDueSoon(opportunity.deadline)) {
    deadlineClass = "text-orange-500";
    deadlineBgClass = "bg-orange-50/40";
  }

  const tooltipText = `Click to view details. ${getUrgencyText(opportunity.deadline)}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 cursor-pointer hover:shadow-md transition-shadow h-[220px] w-full"
            onClick={() => onClick(opportunity)}
          >
            <div className="font-medium text-sm truncate mb-1">
              {opportunity.title}
            </div>
            <div className="text-xs text-gray-600 line-clamp-2 h-8">
              {opportunity.donorName}
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className={`text-xs ${deadlineClass} px-3 py-1 rounded-md flex items-center ${deadlineBgClass}`}>
                <span className={`inline-block w-2 h-2 rounded-full ${deadlineClass} mr-2`}></span>
                {formattedDeadline}
              </div>
              <div className="flex items-center">
                <StatusIcon status={opportunity.pipeline} />
              </div>
            </div>

            <div className="flex items-center mt-4 pt-3 border-t border-gray-300">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-800 text-xs font-medium">
                {opportunity.assignedTo
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>
              <span className="text-sm text-gray-700 ml-2 font-bold">
                {opportunity.assignedTo}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PipelineCard;
