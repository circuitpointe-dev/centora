import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useCreateSignatureRequest } from '@/hooks/useSignatureRequests';
import { toast } from 'sonner';

interface SignatureRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  onSuccess: () => void;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
}

export const SignatureRequestDialog: React.FC<SignatureRequestDialogProps> = ({
  open,
  onOpenChange,
  document,
  onSuccess,
}) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newRecipient, setNewRecipient] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createSignatureRequest = useCreateSignatureRequest();

  const addRecipient = () => {
    if (newRecipient.name && newRecipient.email) {
      const recipient: Recipient = {
        id: Date.now().toString(),
        name: newRecipient.name,
        email: newRecipient.email,
      };
      setRecipients([...recipients, recipient]);
      setNewRecipient({ name: '', email: '' });
    }
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const handleSubmit = async () => {
    if (recipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }

    setIsSubmitting(true);
    try {
      // Send signature request to each recipient
      for (const recipient of recipients) {
        await createSignatureRequest.mutateAsync({
          document_id: document.id,
          signer_name: recipient.name,
          signer_email: recipient.email,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });
      }
      
      toast.success(`Signature request sent to ${recipients.length} recipient(s)`);
      onSuccess();
    } catch (error) {
      console.error('Error sending signature request:', error);
      toast.error('Failed to send signature request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Signature</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                📄
              </div>
              <div>
                <p className="font-medium">{document.title || document.fileName}</p>
                <p className="text-sm text-gray-500">
                  {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : document.fileSize}
                </p>
              </div>
            </div>
          </div>

          {/* Add Recipients */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Recipients</Label>
            
            {/* Existing Recipients */}
            {recipients.length > 0 && (
              <div className="space-y-2">
                {recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-sm text-gray-600">{recipient.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecipient(recipient.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Recipient */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Full Name"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                />
                <Button
                  type="button"
                  onClick={addRecipient}
                  size="icon"
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Message (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message for the recipients..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || recipients.length === 0}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {isSubmitting ? 'Sending...' : `Send Request${recipients.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
