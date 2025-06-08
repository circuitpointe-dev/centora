
import React from "react";
import { Opportunity, OpportunityStatus } from "@/types/opportunity";
import OpportunityCard from "./OpportunityCard";

interface KanbanBoardProps {
  opportunities: Opportunity[];
  onCardClick: (opportunity: Opportunity) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  opportunities,
  onCardClick,
}) => {
  const columns: OpportunityStatus[] = [
    "To Review",
    "In Progress",
    "Submitted",
    "Awarded",
    "Declined",
  ];

  // Updated to use only gray color for all headers
  const getColumnHeaderColor = (status: OpportunityStatus) => {
    return "bg-[#b2b2b2]";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {columns.map((status) => {
        const count = opportunities.filter(
          (opp) => opp.status === status
        ).length;
        const columnOpportunities = opportunities.filter(
          (opp) => opp.status === status
        );

        return (
          <div key={status} className="flex flex-col h-full">
            {/* Column Header */}
            <div
              className={`${getColumnHeaderColor(status)} p-2 rounded-full flex items-center`}
            >
              <div className="flex items-center gap-3 w-full justify-start">
                <span
                  className="bg-white px-2.5 py-0.5 rounded-full text-base font-medium"
                >
                  {count}
                </span>
                <span className="font-medium text-base text-white">
                  {status}
                </span>
              </div>
            </div>

            {/* Opportunities List - removed overflow-y-auto */}
            <div className="mt-2 space-y-2 flex-1">
              {columnOpportunities.length > 0 ? (
                columnOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    onClick={onCardClick}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                  No opportunities
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
