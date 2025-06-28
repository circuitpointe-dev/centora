
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ExpiryConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToMonitor: () => void;
}

export const ExpiryConfirmationDialog = ({
  open,
  onOpenChange,
  onBackToMonitor
}: ExpiryConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white border-none shadow-lg p-0">
        <Card className="w-full border-none shadow-none">
          <CardContent className="flex flex-col items-center justify-center pt-24 pb-16 px-16 space-y-10">
            <CheckCircle className="w-[120px] h-[120px] text-violet-600 stroke-[1.5]" />

            <div className="space-y-4 text-center">
              <h2 className="font-semibold text-[#383838] text-lg leading-[23.4px]">
                We've notified the document owners and recipients.
              </h2>

              <p className="text-[#383838b2] text-sm leading-[18.2px] max-w-[579px]">
                They'll receive an email with the reminder to update or replace
                the expiring document.
              </p>
            </div>

            <div className="flex items-center gap-6 mt-6">
              <Button
                variant="ghost"
                className="text-[#38383880] font-medium text-sm h-auto"
                onClick={onBackToMonitor}
              >
                Back to Expiry Monitor
              </Button>

              <Button className="bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm h-auto">
                View Document Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
