
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useOrgUsers } from '@/hooks/useOrgUsers';
import StaffSelector from './StaffSelector';

interface SendNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (notification: { title: string; message: string; recipients: string[] }) => void;
}

const SendNotificationDialog = ({ isOpen, onClose, onSend }: SendNotificationDialogProps) => {
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    recipients: [] as string[]
  });
  const [open, setOpen] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);
  const { data: usersData } = useOrgUsers({ search: '', page: 1, pageSize: 100 });

  const handleRecipientSelect = (staffId: string) => {
    if (sendToAll) return;
    
    setNewNotification(prev => ({
      ...prev,
      recipients: prev.recipients.includes(staffId)
        ? prev.recipients.filter(id => id !== staffId)
        : [...prev.recipients, staffId]
    }));
  };

  const handleSendToAllChange = (checked: boolean) => {
    setSendToAll(checked);
    if (checked) {
      setNewNotification(prev => ({
        ...prev,
        recipients: usersData?.map(user => user.id) || []
      }));
    } else {
      setNewNotification(prev => ({
        ...prev,
        recipients: []
      }));
    }
  };

  const handleSendNotification = () => {
    const recipientNames = sendToAll 
      ? ['All Staff']
      : newNotification.recipients.map(id => 
          usersData?.find(user => user.id === id)?.full_name
        ).filter(Boolean);

    onSend(newNotification);
    setNewNotification({ title: '', message: '', recipients: [] });
    setSendToAll(false);
    onClose();
    
    toast({
      title: "Notification Sent",
      description: `Notification sent to ${recipientNames.join(', ')}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send New Notification</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <StaffSelector
            sendToAll={sendToAll}
            selectedRecipients={newNotification.recipients}
            onSendToAllChange={handleSendToAllChange}
            onRecipientSelect={handleRecipientSelect}
            open={open}
            onOpenChange={setOpen}
          />
          
          <div>
            <Label htmlFor="notif-title">Title</Label>
            <Input
              id="notif-title"
              value={newNotification.title}
              onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter notification title"
            />
          </div>
          <div>
            <Label htmlFor="notif-message">Message</Label>
            <Textarea
              id="notif-message"
              value={newNotification.message}
              onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter notification message"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendNotification}
              disabled={!newNotification.title || !newNotification.message || (!sendToAll && newNotification.recipients.length === 0)}
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendNotificationDialog;
