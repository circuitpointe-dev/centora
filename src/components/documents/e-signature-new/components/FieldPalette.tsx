import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { FieldType } from "../EditorNewPage";

interface FieldPaletteProps {
  onPick: (type: FieldType) => void;
}

const items: { type: FieldType; label: string; hint?: string }[] = [
  { type: "signature", label: "Signature" },
  { type: "name", label: "Name" },
  { type: "date", label: "Date" },
  { type: "email", label: "Email" },
  { type: "text", label: "Text" },
];

export const FieldPalette: React.FC<FieldPaletteProps> = ({ onPick }) => {
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);

  const handleFieldClick = (type: FieldType) => {
    setSelectedField(type);
    onPick(type);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Fields</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Click a field type, then click on the PDF to place it
      </p>
      <div className="grid grid-cols-1 gap-2">
        {items.map((it) => (
          <div
            key={it.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "application/json",
                JSON.stringify({ fieldType: it.type, fieldData: { type: it.type, label: it.label } })
              );
            }}
          >
            <Button
              type="button"
              variant={selectedField === it.type ? "default" : "outline"}
              className="w-full justify-start rounded-sm"
              onClick={() => handleFieldClick(it.type)}
            >
              {it.label}
              {selectedField === it.type && (
                <span className="ml-auto text-xs opacity-70">Click on PDF</span>
              )}
            </Button>
          </div>
        ))}
      </div>
      
      {selectedField && (
        <div className="mt-3 p-2 bg-blue-50 rounded-sm text-xs text-blue-700">
          <p className="font-medium">💡 Tip:</p>
          <p>Click anywhere on the document to place your {selectedField} field</p>
        </div>
      )}
    </div>
  );
};

export default FieldPalette;
