import React from "react";
import { Calendar, FileText, Menu, Plus } from "lucide-react";

const tabs = [
  { label: "Overview", icon: Menu },
  { label: "Past Proposal Library", icon: FileText },
  { label: "Browse Templates", icon: FileText },
];

type Props = {
  activeTab: number;
  setActiveTab: (n: number) => void;
  onOpenCreate: () => void;
};

const ProposalTabs: React.FC<Props> = ({ activeTab, setActiveTab, onOpenCreate }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`flex items-center gap-1.5 px-3 py-2 text-base font-medium rounded-t
              border-transparent border-b-[3px]
              ${
                activeTab === idx
                  ? "text-violet-600 border-violet-600 bg-white"
                  : "text-[#383839a6] border-transparent hover:bg-gray-100"
              }
            `}
          >
            <tab.icon size={18} className={activeTab === idx ? "text-violet-600" : "text-gray-400"} />
            {tab.label}
          </button>
        ))}
      </div>
      <button
        className="inline-flex items-center gap-2 bg-violet-600 rounded px-5 py-2 text-white font-medium text-sm hover:bg-violet-700 shadow"
        onClick={onOpenCreate}
      >
        <Plus size={20} />
        Create Proposal
      </button>
    </div>
  );
};

export default ProposalTabs;
