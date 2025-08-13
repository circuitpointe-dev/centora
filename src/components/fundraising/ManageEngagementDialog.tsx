
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateDonorEngagement } from '@/hooks/useDonorEngagements';

interface ManageEngagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  donorId: string;
}

export interface EngagementEntry {
  id: string;
  date: string;
  description: string;
  user: string;
}

export const ManageEngagementDialog: React.FC<ManageEngagementDialogProps> = ({
  isOpen,
  onClose,
  donorId,
}) => {
  const [description, setDescription] = useState('');
  const createEngagementMutation = useCreateDonorEngagement();

  const handleAddEntry = async () => {
    if (!description.trim()) {
      return;
    }

    try {
      await createEngagementMutation.mutateAsync({
        donorId,
        description,
      });
      
      setDescription('');
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-medium">
            Add New Engagement Entry
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-medium text-[#707070] text-sm">
                    Engagement Details
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter engagement details..."
                    className="min-h-[120px] border-[#d2d2d2]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="text-gray-600 border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddEntry}
                    disabled={createEngagementMutation.isPending}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {createEngagementMutation.isPending ? "Adding..." : "Add Engagement Entry"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
