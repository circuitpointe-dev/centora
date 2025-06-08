
import React from "react";
import { Calendar, FileText, Menu } from "lucide-react";

const statData = [
  {
    label: "Proposals in Progress",
    value: 8,
    icon: <FileText className="text-white" size={20} />,
    bg: "bg-[#efe8fd]",
    iconBg: "bg-[#ad89f4]",
  },
  {
    label: "Pending Reviews",
    value: 12,
    icon: <Menu className="text-white" size={20} />,
    bg: "bg-[#dce3ef]",
    iconBg: "bg-[#4f73af]",
  },
  {
    label: "Upcoming Deadlines",
    value: 4,
    icon: <Calendar className="text-white" size={20} />,
    bg: "bg-[#fce3f0]",
    iconBg: "bg-[#ed5da8]",
  },
  {
    label: "Archived Proposals",
    value: 26,
    icon: <FileText className="text-white" size={20} />,
    bg: "bg-[#fef3cd]",
    iconBg: "bg-[#fac305]",
  },
];

const StatCards: React.FC = () => (
  <div className="flex flex-wrap gap-5 justify-between mt-8">
    {statData.map((stat, idx) => (
      <div
        key={idx}
        className={`w-full sm:w-[230px] h-36 rounded shadow-sm ${stat.bg} flex flex-col items-center justify-center relative`}
      >
        <div className={`w-9 h-9 flex items-center justify-center rounded-full ${stat.iconBg} mb-2`}>
          {stat.icon}
        </div>
        <div className="text-[22px] font-semibold text-[#373839] mb-0.5 leading-tight">
          {stat.value}
        </div>
        <div className="text-sm text-gray-500 text-center">{stat.label}</div>
      </div>
    ))}
  </div>
);

export default StatCards;
