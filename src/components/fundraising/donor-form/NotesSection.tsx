
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  note: string;
  onNoteChange: (note: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  note,
  onNoteChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Notes (Optional)</h3>
      <Textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Add any additional notes or comments..."
        rows={3}
        className="resize-none"
      />
    </div>
  );
};
