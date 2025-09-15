import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FieldData } from "../EditorNewPage";

interface PropertiesPanelProps {
  field: FieldData | null;
  onChange: (patch: Partial<FieldData>) => void;
  onRemove: () => void;
  onSign?: (field: FieldData) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ field, onChange, onRemove, onSign }) => {
  if (!field) {
    return (
      <div className="text-sm text-muted-foreground">Select a field to edit its properties.</div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">Field properties</h3>
        <p className="text-xs text-muted-foreground">Adjust settings of the selected field</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Label</label>
        <Input value={field.label} onChange={(e) => onChange({ label: e.target.value })} className="rounded-sm" />
      </div>
      <div className="space-y-2">
        <Button 
          variant="default" 
          className="w-full" 
          onClick={() => onSign?.(field)}
          size="sm"
        >
          {field.type === 'signature' ? '✍️ Sign Field' :
           field.type === 'name' ? '👤 Fill Name' :
           field.type === 'date' ? '📅 Set Date' :
           field.type === 'email' ? '📧 Enter Email' :
           '✏️ Fill Field'}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="destructive" onClick={onRemove} size="sm" className="flex-1">
            Remove
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onChange({ isConfigured: true })} 
            className="flex-1"
          >
            {field.isConfigured ? '✅' : 'Mark Done'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
