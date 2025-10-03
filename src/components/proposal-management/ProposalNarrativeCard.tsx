import React from "react";

interface ProposalNarrativeCardProps {
  narrativeTitle?: string;
  proposal?: any;
}

const ProposalNarrativeCard: React.FC<ProposalNarrativeCardProps> = ({
  narrativeTitle = "Proposal Narrative",
  proposal
}) => {
  const narrativeFields = proposal?.narrative_fields || [];
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Narrative</h2>
      
      {narrativeFields.length === 0 ? (
        <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
          <p className="text-gray-500 text-sm">No narrative content available</p>
        </div>
      ) : (
        narrativeFields.map((field: any) => (
          <div key={field.id} className="space-y-3 p-3 border border-gray-100 rounded-lg">
            <h3 className="font-medium text-gray-900">{field.name || narrativeTitle}</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {field.value || 'No content available'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProposalNarrativeCard;
