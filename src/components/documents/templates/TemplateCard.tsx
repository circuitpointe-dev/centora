import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Edit2, Eye } from "lucide-react";

interface TemplateCardProps {
  id: string;
  title: string;
  category: string;
  department: string;
  lastUpdated: string;
  image?: string;
  onUseTemplate?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  category,
  department,
  lastUpdated,
  image,
  onUseTemplate,
  onView,
  onDownload,
  onEdit
}) => {
  return (
    <Card className="w-[325px] overflow-hidden rounded-[5px] pb-8">
      <div className="relative w-full h-[120px] overflow-hidden">
        <img
          className="w-full h-full object-cover"
          alt={`${title} Preview`}
          src={image || "/placeholder.svg"}
        />
      </div>

      <CardContent className="flex flex-col items-start gap-6 pt-6 px-4">
        <div className="flex flex-col w-full items-start gap-2">
          <h3 className="font-medium text-base text-[#383838e6] tracking-normal">
            {title}
          </h3>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#38383899]">{category}</span>
            <div className="flex items-center gap-[7px]">
              <div className="w-[5px] h-[5px] bg-[#38383866] rounded-[2.5px]" />
              <span className="text-sm text-[#38383899]">{department}</span>
            </div>
          </div>

          <p className="text-sm text-[#38383899]">Last updated {lastUpdated}</p>
        </div>

        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            className="h-auto px-5 py-3 rounded-[5px] border-[#e0e0e0] text-[#38383899] font-medium text-sm"
            onClick={() => onUseTemplate?.(id)}
          >
            Use as Template
          </Button>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-2.5"
              onClick={() => onView?.(id)}
            >
              <Eye className="w-5 h-5 text-gray-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-2.5"
              onClick={() => onDownload?.(id)}
            >
              <Download className="w-5 h-5 text-gray-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-2.5"
              onClick={() => onEdit?.(id)}
            >
              <Edit2 className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};