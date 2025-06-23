
import React from "react";
import { BarChart, FileText } from "lucide-react";

interface AnalyticsTabNavigationProps {
  activeTab: "generate-report" | "analytics";
  onTabChange: (tab: "generate-report" | "analytics") => void;
}

const tabDefs = [
  {
    label: "Analytics",
    value: "analytics",
    icon: <BarChart size={16} />,
  },
  {
    label: "Generate Report",
    value: "generate-report",
    icon: <FileText size={16} />,
  },
];

export const AnalyticsTabNavigation: React.FC<AnalyticsTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-3 mb-6">
      {tabDefs.map((tab) => (
        <button
          key={tab.value}
          onClick={() =>
            onTabChange(tab.value as "generate-report" | "analytics")
          }
          className={`text-base font-medium px-3 py-2 rounded transition flex items-center gap-2 ${
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
