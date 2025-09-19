import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Grant } from '@/types/grants';

interface EditGrantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  grant: Grant;
  onGrantUpdated: (updatedGrant: Grant) => void;
}

export const EditGrantDialog: React.FC<EditGrantDialogProps> = ({
  isOpen,
  onClose,
  grant,
  onGrantUpdated
}) => {
  const [formData, setFormData] = useState({
    grant_name: grant.grant_name,
    donor_name: grant.donor_name,
    amount: grant.amount.toString(),
    start_date: grant.start_date,
    end_date: grant.end_date,
    status: grant.status,
    program_area: grant.program_area || '',
    region: grant.region || '',
    description: grant.description || '',
    currency: grant.currency || 'USD'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && grant) {
      setFormData({
        grant_name: grant.grant_name,
        donor_name: grant.donor_name,
        amount: grant.amount.toString(),
        start_date: grant.start_date,
        end_date: grant.end_date,
        status: grant.status,
        program_area: grant.program_area || '',
        region: grant.region || '',
        description: grant.description || '',
        currency: grant.currency || 'USD'
      });
    }
  }, [isOpen, grant]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('grants')
        .update({
          grant_name: formData.grant_name,
          donor_name: formData.donor_name,
          amount: parseFloat(formData.amount),
          start_date: formData.start_date,
          end_date: formData.end_date,
          status: formData.status as Grant['status'],
          program_area: formData.program_area || null,
          region: formData.region || null,
          description: formData.description || null,
          currency: formData.currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', grant.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Grant updated successfully',
      });

      onGrantUpdated(data);
      onClose();
    } catch (error) {
      console.error('Error updating grant:', error);
      toast({
        title: 'Error',
        description: 'Failed to update grant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Grant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grant_name" className="text-black">Grant Name</Label>
              <Input
                id="grant_name"
                value={formData.grant_name}
                onChange={(e) => handleInputChange('grant_name', e.target.value)}
                placeholder="Enter grant name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="donor_name" className="text-black">Donor Name</Label>
              <Input
                id="donor_name"
                value={formData.donor_name}
                onChange={(e) => handleInputChange('donor_name', e.target.value)}
                placeholder="Enter donor name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-black">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-black">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-black">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-black">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-black">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="program_area" className="text-black">Program Area</Label>
              <Input
                id="program_area"
                value={formData.program_area}
                onChange={(e) => handleInputChange('program_area', e.target.value)}
                placeholder="Enter program area"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-black">Region</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              placeholder="Enter region"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-black">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter grant description"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Grant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};