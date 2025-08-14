
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2, MessageSquare } from "lucide-react";
import { AddNotesDialog } from "@/components/fundraising/AddNotesDialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useDonorNotes, useCreateDonorNote, useDeleteDonorNote } from "@/hooks/useDonorNotes";
import { format } from "date-fns";

interface CommunicationsSectionProps {
  donorId: string;
}

export const CommunicationsSection: React.FC<CommunicationsSectionProps> = ({ donorId }) => {
  const [addNotesOpen, setAddNotesOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  
  const { data: notes, isLoading } = useDonorNotes(donorId);
  const createNoteMutation = useCreateDonorNote();
  const deleteNoteMutation = useDeleteDonorNote();

  const handleAddNote = (noteContent: string) => {
    createNoteMutation.mutate({
      donorId,
      content: noteContent,
    });
  };

  const handleDeleteClick = (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (noteToDelete) {
      deleteNoteMutation.mutate(noteToDelete);
      setNoteToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || 'U';
  };

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        <h2 className="font-medium text-base text-gray-900">
          Communications & Notes
        </h2>

        <Card className="flex-1 overflow-hidden">
          {isLoading ? (
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-sm text-gray-500">Loading notes...</div>
            </CardContent>
          ) : !notes?.length ? (
            <CardContent className="p-6">
              <EmptyState
                icon={MessageSquare}
                title="No notes yet"
                description="Start the conversation by adding your first note about this donor."
                action={{
                  label: "Add First Note",
                  onClick: () => setAddNotesOpen(true),
                }}
              />
            </CardContent>
          ) : (
            <ScrollArea className="h-full w-full">
              <CardContent className="p-6 space-y-6">
                {notes.map((note) => (
                  <div key={note.id} className="flex gap-3 w-full group">
                    <div className="pt-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                          {getUserInitials(note.created_by)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-gray-700">
                          {note.created_by}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {format(new Date(note.created_at), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {note.content}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(note.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={deleteNoteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          )}
        </Card>

        {notes?.length ? (
          <Button
            variant="outline"
            className="w-full py-3 border-violet-600 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
            onClick={() => setAddNotesOpen(true)}
            disabled={createNoteMutation.isPending}
          >
            {createNoteMutation.isPending ? "Adding..." : "Add Notes"}
          </Button>
        ) : null}
      </div>

      <AddNotesDialog
        isOpen={addNotesOpen}
        onClose={() => setAddNotesOpen(false)}
        onSave={handleAddNote}
      />

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};
