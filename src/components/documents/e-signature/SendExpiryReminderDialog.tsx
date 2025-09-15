import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExpiringDocument } from '@/hooks/useDocumentExpiry';

interface SendExpiryReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ExpiringDocument;
  onReminderSent: (params: { recipient_email: string; message: string }) => void;
}

export const SendExpiryReminderDialog = ({
  open,
  onOpenChange,
  document,
  onReminderSent
}: SendExpiryReminderDialogProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    `The document "${document.name}" is expiring on ${document.expiryDate}. Please review and update if necessary.`
  );
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    
    setIsSending(true);
    try {
      await onReminderSent({ recipient_email: email, message });
      setEmail('');
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Send Expiry Reminder</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!email.trim() || isSending}
            >
              {isSending ? 'Sending...' : 'Send Reminder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};