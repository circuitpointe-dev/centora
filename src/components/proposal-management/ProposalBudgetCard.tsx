
import React from "react";

interface ProposalBudgetCardProps {
  budgetDescription?: string;
}

const ProposalBudgetCard: React.FC<ProposalBudgetCardProps> = ({
  budgetDescription = "Total project budget"
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Budget</h2>
      <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
        <h3 className="font-medium text-gray-900">
          Budget Figure (Naira)
        </h3>
        <p className="text-xl font-bold text-gray-900">₦31,400,396</p>
        <p className="text-gray-600 text-sm">{budgetDescription}</p>
      </div>
    </div>
  );
};

export default ProposalBudgetCard;
