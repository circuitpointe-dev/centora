
import React from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProposalDetailHeaderProps {
  onBack: () => void;
  onReuse: () => void;
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

const ProposalDetailHeader: React.FC<ProposalDetailHeaderProps> = ({
  onBack,
  onReuse,
  title,
  description,
  buttonText = "Reuse Proposal",
  buttonIcon = <RotateCcw className="h-4 w-4 mr-2" />
}) => {
  return (
    <>
      {/* Header with Back button and Action button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Library</span>
        </button>

        <Button 
          onClick={onReuse}
          className="bg-black hover:bg-gray-800 text-white px-6"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      </div>

      {/* Title and Description */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </>
  );
};

export default ProposalDetailHeader;
