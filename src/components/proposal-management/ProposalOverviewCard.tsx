import React from "react";

interface ProposalOverviewCardProps {
  proposal?: any;
}

const ProposalOverviewCard: React.FC<ProposalOverviewCardProps> = ({ proposal }) => {
  // Extract summary and objectives from overview_fields
  const summaryField = proposal?.overview_fields?.find((f: any) => f.id === 'summary' || f.name?.toLowerCase() === 'summary');
  const objectivesField = proposal?.overview_fields?.find((f: any) => f.id === 'objectives' || f.name?.toLowerCase() === 'objectives');
  
  const summary = summaryField?.value || proposal?.summary || 'No summary available';
  const objectives = objectivesField?.value || proposal?.objectives || 'No objectives available';
  
  // Get other overview fields
  const otherFields = proposal?.overview_fields?.filter((f: any) => 
    f.id !== 'summary' && f.id !== 'objectives' && 
    f.name?.toLowerCase() !== 'summary' && f.name?.toLowerCase() !== 'objectives'
  ) || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
      
      <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
        <h3 className="font-medium text-gray-900">Summary</h3>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {summary}
        </p>
      </div>
      
      <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
        <h3 className="font-medium text-gray-900">Objectives</h3>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {objectives}
        </p>
      </div>
      
      {otherFields.map((field: any) => (
        <div key={field.id} className="space-y-3 p-3 border border-gray-100 rounded-lg">
          <h3 className="font-medium text-gray-900">{field.name}</h3>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
            {field.value || 'No data available'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProposalOverviewCard;
