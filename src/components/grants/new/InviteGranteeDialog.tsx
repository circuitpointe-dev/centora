import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { GrantFormData } from './hooks/useGrantFormData';

interface Contact {
  name: string;
  email: string;
}

interface InviteGranteeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  formData: GrantFormData;
  isCreating?: boolean;
}

const InviteGranteeDialog: React.FC<InviteGranteeDialogProps> = ({
  isOpen,
  onClose,
  onSend,
  formData,
  isCreating = false
}) => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      name: formData.granteeDetails.contactPerson || '',
      email: formData.granteeDetails.email || ''
    }
  ]);
  
  const [subject, setSubject] = useState(
    `Grant Invitation - ${formData.overview.grantName || 'New Grant'}`
  );
  
  const [emailBody, setEmailBody] = useState(
    `Dear ${formData.granteeDetails.contactPerson || 'Grantee'},

We are pleased to invite ${formData.granteeDetails.organization || 'your organization'} to participate in the ${formData.overview.grantName || 'grant program'}.

Grant Details:
- Grant Amount: ${formData.overview.currency || ''} ${formData.overview.amount || ''}
- Grant Period: ${formData.overview.startDate ? formData.overview.startDate.toLocaleDateString() : ''} - ${formData.overview.endDate ? formData.overview.endDate.toLocaleDateString() : ''}
- Program Area: ${formData.granteeDetails.programArea || 'Not specified'}

Next Steps:
Please review the grant terms and conditions attached to this email. If you accept this invitation, please respond within 14 days of receiving this email.

Best regards,
${formData.overview.grantManager || 'Grant Management Team'}`
  );

  const addContact = () => {
    setContacts([...contacts, { name: '', email: '' }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index: number, field: 'name' | 'email', value: string) => {
    const updatedContacts = contacts.map((contact, i) => 
      i === index ? { ...contact, [field]: value } : contact
    );
    setContacts(updatedContacts);
  };

  const handleSend = () => {
    // Validate that all contacts have both name and email
    const validContacts = contacts.filter(contact => contact.name.trim() && contact.email.trim());
    
    if (validContacts.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please ensure at least one contact has both name and email filled.",
        variant: "destructive"
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an email subject.",
        variant: "destructive"
      });
      return;
    }

    if (!emailBody.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an email body.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call an email service
    // For now, we'll simulate the invitation sending
    console.log('Sending invitation to:', validContacts);
    console.log('Subject:', subject);
    console.log('Body:', emailBody);

    // TODO: Implement actual email sending service
    // await emailService.sendInvitation({ to: validContacts, subject, body: emailBody });

    toast({
      title: "Invitation Sent",
      description: `Grant invitation sent to ${validContacts.length} recipient(s).`,
    });

    onSend();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite Grantee</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contacts Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-medium">Recipients</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContact}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </div>
            
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`name-${index}`} className="text-sm">Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={contact.name}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`email-${index}`} className="text-sm">Email</Label>
                    <Input
                      id={`email-${index}`}
                      type="email"
                      value={contact.email}
                      onChange={(e) => updateContact(index, 'email', e.target.value)}
                      placeholder="contact@email.com"
                    />
                  </div>
                  {contacts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeContact(index)}
                      className="p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-base font-medium">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Grant invitation subject"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email-body" className="text-base font-medium">Email Body</Label>
              <Textarea
                id="email-body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Email content..."
                className="mt-1 min-h-[200px]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isCreating}
          >
            {isCreating ? 'Creating Grant...' : 'Send Invitation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteGranteeDialog;