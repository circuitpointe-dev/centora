
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
  fieldTypes: Field[];
  selectedField: Field | null;
  onFieldSelect: (field: Field) => void;
}

export const FieldSelectionCard = ({
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
    <Card className="h-full bg-white rounded-[5px] border">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col items-start gap-px px-4 py-3 w-full border-b">
          <h3 className="font-medium text-[#383838] text-sm leading-[21px]">
            Fields
          </h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-col gap-6">
            {/* Signer Section */}
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="font-medium text-[#383838] text-sm leading-[21px]">
                Signer
              </div>
              <Select disabled>
                <SelectTrigger className="flex items-center gap-2 p-2.5 w-full rounded-[5px] border border-solid border-[#ebebeb]">
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <Avatar className="w-[22px] h-[22px] bg-[#e8eefd] rounded-[49.83px]">
                      <AvatarFallback className="font-['Inter'] font-medium text-[#1451ea] text-[10.2px] leading-[15.3px]">
                        CI
                      </AvatarFallback>
                    </Avatar>
                    <SelectValue
                      placeholder="Chioma Ike"
                      className="font-normal text-[#383838b2] text-sm leading-[21px]"
                    />
                  </div>
                </SelectTrigger>
              </Select>
            </div>

            {/* Signature Field Section */}
            <div className="flex flex-col items-start gap-3 w-full">
              <div className="font-medium text-[#383838] text-sm leading-[21px]">
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
                <div className="font-medium text-[#38383899] text-sm leading-[21px]">
                  Signature
                </div>
              </div>
            </div>

            {/* Auto-fill Fields Section */}
            <div className="flex flex-col items-start gap-3 w-full">
              <div className="font-medium text-[#383838] text-sm leading-[21px]">
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
                    <div className="font-medium text-[#38383899] text-sm leading-[21px]">
                      {field.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
