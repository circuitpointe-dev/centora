
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  owner: string;
  tags: string[];
  expiryDate: string;
  status: 'expired' | 'expiring' | 'active';
}

interface SendExpiryReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
  onReminderSent: () => void;
}

export const SendExpiryReminderDialog = ({
  open,
  onOpenChange,
  document,
  onReminderSent
}: SendExpiryReminderDialogProps) => {
  const [message, setMessage] = useState(`Hello John,

This is a reminder that the document '${document.name}' is set to expire on July 30, 2025.

Please review and take any necessary action, such as uploading a replacement document or updating the expiry date.

Thank you`);

  const handleSendReminder = () => {
    // In a real app, this would send the reminder
    console.log('Sending reminder for document:', document.id);
    console.log('Message:', message);
    onReminderSent();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-gray-200">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-600" />
            <DialogTitle className="text-violet-600 text-lg">Send Expiry Reminder</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Document Name: </span>
              <span className="text-sm font-medium text-gray-900">{document.name}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Expiry Date: </span>
              <span className="text-sm font-medium text-red-600">July 30, 2025</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Document Owner: </span>
              <span className="text-sm font-medium text-gray-900">{document.owner}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-32 resize-none"
              placeholder="Enter your reminder message..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-gray-700 border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendReminder}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Send Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
