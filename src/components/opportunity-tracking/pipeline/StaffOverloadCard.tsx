
import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// Demo: Hardcoded overloaded staff sample for development
const overloadedStaff = [
  {
    name: "Amina Yusuf",
    title: "Finance Manager",
    outstanding: 2,
  },
  {
    name: "Fatima Bello",
    title: "Project Manager",
    outstanding: 1,
  },
];

const StaffOverloadCard: React.FC = () => (
  <Card className="p-6 h-full flex flex-col">
    <div className="font-semibold mb-4">Staff Overloaded</div>
    <div className="space-y-4 flex-1">
      {overloadedStaff.map(s => (
        <div key={s.name} className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <AlertCircle className="text-red-500 w-4 h-4 mr-1" />
            <span className="font-medium">{s.name}</span>
            <span className="ml-1 text-xs text-gray-500">({s.title})</span>
          </div>
          <div className="font-bold text-red-600">{s.outstanding}</div>
        </div>
      ))}
    </div>
  </Card>
);

export default StaffOverloadCard;
