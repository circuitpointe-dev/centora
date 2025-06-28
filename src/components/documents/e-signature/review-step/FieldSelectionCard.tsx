
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, ChevronDown } from "lucide-react";
import { FieldItem } from "./FieldItem";

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email" | "text";
  icon: React.ReactNode;
}

interface FieldSelectionCardProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  fieldTypes: Field[];
  selectedField: Field | null;
  onFieldSelect: (field: Field) => void;
}

export const FieldSelectionCard = ({
  activeTab,
  onTabChange,
  fieldTypes,
  selectedField,
  onFieldSelect,
}: FieldSelectionCardProps) => {
  return (
    <div className="col-span-3">
      <Card className="h-full rounded-[5px] shadow-sm border">
        <CardContent className="p-3">
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-3 h-8 bg-transparent border border-gray-300 rounded-[5px] p-0">
              <TabsTrigger 
                value="fields" 
                className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-gray-300 data-[state=active]:rounded-[4px] data-[state=active]:mx-[1px] data-[state=active]:my-[1px] text-gray-600"
              >
                Fields
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-gray-300 data-[state=active]:rounded-[4px] data-[state=active]:mx-[1px] data-[state=active]:my-[1px] text-gray-600"
              >
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="space-y-3 mt-0">
              {/* Signer Section */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-gray-900">
                  Signer
                </h4>
                <div className="flex items-center gap-2 p-2 rounded-[5px] cursor-pointer hover:bg-gray-50">
                  <User className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-gray-700">
                    Chioma Ike
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400 ml-auto" />
                </div>
              </div>

              {/* Signature Field Section */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-gray-900">
                  Signature field
                </h4>
                <FieldItem
                  field={fieldTypes[1]}
                  isSelected={selectedField?.type === "signature"}
                  onClick={() => onFieldSelect(fieldTypes[1])}
                />
              </div>

              {/* Auto-fill Fields Section */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-gray-900">
                  Auto-fill fields
                </h4>
                <div className="space-y-1">
                  {fieldTypes.slice(2).map((field) => (
                    <FieldItem
                      key={field.id}
                      field={field}
                      isSelected={selectedField?.id === field.id}
                      onClick={() => onFieldSelect(field)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="text-center text-gray-500 text-xs py-8">
                Document preview will appear here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
