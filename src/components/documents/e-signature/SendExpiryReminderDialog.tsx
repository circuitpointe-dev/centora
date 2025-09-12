import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ExpiringDocument } from '@/hooks/useDocumentExpiry';

interface SendExpiryReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ExpiringDocument;
  onReminderSent: (params: { recipient_email: string; message: string }) => void;
}

export function SendExpiryReminderDialog({
  open,
  onOpenChange,
  document,
  onReminderSent
}: SendExpiryReminderDialogProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Hi,\n\nThis is a reminder that the document "${document.name}" is expiring soon on ${document.expiryDate}.\n\nPlease take the necessary action to renew or update this document.\n\nBest regards`);

  const handleSend = () => {
    onReminderSent({
      recipient_email: email,
      message: message
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded">
        <DialogHeader>
          <DialogTitle className="text-black font-semibold">Send Expiry Reminder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-black font-medium">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="mt-1 rounded bg-white border-gray-300"
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-black font-medium">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="mt-1 rounded bg-white border-gray-300"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded bg-white border-gray-300 text-black hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!email.trim() || !message.trim()}
              className="rounded bg-black text-white hover:bg-gray-800"
            >
              Send Reminder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}