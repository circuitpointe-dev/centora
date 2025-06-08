
import React from "react";

interface ProposalNarrativeCardProps {
  narrativeTitle?: string;
}

const ProposalNarrativeCard: React.FC<ProposalNarrativeCardProps> = ({
  narrativeTitle = "Proposal Narrative"
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Narrative</h2>
      <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
        <h3 className="font-medium text-gray-900">{narrativeTitle}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Ultrices amet semectus
          et ultrices venenatis et tortor. Suscipit nibhaut facilisis
          posuruent velit.
        </p>
      </div>
    </div>
  );
};

export default ProposalNarrativeCard;
