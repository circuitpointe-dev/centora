
import React from "react";
import { Label } from "@/components/ui/label";

interface ColorSelectionSectionProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorSelectionSection: React.FC<ColorSelectionSectionProps> = ({
  selectedColor,
  onColorChange,
}) => {
  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Blue", preview: "bg-blue-100" },
    { value: "bg-green-100 text-green-800", label: "Green", preview: "bg-green-100" },
    { value: "bg-orange-100 text-orange-800", label: "Orange", preview: "bg-orange-100" },
    { value: "bg-red-100 text-red-800", label: "Red", preview: "bg-red-100" },
    { value: "bg-purple-100 text-purple-800", label: "Purple", preview: "bg-purple-100" },
    { value: "bg-pink-100 text-pink-800", label: "Pink", preview: "bg-pink-100" },
  ];

  return (
    <div>
      <Label>Color</Label>
      <div className="flex flex-wrap gap-2 mt-2">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`w-8 h-8 rounded-sm border-2 ${
              selectedColor === color.value ? 'border-gray-900' : 'border-gray-300'
            } ${color.preview}`}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
};
