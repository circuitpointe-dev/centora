
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ActionButtonsProps {
  onPreview: () => void;
  onContinue: () => void;
  documentCount: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPreview,
  onContinue,
  documentCount
}) => {
  return (
    <div className="border-t bg-white p-4">
      <div className="flex flex-col gap-3">
        <div className="text-xs text-gray-600 text-center">
          {documentCount} document{documentCount !== 1 ? 's' : ''} loaded
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={onPreview} className="rounded-[5px] w-full">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-[5px] w-full"
            onClick={onContinue}
          >
            Continue to Recipients
          </Button>
        </div>
      </div>
    </div>
  );
};
