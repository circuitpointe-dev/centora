
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Calendar, Mail, Edit, Type } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const autoFillFields = [
    { icon: <User className="w-5 h-5 text-[#38383899]" />, label: "Full Name", type: "name" },
    {
      icon: <Calendar className="w-4 h-4 text-[#38383899]" />,
      label: "Date Signed",
      type: "date"
    },
    {
      icon: <Mail className="w-[18px] h-[18px] text-[#38383899]" />,
      label: "Email",
      type: "email"
    },
    {
      icon: <Type className="w-5 h-5 text-[#38383899]" />,
      label: "Text",
      type: "text"
    },
  ];

  const handleFieldClick = (fieldType: string) => {
    const field = fieldTypes.find(f => f.type === fieldType);
    if (field) {
      onFieldSelect(field);
    }
  };

  const handleDragStart = (e: React.DragEvent, fieldType: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ fieldType }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <Card className="h-[500px] bg-white rounded-[5px] border">
      <div className="flex flex-col h-full">
        {/* Tab Header */}
        <div className="flex flex-col items-start gap-px px-2 py-0 w-full border-b">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="flex bg-transparent p-0 h-auto w-full justify-start">
              <TabsTrigger
                value="fields"
                className="inline-flex items-center justify-center p-2.5 border-b border-[#383838b2] data-[state=active]:border-b data-[state=inactive]:border-b-transparent data-[state=active]:text-black data-[state=inactive]:text-[#38383866] rounded-none font-['Inter'] font-medium text-sm leading-[21px] bg-transparent shadow-none"
              >
                Fields
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="inline-flex items-center justify-center p-2.5 data-[state=active]:border-b data-[state=active]:border-[#383838b2] data-[state=inactive]:border-b-transparent data-[state=active]:text-black data-[state=inactive]:text-[#38383866] rounded-none font-['Inter'] font-medium text-sm leading-[21px] bg-transparent shadow-none"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
            <TabsContent value="fields" className="h-full mt-0 p-4">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-7">
                  {/* Signer Section */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <div className="font-['Inter'] font-medium text-[#383838] text-sm leading-[21px]">
                      Signer
                    </div>
                    <Select>
                      <SelectTrigger className="flex items-center gap-2 p-2.5 w-full rounded-[5px] border border-solid border-[#ebebeb]">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <Avatar className="w-[22px] h-[22px] bg-[#e8eefd] rounded-[49.83px]">
                            <AvatarFallback className="font-['Inter'] font-medium text-[#1451ea] text-[10.2px] leading-[15.3px]">
                              CI
                            </AvatarFallback>
                          </Avatar>
                          <SelectValue
                            placeholder="Chioma Ike"
                            className="font-['Inter'] font-normal text-[#383838b2] text-sm leading-[21px]"
                          />
                        </div>
                      </SelectTrigger>
                    </Select>
                  </div>

                  {/* Signature Field Section */}
                  <div className="flex flex-col items-start gap-3 w-full">
                    <div className="font-['Inter'] font-medium text-[#383838] text-sm leading-[21px]">
                      Signature field
                    </div>
                    <div 
                      className={`flex items-center gap-3.5 px-2.5 py-1.5 w-full cursor-pointer rounded-[5px] ${
                        selectedField?.type === "signature" ? "bg-violet-100 border border-violet-300" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleFieldClick("signature")}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "signature")}
                    >
                      <Edit className="w-5 h-5 text-[#38383899]" />
                      <div className="font-['Inter'] font-medium text-[#38383899] text-sm leading-[21px]">
                        Signature
                      </div>
                    </div>
                  </div>

                  {/* Auto-fill Fields Section */}
                  <div className="flex flex-col items-start gap-3 w-full">
                    <div className="font-['Inter'] font-medium text-[#383838] text-sm leading-[21px]">
                      Auto-fill fields
                    </div>
                    <div className="flex flex-col items-start gap-4 w-full">
                      {autoFillFields.map((field, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3.5 px-2.5 py-1.5 w-full cursor-pointer rounded-[5px] ${
                            selectedField?.type === field.type ? "bg-violet-100 border border-violet-300" : "hover:bg-gray-50"
                          }`}
                          onClick={() => handleFieldClick(field.type)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, field.type)}
                        >
                          {field.icon}
                          <div className="font-['Inter'] font-medium text-[#38383899] text-sm leading-[21px]">
                            {field.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="documents" className="h-full mt-0 p-4">
              <ScrollArea className="h-full">
                <div className="text-center text-gray-500 text-xs py-8">
                  Document preview will appear here
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};
