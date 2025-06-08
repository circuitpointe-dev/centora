
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReminderFormProps {
  open: boolean;
  date?: Date;
  initialValue: string;
  onClose: () => void;
  onSave: (text: string) => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({
  open,
  date,
  onClose,
  onSave,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue || "");

  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue, open]);

  if (!date) return null;

  const formatted = date.toLocaleDateString("en-NG", {weekday:"long", month:"short", day:"numeric", year:"numeric"});

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <div className="mb-4">
          <div className="font-semibold text-base mb-1">Set Reminder</div>
          <div className="text-xs text-gray-600">{formatted}</div>
        </div>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm mb-3"
          rows={3}
          placeholder="Reminder details"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <div className="flex justify-between">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={() => onSave(value)}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ReminderForm;
