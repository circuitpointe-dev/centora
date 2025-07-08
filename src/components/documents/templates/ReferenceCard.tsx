import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye } from "lucide-react";

interface ReferenceCardProps {
  id: string;
  name: string;
  category: string;
  lastUpdated: string;
  size: string;
  image?: string;
  onPreview?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({
  id,
  name,
  category,
  lastUpdated,
  size,
  image,
  onPreview,
  onDownload
}) => {
  return (
    <Card className="w-[280px] overflow-hidden rounded-[5px] pb-4">
      <div className="relative w-full h-[120px] overflow-hidden">
        <img
          className="w-full h-full object-cover"
          alt={`${name} Preview`}
          src={image || "/placeholder.svg"}
        />
      </div>

      <CardContent className="flex flex-col items-start gap-4 pt-4 px-4">
        <div className="flex flex-col w-full items-start gap-2">
          <h3 className="font-medium text-base text-[#383838e6] tracking-normal">
            {name}
          </h3>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#38383899]">{category}</span>
            <div className="flex items-center gap-[7px]">
              <div className="w-[5px] h-[5px] bg-[#38383866] rounded-[2.5px]" />
              <span className="text-sm text-[#38383899]">{size}</span>
            </div>
          </div>

          <p className="text-sm text-[#38383899]">Last updated {lastUpdated}</p>
        </div>

        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            className="h-auto px-5 py-3 rounded-[5px] border-[#e0e0e0] text-[#38383899] font-medium text-sm"
            onClick={() => onPreview?.(id)}
          >
            Preview
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="p-2.5"
            onClick={() => onDownload?.(id)}
          >
            <Download className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};