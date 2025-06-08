
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  environment: string;
  lastModified: string;
  tags: string[];
}

interface Step2SelectionProps {
  extractedKeywords: string[];
  selectedKeywords: string[];
  previousProposals: Proposal[];
  selectedProposal: string;
  onKeywordToggle: (keyword: string) => void;
  onProposalSelect: (proposalId: string) => void;
}

const Step2Selection: React.FC<Step2SelectionProps> = ({
  extractedKeywords,
  selectedKeywords,
  previousProposals,
  selectedProposal,
  onKeywordToggle,
  onProposalSelect
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium text-violet-600 mb-2">Select Base Proposal</h3>
        <p className="text-gray-500">Review extracted keywords and select a base proposal to continue</p>
      </div>

      {/* Extracted Keywords */}
      <div>
        <h4 className="text-lg font-medium mb-4">Extracted keywords</h4>
        <div className="flex flex-wrap gap-2">
          {extractedKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => onKeywordToggle(keyword)}
              className={`px-3 py-1.5 rounded text-sm border transition-colors ${
                selectedKeywords.includes(keyword)
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      {/* Browse Previous Proposals */}
      <div>
        <h4 className="text-lg font-medium mb-4">Browse previous proposals</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previousProposals.map((proposal) => (
            <Card 
              key={proposal.id} 
              className={`cursor-pointer transition-all ${
                selectedProposal === proposal.id ? "ring-2 ring-violet-600" : ""
              }`}
              onClick={() => onProposalSelect(proposal.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{proposal.title}</h5>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                          {proposal.environment}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last modified: {proposal.lastModified}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proposal.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    variant={selectedProposal === proposal.id ? "default" : "outline"}
                    className="w-full"
                  >
                    {selectedProposal === proposal.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2Selection;
