import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NoiseExtensionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  grant: {
    id: number;
    grantName: string;
    organization: string;
  };
}

export const NoiseExtensionDialog = ({ isOpen, onClose, onSubmit, grant }: NoiseExtensionDialogProps) => {
  const [formData, setFormData] = useState({
    requestedEndDate: undefined as Date | undefined,
    reason: '',
    justification: '',
    impact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    setFormData({
      requestedEndDate: undefined,
      reason: '',
      justification: '',
      impact: ''
    });
  };

  const handleCancel = () => {
    onClose();
    setFormData({
      requestedEndDate: undefined,
      reason: '',
      justification: '',
      impact: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request No Cost Extension</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grant Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Grant Information</h4>
            <p className="text-sm text-gray-600"><strong>Grant:</strong> {grant.grantName}</p>
            <p className="text-sm text-gray-600"><strong>Donor:</strong> {grant.organization}</p>
            <p className="text-sm text-gray-600"><strong>Current End Date:</strong> December 31, 2025</p>
          </div>

          {/* Request Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="requestedEndDate">Requested New End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.requestedEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.requestedEndDate ? format(formData.requestedEndDate, "PPP") : "Select new end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.requestedEndDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, requestedEndDate: date }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Extension</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Brief reason for requesting extension"
                required
              />
            </div>

            <div>
              <Label htmlFor="justification">Detailed Justification</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
                placeholder="Provide detailed justification for the extension request..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="impact">Impact Assessment</Label>
              <Textarea
                id="impact"
                value={formData.impact}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                placeholder="Describe the impact of the extension on project deliverables and outcomes..."
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};