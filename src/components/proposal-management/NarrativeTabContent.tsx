
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

type CustomField = {
  id: string;
  name: string;
  value: string;
};

type Props = {
  narrativeFields: CustomField[];
  onAddField: () => void;
  onRemoveField: (fieldId: string) => void;
  onFieldValueChange: (fieldId: string, value: string) => void;
};

const NarrativeTabContent: React.FC<Props> = ({
  narrativeFields,
  onAddField,
  onRemoveField,
  onFieldValueChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Project Narrative</Label>
        <Textarea
          placeholder="Enter detailed project narrative..."
          className="mt-2 min-h-[200px]"
        />
      </div>
      <div>
        <Label>Work Plan</Label>
        <Textarea
          placeholder="Enter detailed work plan..."
          className="mt-2 min-h-[200px]"
        />
      </div>
      
      {/* Custom Fields */}
      {narrativeFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={field.id}>{field.name}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveField(field.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            id={field.id}
            value={field.value}
            onChange={(e) => onFieldValueChange(field.id, e.target.value)}
            placeholder={`Enter ${field.name?.toLowerCase() || 'value'}...`}
            className="min-h-[120px]"
          />
        </div>
      ))}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
        onClick={onAddField}
      >
        <Plus className="w-4 h-4" />
        Add New Field
      </Button>
    </div>
  );
};

export default NarrativeTabContent;
