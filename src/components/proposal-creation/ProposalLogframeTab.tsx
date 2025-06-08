
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

interface ProposalLogframeTabProps {
  prefilledData?: PrefilledData;
}

const ProposalLogframeTab: React.FC<ProposalLogframeTabProps> = ({ prefilledData }) => {
  const [outcome, setOutcome] = useState("");
  const [indicator, setIndicator] = useState("");
  const [assumption, setAssumption] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Pre-fill data when component mounts
  useEffect(() => {
    if (prefilledData) {
      const sourceData = prefilledData.template || prefilledData.proposal;
      if (sourceData) {
        setOutcome(`Expected outcome from ${sourceData.title}`);
        setIndicator("Key performance indicators and measurable results");
        setAssumption("Project assumptions and risk mitigation strategies");
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
          <Label htmlFor="outcome" className="text-sm font-medium">
            Outcome <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="outcome"
            placeholder="Enter proposal outcome..."
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="mt-1 min-h-[100px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="indicator" className="text-sm font-medium">
            Indicator <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="indicator"
            placeholder="Enter proposal indicator..."
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
            className="mt-1 min-h-[100px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="assumption" className="text-sm font-medium">
            Assumption <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="assumption"
            placeholder="Enter proposal assumption..."
            value={assumption}
            onChange={(e) => setAssumption(e.target.value)}
            className="mt-1 min-h-[100px]"
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

export default ProposalLogframeTab;
