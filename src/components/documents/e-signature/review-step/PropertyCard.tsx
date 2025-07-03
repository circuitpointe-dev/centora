import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  onBack: () => void;
  onContinue: () => void;
  documentCount: number;
}

export const PropertyCard = ({ selectedField, onBack, onContinue, documentCount }: PropertyCardProps) => {
  const renderContent = () => {
    if (!selectedField) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-8">
          <Settings className="w-12 h-12 text-gray-300 mb-4" />
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Properties Panel
          </h4>
          <p className="text-sm text-gray-500 max-w-[200px] leading-[21px]">
            Select a field from the left panel to configure its properties and
            settings
          </p>
        </div>
      );
    }

    return <PropertyForm selectedField={selectedField} />;
  };

  return (
    <div className="col-span-3 h-full">
      <Card className="h-full bg-white rounded-[5px] border flex flex-col">
        <div className="flex-1 p-4 overflow-auto">
          <ScrollArea className="h-full">{renderContent()}</ScrollArea>
        </div>
        
        {/* Fixed Action Bar */}
        <div className="border-t bg-white p-4">
          <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-600 text-center">
              {documentCount} document{documentCount !== 1 ? 's' : ''} loaded
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={onBack} className="rounded-[5px] w-full">
                Back
              </Button>
              <Button 
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-[5px] w-full"
                onClick={onContinue}
              >
                Continue to Recipients
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
