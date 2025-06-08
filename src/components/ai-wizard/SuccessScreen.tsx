
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText } from "lucide-react";

interface SuccessScreenProps {
  onViewInWorkspace: () => void;
  onReturnToWizard: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  onViewInWorkspace,
  onReturnToWizard
}) => {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Proposal Exported Successfully!</h3>
        <p className="text-gray-600">Your AI-generated proposal has been sent to the Proposal Builder</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg inline-block">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Female Education Proposal</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          className="w-full bg-violet-600 hover:bg-violet-700"
          onClick={onViewInWorkspace}
        >
          View in Proposal Workspace →
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onReturnToWizard}
        >
          Return to AI Proposal Wizard
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
