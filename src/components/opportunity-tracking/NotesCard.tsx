
import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Note {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
}

interface NotesCardProps {
  notes: Note[];
  onAddNote: () => void;
  sectionHeight?: string;
}

const NotesCard: React.FC<NotesCardProps> = ({
  notes,
  onAddNote,
  sectionHeight = "h-72"
}) => (
  <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight}`}>
    <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
      <FileText className="h-4 w-4" />
      Description / Notes
    </h3>
    <div className="flex justify-end mb-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onAddNote}
      >
        Add Note
      </Button>
    </div>
    <div className="flex-1 overflow-y-auto">
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-50 p-3 rounded border border-gray-200"
            >
              <div className="text-sm">{note.content}</div>
              <div className="mt-2 text-xs text-gray-500">
                Added on{" "}
                {format(
                  new Date(note.created_at),
                  "MMM dd, yyyy h:mm a"
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-500">
          No notes added yet
        </div>
      )}
    </div>
  </div>
);

export default NotesCard;
