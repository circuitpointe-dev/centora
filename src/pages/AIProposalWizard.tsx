
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProgressSteps from "@/components/ai-wizard/ProgressSteps";
import Step1Upload from "@/components/ai-wizard/Step1Upload";
import Step2Selection from "@/components/ai-wizard/Step2Selection";
import Step3Generation from "@/components/ai-wizard/Step3Generation";
import Step4Review from "@/components/ai-wizard/Step4Review";
import SuccessScreen from "@/components/ai-wizard/SuccessScreen";

const AIProposalWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<string>("");
  const [generatedProposal, setGeneratedProposal] = useState({
    overview: "This business plan outlines a comprehensive strategy for...",
    narrative: "Lorem ipsum dolor sit amet consectetur. Placerat quam dignissim fusce praesent at stractum in vivamus magna. Quis ullamcorper tempor elit ullamcorper. Eleifend et porttitor aliquam morbi pellentesque ex. Ipsum sagittis malesuada dolor lorem molestie eleifend non elementum lorem.",
    budget: "$25,000,000",
    logframe: "Lorem ipsum dolor sit amet consectetur. Placerat quam dignissim fusce praesent at stractum in vivamus magna."
  });

  // Mock data for extracted keywords
  const extractedKeywords = [
    "Health Programs", "Community Development", "Funding Sources", "Budget Allocation", "Impact Assessment",
    "Governance Requirements", "Sustainability Goals", "Community Strategy", "Annual Reports",
    "Sponsorship Levels", "Community Outreach", "Fundraising Goals", "Stakeholder Engagement",
    "Financial Management", "Program Sustainability", "Networking Opportunities", "Grant Writing",
    "Budget Certification", "Cultural Efforts", "Training Events", "Program Sustainability"
  ];

  // Mock previous proposals data with future dates
  const previousProposals = [
    {
      id: "1",
      title: "Health Care Access Project",
      environment: "Environment",
      lastModified: "June 15, 2025",
      tags: ["Health", "Community", "Policy"]
    },
    {
      id: "2",
      title: "Health Care Access Project",
      environment: "Environment", 
      lastModified: "July 22, 2025",
      tags: ["Health", "Sustainability", "Policy"]
    },
    {
      id: "3",
      title: "Health Care Access Project",
      environment: "Environment",
      lastModified: "August 10, 2025",
      tags: ["Health", "Community", "Policy"]
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      setStep(5); // Success screen
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleProposalSelect = (proposalId: string) => {
    setSelectedProposal(proposalId);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return uploadedFile || pastedContent.trim().length > 0;
      case 2:
        return selectedProposal !== "";
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleViewInWorkspace = () => {
    navigate("/modules/fundraising/proposal-management");
  };

  const handleReturnToWizard = () => {
    setStep(1);
  };

  if (step === 5) {
    return (
      <div className="bg-[#f4f6f9] min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/modules/fundraising/proposal-management")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Proposal Management
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold">AI Proposal Wizard</h1>
            </div>
          </div>

          <SuccessScreen 
            onViewInWorkspace={handleViewInWorkspace}
            onReturnToWizard={handleReturnToWizard}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6f9] min-h-screen p-6">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/modules/fundraising/proposal-management")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proposal Management
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Bot className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">AI Proposal Wizard</h1>
          </div>
          <p className="text-gray-600">
            Let our AI help you create a compelling proposal in just a few steps.
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={step} />

        {/* Main Content */}
        <Card>
          <CardContent className="p-8 mx-8">
            {step === 1 && (
              <Step1Upload
                uploadedFile={uploadedFile}
                pastedContent={pastedContent}
                onFileUpload={handleFileUpload}
                onPastedContentChange={setPastedContent}
              />
            )}
            
            {step === 2 && (
              <Step2Selection
                extractedKeywords={extractedKeywords}
                selectedKeywords={selectedKeywords}
                previousProposals={previousProposals}
                selectedProposal={selectedProposal}
                onKeywordToggle={handleKeywordToggle}
                onProposalSelect={handleProposalSelect}
              />
            )}
            
            {step === 3 && (
              <Step3Generation generatedProposal={generatedProposal} />
            )}
            
            {step === 4 && <Step4Review />}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 4 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {step === 3 ? "Continue Generation" : "Proceed"}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Save and Continue
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIProposalWizard;
