
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
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
        <div className="text-center py-8">
          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h4 className="text-xs font-medium text-gray-600 mb-1">
            Nothing Selected
          </h4>
          <p className="text-xs text-gray-500">
            Select a field to make changes
          </p>
        </div>
      );
    }

    return <PropertyForm selectedField={selectedField} />;
  };

  return (
    <div className="col-span-3">
      <Card className="h-[500px] rounded-[5px] shadow-sm border">
        <CardContent className="p-3 h-full">
          <ScrollArea className="h-full">
            {renderContent()}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
