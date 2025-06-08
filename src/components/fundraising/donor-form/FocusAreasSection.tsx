
import React from "react";
import { Badge } from "@/components/ui/badge";
import { focusAreasData, getFocusAreaColor } from "@/data/focusAreaData";

interface FocusAreasSectionProps {
  selectedFocusAreas: string[];
  onToggleFocusArea: (areaName: string) => void;
}

export const FocusAreasSection: React.FC<FocusAreasSectionProps> = ({
  selectedFocusAreas,
  onToggleFocusArea,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Focus Areas</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {focusAreasData.map((area) => (
          <div
            key={area.id}
            onClick={() => onToggleFocusArea(area.name)}
            className={`cursor-pointer border rounded-sm p-3 text-center transition-colors ${
              selectedFocusAreas.includes(area.name)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Badge className={`${getFocusAreaColor(area.name)} text-xs rounded-sm`}>
              {area.name}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
