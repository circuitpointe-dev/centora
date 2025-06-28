
import React from "react";

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email" | "text";
  icon: React.ReactNode;
}

interface FieldItemProps {
  field: Field;
  isSelected: boolean;
  onClick: () => void;
}

export const FieldItem = ({ field, isSelected, onClick }: FieldItemProps) => {
  const getBackgroundColor = () => {
    if (field.type === "signature") return "text-violet-600";
    return "text-gray-600";
  };

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-[5px] cursor-pointer hover:bg-gray-50 ${
        isSelected ? "bg-violet-100 border border-violet-300" : ""
      }`}
      onClick={onClick}
    >
      <span className={`w-3 h-3 ${getBackgroundColor()}`}>
        {field.icon}
      </span>
      <span className="text-xs text-gray-700">
        {field.name}
      </span>
    </div>
  );
};
