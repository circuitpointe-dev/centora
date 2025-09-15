
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileSignature, Mail, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateSignatureRequest } from '@/hooks/useESignature';
import { Document } from '@/hooks/useDocuments';

interface ExternalSignatureShareProps {
  document: Document;
}

const ExternalSignatureShare = ({ document }: ExternalSignatureShareProps) => {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const createSignatureRequest = useCreateSignatureRequest();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    if (!currentEmail.trim()) return;
    
    if (!isValidEmail(currentEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (recipients.includes(currentEmail)) {
      toast({
        title: "Email already added",
        description: "This email address is already in the recipient list.",
        variant: "destructive",
      });
      return;
    }

    setRecipients(prev => [...prev, currentEmail]);
    setCurrentEmail('');
  };

  const handleRemoveEmail = (email: string) => {
    setRecipients(prev => prev.filter(e => e !== email));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSendSignatureRequest = async () => {
    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "Please add at least one email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Create signature requests for each recipient
      const promises = recipients.map(email => 
        createSignatureRequest.mutateAsync({
          document_id: document.id,
          signer_email: email,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })
      );
      
      await Promise.all(promises);
      
      toast({
        title: "Signature request sent",
        description: `e-Signature request for ${document.file_name} has been sent to ${recipients.length} recipient(s).`,
      });
      
      setRecipients([]);
      setMessage('');
    } catch (error) {
      toast({
        title: "Failed to send signature request",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Request e-Signature</h3>
        <p className="text-sm text-gray-600 mb-4">
          Send this document to external parties for electronic signature.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email-input" className="text-sm font-medium text-gray-700">
            Recipient Email Addresses
          </Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="email-input"
              type="email"
              placeholder="Enter email address"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddEmail}
              variant="outline"
              className="border-gray-300"
            >
              Add
            </Button>
          </div>
        </div>

        {recipients.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Recipients ({recipients.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {recipients.map((email) => (
                <Badge
                  key={email}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border border-blue-200 pr-1"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  {email}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEmail(email)}
                    className="h-4 w-4 p-0 ml-1 text-blue-500 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="signature-message" className="text-sm font-medium text-gray-700">
            Message (Optional)
          </Label>
          <Textarea
            id="signature-message"
            placeholder="Add a personal message for the recipients..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 min-h-[80px]"
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-start gap-2">
            <FileSignature className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 text-sm">
                e-Signature Request
              </h4>
              <p className="text-xs text-amber-700 mt-1">
                Recipients will receive an email with a secure link to view and electronically sign the document. 
                You'll be notified when signatures are completed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSendSignatureRequest}
        disabled={recipients.length === 0 || isSending}
        className="w-full bg-violet-600 hover:bg-violet-700"
      >
        {isSending ? 'Sending Request...' : 'Send Signature Request'}
      </Button>
    </div>
  );
};

export default ExternalSignatureShare;
