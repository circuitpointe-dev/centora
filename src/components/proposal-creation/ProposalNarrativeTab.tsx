
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface PrefilledData {
  source?: string;
  template?: any;
  proposal?: any;
  creationContext?: any;
}

interface ProposalNarrativeTabProps {
  prefilledData?: PrefilledData;
}

const ProposalNarrativeTab: React.FC<ProposalNarrativeTabProps> = ({ prefilledData }) => {
  const [narrative, setNarrative] = useState("");
  const [methodology, setMethodology] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Pre-fill data when component mounts
  useEffect(() => {
    if (prefilledData) {
      const sourceData = prefilledData.template || prefilledData.proposal;
      if (sourceData) {
        setNarrative(`Narrative content from ${sourceData.title}`);
        setMethodology("Methodology and approach for the project implementation");
      }
    }
  }, [prefilledData]);

  const addNewField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: `Custom Field ${customFields.length + 1}`,
      value: ""
    };
    setCustomFields([...customFields, newField]);
  };

  const removeField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(customFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="narrative" className="text-sm font-medium">
            Narrative <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="narrative"
            placeholder="Enter proposal narrative..."
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            className="mt-1 min-h-[200px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="methodology" className="text-sm font-medium">
            Methodology <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="methodology"
            placeholder="Enter methodology and approach..."
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            className="mt-1 min-h-[150px]"
            required
          />
        </div>

        {customFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Input
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
                className="font-medium text-sm"
                placeholder="Field label"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeField(field.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              value={field.value}
              onChange={(e) => updateField(field.id, { value: e.target.value })}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              className="min-h-[80px]"
            />
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addNewField}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Field
        </Button>
      </div>
    </div>
  );
};

export default ProposalNarrativeTab;
