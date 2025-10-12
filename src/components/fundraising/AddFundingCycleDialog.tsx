import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FundingCycleForm } from './FundingCycleForm';
import { useCreateDonorFundingCycle } from '@/hooks/useDonorFundingCycles';
import { useAuth } from '@/contexts/AuthContext';

export const AddFundingCycleDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const createMutation = useCreateDonorFundingCycle();

  const handleSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        created_by: user?.id,
        org_id: user?.org_id
      });
      setOpen(false);
    } catch (error) {
      console.error('Failed to create funding cycle:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Funding Cycle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Funding Cycle</DialogTitle>
        </DialogHeader>
        <FundingCycleForm
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
