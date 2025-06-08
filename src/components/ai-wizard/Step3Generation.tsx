
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Edit, FileText, DollarSign, Grid } from "lucide-react";

interface GeneratedProposal {
  overview: string;
  narrative: string;
  budget: string;
  logframe: string;
}

interface Step3GenerationProps {
  generatedProposal: GeneratedProposal;
}

const Step3Generation: React.FC<Step3GenerationProps> = ({ generatedProposal }) => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", name: "Overview", icon: FileText, color: "purple" },
    { id: "narrative", name: "Narrative", icon: FileText, color: "red" },
    { id: "budget", name: "Budget", icon: DollarSign, color: "yellow" },
    { id: "logframe", name: "Logframe", icon: Grid, color: "green" }
  ];

  const getContent = () => {
    switch (activeSection) {
      case "overview":
        return generatedProposal.overview;
      case "narrative":
        return generatedProposal.narrative;
      case "budget":
        return generatedProposal.budget;
      case "logframe":
        return generatedProposal.logframe;
      default:
        return "";
    }
  };

  const getColorClass = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const colorMap = {
      purple: "bg-purple-600",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500"
    };
    return colorMap[section?.color as keyof typeof colorMap] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium text-violet-600 mb-2">Proposal Generation</h3>
        <p className="text-gray-500">Review and edit the AI-generated proposal sections</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar with sections */}
        <div className="w-48 space-y-2">
          <div className="mb-4">
            <h4 className="font-bold text-gray-600 mb-3">Sections</h4>
            <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <div
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      activeSection === section.id
                        ? "bg-gray-100 text-violet-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${getColorClass(section.id)}`}></div>
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          <div className="flex gap-6">
            {/* Original Content */}
            <div className="flex-1">
              <h4 className="font-bold text-gray-600 mb-4">Original Content</h4>
              <div className="bg-white rounded-lg shadow-md p-6 h-96 flex flex-col overflow-y-auto">
                <p className="text-gray-700 text-sm leading-relaxed">
                  This detailed fundraising proposal articulates our ambitious vision to uplift local communities through a variety of innovative and impactful programs. Our primary goal is to raise substantial funds that will significantly enhance educational resources, deliver essential services, and empower individuals to realize their full potential. We invite you to join us in this transformative journey to make a meaningful difference in the lives of many!
                </p>
              </div>
            </div>

            {/* AI Generated Content */}
            <div className="flex-1">
              <h4 className="font-bold text-gray-600 mb-4">AI Generated Content</h4>
              <div className="bg-white rounded-lg shadow-md p-6 h-96 flex flex-col">
                <div className="flex-1 mb-4">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-sm leading-relaxed">{getContent()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate Section
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Manually
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Generation;
