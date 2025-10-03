import React from "react";

interface ProposalLogframeCardProps {
  proposal?: any;
}

const ProposalLogframeCard: React.FC<ProposalLogframeCardProps> = ({ proposal }) => {
  const logframeFields = proposal?.logframe_fields || [];
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Logframe</h2>
      
      {logframeFields.length === 0 ? (
        <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
          <p className="text-gray-500 text-sm">No logframe data available</p>
        </div>
      ) : (
        logframeFields.map((field: any) => (
          <div key={field.id} className="space-y-3 p-3 border border-gray-100 rounded-lg">
            <h3 className="font-medium text-gray-900">{field.name}</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {field.value || 'No data available'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProposalLogframeCard;
