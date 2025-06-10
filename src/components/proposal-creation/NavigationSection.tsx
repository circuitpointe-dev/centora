
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavigationSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavigationSection: React.FC<NavigationSectionProps> = ({ activeTab, setActiveTab }) => {
  const navigationItems = [
    { id: "overview", label: "Overview" },
    { id: "narrative", label: "Narrative" },
    { id: "budget", label: "Budget" },
    { id: "logframe", label: "Logframe" },
    { id: "attachments", label: "Attachments" },
    { id: "team", label: "Team" },
  ];

  return (
    <div className="w-full pt-4 px-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
        <TabsList className="flex gap-[60px] bg-transparent h-auto p-0">
          {navigationItems.map((item) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="data-[state=active]:text-violet-600 data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=inactive]:text-[#383839a8] px-0 py-2 bg-transparent h-auto font-['Inter-Regular'] text-sm"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default NavigationSection;
