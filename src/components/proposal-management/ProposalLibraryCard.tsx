
import React from "react";
import { Eye, Star } from "lucide-react";

interface Proposal {
  title: string;
  description: string;
  fileType: string;
  uses: number;
  imageSrc: string;
  rating?: number;
}

interface ProposalLibraryCardProps {
  proposal: Proposal;
  onView?: (proposal: Proposal) => void;
}

const ProposalLibraryCard: React.FC<ProposalLibraryCardProps> = ({ 
  proposal, 
  onView 
}) => {
  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "word":
        return "bg-blue-100 text-blue-800";
      case "powerpoint":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewClick = () => {
    if (onView) {
      onView(proposal);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full h-48 bg-gray-100">
        <img
          src={proposal.imageSrc}
          alt={proposal.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* File Type Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getFileTypeColor(proposal.fileType)}`}>
            {proposal.fileType}
          </span>
          {proposal.rating && (
            <div className="flex items-center gap-1">
              {renderStars(proposal.rating)}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 truncate">
          {proposal.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 overflow-hidden">
          <span className="line-clamp-2">{proposal.description}</span>
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {proposal.uses} uses
          </span>
          <button 
            onClick={handleViewClick}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-violet-600 bg-violet-50 rounded hover:bg-violet-100 transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Proposal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalLibraryCard;
