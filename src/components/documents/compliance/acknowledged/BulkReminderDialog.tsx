import React from 'react';
import { Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BulkReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  message: string;
  onMessageChange: (message: string) => void;
  onConfirm: () => void;
}

export const BulkReminderDialog: React.FC<BulkReminderDialogProps> = ({
  open,
  onOpenChange,
  selectedCount,
  message,
  onMessageChange,
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-violet-600" />
            Send Bulk Reminder
          </DialogTitle>
          <DialogDescription>
            Send a reminder message to multiple selected employees about their document acknowledgement requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0">
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Document Name:</label>
              <p className="text-sm text-gray-600">Code of Conduct.pdf</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date:</label>
              <p className="text-sm text-red-600">July 30, 2025</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Selected Employees:</label>
              <p className="text-sm text-gray-600">{selectedCount} employee(s) selected</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
            <Textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={6}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={onConfirm}
            >
              Send Reminder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};