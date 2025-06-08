
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
  type: 'text' | 'textarea';
}

interface PrefilledData {
  source?: string;
  template?: any;
  proposal?: any;
  creationContext?: any;
}

interface ProposalOverviewTabProps {
  prefilledData?: PrefilledData;
}

const ProposalOverviewTab: React.FC<ProposalOverviewTabProps> = ({ prefilledData }) => {
  const [summary, setSummary] = useState("");
  const [objectives, setObjectives] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  // Pre-fill data when component mounts
  useEffect(() => {
    if (prefilledData) {
      const sourceData = prefilledData.template || prefilledData.proposal;
      if (sourceData) {
        setSummary(sourceData.description || "");
        setObjectives(`Objectives for ${sourceData.title}`);
      }
    }
  }, [prefilledData]);

  const addNewField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: `Custom Field ${customFields.length + 1}`,
      value: "",
      type: 'text'
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
          <Label htmlFor="summary" className="text-sm font-medium">
            Summary <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="summary"
            placeholder="Enter project summary..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="mt-1 min-h-[100px]"
            required
          />
        </div>

        <div>
          <Label htmlFor="objectives" className="text-sm font-medium">
            Objectives <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="objectives"
            placeholder="Enter project objectives..."
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
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
            {field.type === 'textarea' ? (
              <Textarea
                value={field.value}
                onChange={(e) => updateField(field.id, { value: e.target.value })}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="min-h-[80px]"
              />
            ) : (
              <Input
                value={field.value}
                onChange={(e) => updateField(field.id, { value: e.target.value })}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}
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

export default ProposalOverviewTab;
