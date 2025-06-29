
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
        <div className="flex flex-col items-center justify-center h-full text-center py-8">
          <Settings className="w-12 h-12 text-gray-300 mb-4" />
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Properties Panel
          </h4>
          <p className="text-xs text-gray-500 max-w-[200px]">
            Select a field from the left panel to configure its properties and settings
          </p>
        </div>
      );
    }

    return <PropertyForm selectedField={selectedField} />;
  };

  return (
    <div className="col-span-3">
      <Card className="h-[500px] rounded-[5px] shadow-sm border bg-white">
        <CardContent className="p-4 h-full">
          <ScrollArea className="h-full">
            {renderContent()}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
