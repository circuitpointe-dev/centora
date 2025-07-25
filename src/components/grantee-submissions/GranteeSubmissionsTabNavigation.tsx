import React from "react";
import { FileText, BarChart3, Shield, DollarSign } from "lucide-react";

interface GranteeSubmissionsTabNavigationProps {
  activeTab: "grantee-submissions" | "reporting-tracker" | "compliance-monitor" | "disbursement-monitor";
  onTabChange: (tab: "grantee-submissions" | "reporting-tracker" | "compliance-monitor" | "disbursement-monitor") => void;
}

const tabDefs = [
  {
    label: "Grantee Submissions",
    value: "grantee-submissions",
    icon: <FileText size={16} />,
  },
  {
    label: "Reporting Tracker",
    value: "reporting-tracker",
    icon: <BarChart3 size={16} />,
  },
  {
    label: "Compliance Monitor",
    value: "compliance-monitor",
    icon: <Shield size={16} />,
  },
  {
    label: "Disbursement Monitor",
    value: "disbursement-monitor",
    icon: <DollarSign size={16} />,
  },
];

export const GranteeSubmissionsTabNavigation: React.FC<GranteeSubmissionsTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex justify-between mb-6">
      {tabDefs.map((tab) => (
        <button
          key={tab.value}
          onClick={() =>
            onTabChange(tab.value as any)
          }
          className={`text-base font-medium px-4 py-3 rounded transition flex items-center gap-2 ${
            activeTab === tab.value
              ? "text-violet-700 border-b-2 border-violet-700 bg-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};