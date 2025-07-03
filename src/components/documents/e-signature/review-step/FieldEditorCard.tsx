import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, CalendarIcon, Mail, Edit, Type, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface FieldEditorCardProps {
  onPreview: () => void;
  onContinue: () => void;
  documentCount: number;
}

export const FieldEditorCard = ({ onPreview, onContinue, documentCount }: FieldEditorCardProps) => {
  const [fields, setFields] = useState<FieldData[]>([
    { id: "signature", type: "signature", label: "Signature", isConfigured: false },
    { id: "name", type: "name", label: "Full Name", isConfigured: false },
    { id: "date", type: "date", label: "Date", isConfigured: false },
    { id: "email", type: "email", label: "Email", isConfigured: false },
    { id: "text", type: "text", label: "Text", isConfigured: false }
  ]);
  
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

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

  const handleDragStart = (e: React.DragEvent, field: FieldData) => {
    if (!field.isConfigured) {
      e.preventDefault();
      return;
    }
    console.log("Dragging field:", field);
    e.dataTransfer.setData("application/json", JSON.stringify({ fieldType: field.type, fieldData: field }));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, value, isConfigured: true }
        : field
    ));
  };

  const handleSignatureCreate = (signatureData: SignatureData) => {
    if (editingFieldId) {
      handleFieldChange(editingFieldId, signatureData);
      setEditingFieldId(null);
    }
    setShowSignatureDialog(false);
  };

  const openSignatureDialog = (fieldId: string) => {
    setEditingFieldId(fieldId);
    setShowSignatureDialog(true);
  };

  const renderFieldInput = (field: FieldData) => {
    const commonClasses = "w-full rounded-[5px] border border-gray-200 p-2 text-sm";
    
    switch (field.type) {
      case "signature":
        return (
          <Button
            variant="outline"
            onClick={() => openSignatureDialog(field.id)}
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
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder="Enter full name"
            className={commonClasses}
          />
        );

      case "email":
        return (
          <Input
            type="email"
            value={field.value as string || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
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
                onSelect={(date) => date && handleFieldChange(field.id, date)}
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
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder="Enter text"
            className={commonClasses}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="col-span-3 h-full">
      <Card className="h-full bg-white rounded-[5px] border flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-start gap-px px-4 py-4 w-full border-b">
          <h3 className="font-bold text-gray-900 text-lg leading-6">
            Signing Options
          </h3>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-4">
            <div className="flex flex-col gap-6">
              {/* Signer Section */}
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="font-medium text-gray-800 text-sm leading-[21px]">
                  Signer
                </div>
                <div className="flex items-center gap-2 p-2.5 w-full rounded-[5px] border border-gray-200 bg-gray-50">
                  <Avatar className="w-[22px] h-[22px] bg-blue-100 rounded-full">
                    <AvatarFallback className="font-medium text-blue-600 text-xs">
                      CI
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-normal text-gray-700 text-sm">
                    Chioma Ike
                  </span>
                </div>
              </div>

              {/* Field Components */}
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
                        onDragStart={(e) => handleDragStart(e, field)}
                      >
                        {renderFieldInput(field)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
        
        {/* Fixed Action Bar */}
        <div className="border-t bg-white p-4">
          <div className="flex flex-col gap-3">
            <div className="text-xs text-gray-600 text-center">
              {documentCount} document{documentCount !== 1 ? 's' : ''} loaded
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={onPreview} className="rounded-[5px] w-full">
                <Eye className="w-4 h-4 mr-2" />
                Preview
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

      {/* Signature Dialog */}
      <SignatureDialog
        open={showSignatureDialog}
        onOpenChange={setShowSignatureDialog}
        onSave={handleSignatureCreate}
      />
    </div>
  );
};