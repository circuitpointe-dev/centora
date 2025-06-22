
import React from "react";
import { format, differenceInDays } from "date-fns";
import { Opportunity } from "@/types/opportunity";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: (opportunity: Opportunity) => void;
}

// Helper to get days remaining until deadline
const getDaysRemaining = (deadline: string): number => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  return differenceInDays(deadlineDate, today);
};

// Helper to determine deadline urgency
const getDeadlineUrgency = (deadline: string) => {
  const daysRemaining = getDaysRemaining(deadline);

  if (daysRemaining < 0) {
    return "passed";
  } else if (daysRemaining <= 14) {
    return "urgent";
  } else {
    // "Due Soon" up to 30 days
    return "dueSoon";
  }
};

// Helper to get urgency text for tooltip
const getUrgencyText = (deadline: string): string => {
  const daysRemaining = getDaysRemaining(deadline);

  if (daysRemaining < 0) {
    return "Passed deadline";
  } else if (daysRemaining <= 14) {
    return `Urgent: Due in ${daysRemaining} day${
      daysRemaining === 1 ? "" : "s"
    }`;
  } else {
    return `Due Soon: ${daysRemaining} days left`;
  }
};

// Helper to determine background color based on urgency
const getDeadlineBackgroundColorClass = (urgency: string): string => {
  switch (urgency) {
    case "passed":
      return "bg-gray-100 text-black";
    case "urgent":
      return "bg-red-300 text-black";
    case "dueSoon":
      return "bg-green-300 text-black";
    default:
      return "bg-gray-100 text-black";
  }
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onClick,
}) => {
  const deadlineDate = new Date(opportunity.deadline);
  const formattedDeadline = format(deadlineDate, "MMM dd, yyyy"); // Included year
  const deadlineUrgency = getDeadlineUrgency(opportunity.deadline);
  const deadlineBgColorClass = getDeadlineBackgroundColorClass(deadlineUrgency);

  const tooltipText = `Click to view details. ${getUrgencyText(
    opportunity.deadline
  )}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 cursor-pointer hover:shadow-md transition-shadow w-full"
            onClick={() => onClick(opportunity)}
          >
            <div className="font-medium text-base truncate mb-1">
              {opportunity.title}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2 h-10">
              {opportunity.donorName}
            </div>

            <div
              className="bg-gray-100 text-black p-2 rounded-md flex items-center mt-2"
            >
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  deadlineBgColorClass.split(" ")[0]
                }`}
              ></div>
              <span className="text-md font-medium">{formattedDeadline}</span>
            </div>

            <div className="flex items-center mt-4 pt-3 border-t border-gray-300">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-800 text-xs font-medium">
                {opportunity.assignedTo
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>
              <span className="text-sm text-gray-700 ml-2 font-semibold">
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

export default OpportunityCard;
