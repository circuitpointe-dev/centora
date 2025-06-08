
import React from "react";

const ProposalLogframeCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Logframe</h2>
      <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
        <h3 className="font-medium text-gray-900">Outcome</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Ultrices amet semectus
          et ultrices.
        </p>
      </div>
      <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
        <h3 className="font-medium text-gray-900">Indicator</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Ultrices amet semectus
          et ultrices.
        </p>
      </div>
      <div className="space-y-3 p-3 border border-gray-100 rounded-lg">
        <h3 className="font-medium text-gray-900">Assumption</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Ultrices amet semectus
          et ultrices.
        </p>
      </div>
    </div>
  );
};

export default ProposalLogframeCard;
