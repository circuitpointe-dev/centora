
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddField: (fieldName: string) => void;
};

const AddFieldDialog: React.FC<Props> = ({ open, onOpenChange, onAddField }) => {
  const [fieldName, setFieldName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldName.trim()) {
      onAddField(fieldName.trim());
      setFieldName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Add New Field</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="field-name">Field Name</Label>
            <Input
              id="field-name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Enter field name..."
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Field</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldDialog;
