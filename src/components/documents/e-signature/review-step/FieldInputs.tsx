
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, CalendarIcon, Mail, Edit, Type } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SignatureDialog } from "./SignatureDialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SignatureData {
  type: string;
  data: string;
}

interface FieldData {
  id: string;
  type: "signature" | "name" | "date" | "email" | "text";
  label: string;
  value?: string | Date | SignatureData;
  isConfigured: boolean;
}

interface FieldInputsProps {
  fields: FieldData[];
  onFieldChange: (fieldId: string, value: any) => void;
  onDragStart: (e: React.DragEvent, field: FieldData) => void;
  showSignatureDialog: boolean;
  onShowSignatureDialog: (show: boolean) => void;
  onSignatureCreate: (signatureData: SignatureData) => void;
  editingFieldId: string | null;
  onOpenSignatureDialog: (fieldId: string) => void;
}

export const FieldInputs: React.FC<FieldInputsProps> = ({
  fields,
  onFieldChange,
  onDragStart,
  showSignatureDialog,
  onShowSignatureDialog,
  onSignatureCreate,
  editingFieldId,
  onOpenSignatureDialog
}) => {
  const getFieldIcon = (type: string) => {
    switch (type) {
      case "signature": return <Edit className="w-5 h-5 text-gray-600" />;
      case "name": return <User className="w-5 h-5 text-gray-600" />;
      case "date": return <CalendarIcon className="w-4 h-4 text-gray-600" />;
      case "email": return <Mail className="w-[18px] h-[18px] text-gray-600" />;
      case "text": return <Type className="w-5 h-5 text-gray-600" />;
      default: return null;
    }
  };

  const renderFieldInput = (field: FieldData) => {
    const commonClasses = "w-full rounded-[5px] border border-gray-200 p-2 text-sm";
    
    switch (field.type) {
      case "signature":
        return (
          <Button
            variant="outline"
            onClick={() => onOpenSignatureDialog(field.id)}
            className={cn(commonClasses, "h-auto min-h-[40px] justify-start")}
          >
            {field.value ? (
              <span className="text-green-600">Signature created</span>
            ) : (
              <span className="text-gray-500">Click to create signature</span>
            )}
          </Button>
        );

      case "name":
        return (
          <Input
            value={field.value as string || ""}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder="Enter full name"
            className={commonClasses}
          />
        );

      case "email":
        return (
          <Input
            type="email"
            value={field.value as string || ""}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder="Enter email address"
            className={commonClasses}
          />
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  commonClasses,
                  "justify-start text-left font-normal h-auto",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value as Date}
                onSelect={(date) => date && onFieldChange(field.id, date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case "text":
        return (
          <Input
            value={field.value as string || ""}
            onChange={(e) => onFieldChange(field.id, e.target.value)}
            placeholder="Enter text"
            className={commonClasses}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-4 w-full">
        <div className="font-medium text-gray-800 text-sm leading-[21px]">
          Fields
        </div>
        <div className="flex flex-col items-start gap-4 w-full">
          {fields.map((field) => (
            <div key={field.id} className="w-full space-y-2">
              <div className="flex items-center gap-2">
                {getFieldIcon(field.type)}
                <Label className="font-medium text-gray-700 text-sm">
                  {field.label}
                </Label>
              </div>
              
              <div
                className={cn(
                  "border rounded-[5px] p-2",
                  field.isConfigured 
                    ? "border-green-200 bg-green-50 cursor-grab" 
                    : "border-gray-200 bg-white"
                )}
                draggable={field.isConfigured}
                onDragStart={(e) => onDragStart(e, field)}
              >
                {renderFieldInput(field)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={onShowSignatureDialog}
        onSave={onSignatureCreate}
      />
    </>
  );
};
