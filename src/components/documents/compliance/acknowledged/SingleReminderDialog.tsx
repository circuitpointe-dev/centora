import React from 'react';
import { Mail } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Employee {
  id: string;
  name: string;
  policyAssigned: string;
  acknowledgementDate: string | null;
  status: 'Acknowledged' | 'Pending' | 'Expired' | 'Exempt';
}

interface SingleReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  message: string;
  onMessageChange: (message: string) => void;
  onConfirm: () => void;
}

export const SingleReminderDialog: React.FC<SingleReminderDialogProps> = ({
  open,
  onOpenChange,
  employee,
  message,
  onMessageChange,
  onConfirm
}) => {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">Send Reminder</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Document Name:</label>
              <p className="text-sm text-gray-600">{employee.policyAssigned}.pdf</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date:</label>
              <p className="text-sm text-red-600">July 30, 2025</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Employee Name:</label>
              <p className="text-sm text-gray-600">{employee.name}</p>
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