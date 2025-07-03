import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Calendar, Mail, Edit, Type, Eye, Settings, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FieldData {
  id: string;
  type: "signature" | "name" | "date" | "email" | "text";
  label: string;
  value?: string;
  isConfigured: boolean;
  properties?: {
    required?: boolean;
    width?: number;
    height?: number;
    fontSize?: number;
    placeholder?: string;
  };
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
    { id: "date", type: "date", label: "Date Signed", isConfigured: false },
    { id: "email", type: "email", label: "Email", isConfigured: false },
    { id: "text", type: "text", label: "Text", isConfigured: false }
  ]);
  
  const [editingField, setEditingField] = useState<FieldData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "signature": return <Edit className="w-5 h-5 text-[#38383899]" />;
      case "name": return <User className="w-5 h-5 text-[#38383899]" />;
      case "date": return <Calendar className="w-4 h-4 text-[#38383899]" />;
      case "email": return <Mail className="w-[18px] h-[18px] text-[#38383899]" />;
      case "text": return <Type className="w-5 h-5 text-[#38383899]" />;
      default: return null;
    }
  };

  const handleDragStart = (e: React.DragEvent, field: FieldData) => {
    if (!field.isConfigured) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("application/json", JSON.stringify({ fieldType: field.type, fieldData: field }));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleEditField = (field: FieldData) => {
    setEditingField(field);
    setIsDialogOpen(true);
  };

  const handleSaveField = () => {
    if (!editingField) return;
    
    setFields(prev => prev.map(field => 
      field.id === editingField.id 
        ? { ...editingField, isConfigured: true }
        : field
    ));
    setIsDialogOpen(false);
    setEditingField(null);
  };

  const handleFieldPropertyChange = (property: string, value: any) => {
    if (!editingField) return;
    
    setEditingField(prev => prev ? {
      ...prev,
      properties: {
        ...prev.properties,
        [property]: value
      }
    } : null);
  };

  return (
    <div className="col-span-3 h-full">
      <Card className="h-full bg-white rounded-[5px] border flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-start gap-px px-4 py-3 w-full border-b">
          <h3 className="font-medium text-[#383838] text-sm leading-[21px]">
            Field Editor
          </h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <ScrollArea className="h-full">
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

              {/* Field Components */}
              <div className="flex flex-col items-start gap-3 w-full">
                <div className="font-medium text-[#383838] text-sm leading-[21px]">
                  Signature Fields
                </div>
                <div className="flex flex-col items-start gap-4 w-full">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 w-full rounded-[5px] border ${
                        field.isConfigured 
                          ? "border-green-200 bg-green-50 cursor-grab" 
                          : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                      } hover:border-violet-300`}
                      draggable={field.isConfigured}
                      onDragStart={(e) => handleDragStart(e, field)}
                    >
                      <div className="flex items-center gap-3.5">
                        {getFieldIcon(field.type)}
                        <div className="font-medium text-[#38383899] text-sm leading-[21px]">
                          {field.label}
                        </div>
                      </div>
                      <Dialog open={isDialogOpen && editingField?.id === field.id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleEditField(field)}
                          >
                            {field.isConfigured ? <Settings className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Configure {field.label} Field</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="label">Field Label</Label>
                              <Input
                                id="label"
                                value={editingField?.label || ""}
                                onChange={(e) => setEditingField(prev => prev ? { ...prev, label: e.target.value } : null)}
                                placeholder="Enter field label"
                              />
                            </div>
                            
                            {field.type === "text" && (
                              <div>
                                <Label htmlFor="placeholder">Placeholder Text</Label>
                                <Input
                                  id="placeholder"
                                  value={editingField?.properties?.placeholder || ""}
                                  onChange={(e) => handleFieldPropertyChange("placeholder", e.target.value)}
                                  placeholder="Enter placeholder text"
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="width">Width (px)</Label>
                                <Input
                                  id="width"
                                  type="number"
                                  value={editingField?.properties?.width || 150}
                                  onChange={(e) => handleFieldPropertyChange("width", parseInt(e.target.value))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="height">Height (px)</Label>
                                <Input
                                  id="height"
                                  type="number"
                                  value={editingField?.properties?.height || 30}
                                  onChange={(e) => handleFieldPropertyChange("height", parseInt(e.target.value))}
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSaveField} className="bg-violet-600 hover:bg-violet-700">
                                Save Field
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
    </div>
  );
};