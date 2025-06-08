
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

export const AddNotesDialog: React.FC<AddNotesDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (note.trim()) {
      onSave(note.trim());
      setNote('');
      onClose();
    }
  };

  const handleCancel = () => {
    setNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="note" className="text-gray-700">
              Note
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your note here..."
              className="mt-1 min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!note.trim()}>
              Save Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
