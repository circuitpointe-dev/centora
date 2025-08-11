import React from "react";
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
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Fields</h3>
      <div className="grid grid-cols-2 gap-2">
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
              variant="outline"
              className="w-full justify-center rounded-sm"
              onClick={() => onPick(it.type)}
            >
              {it.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldPalette;
