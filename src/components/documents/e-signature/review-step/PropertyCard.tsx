
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { PropertyForm } from "./PropertyForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email" | "text";
  icon: React.ReactNode;
}

interface PropertyCardProps {
  selectedField: Field | null;
}

export const PropertyCard = ({ selectedField }: PropertyCardProps) => {
  const renderContent = () => {
    if (!selectedField) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-4">
          <Settings className="w-8 h-8 text-gray-300 mb-3" />
          <h4 className="text-xs font-medium text-gray-600 mb-2">
            Properties Panel
          </h4>
          <p className="text-xs text-gray-500 max-w-[150px] leading-[18px]">
            Select a field to configure its properties
          </p>
        </div>
      );
    }

    return <PropertyForm selectedField={selectedField} />;
  };

  return (
    <Card className="h-full bg-white rounded-[5px] border">
      <div className="flex flex-col h-full p-3">
        <ScrollArea className="h-full">{renderContent()}</ScrollArea>
      </div>
    </Card>
  );
};
