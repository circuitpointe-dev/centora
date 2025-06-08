
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ManageEngagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
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
}) => {
  const [newEntry, setNewEntry] = useState({
    description: '',
  });

  const handleAddEntry = () => {
    if (!newEntry.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter engagement details.",
        variant: "destructive",
      });
      return;
    }

    const entry: EngagementEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      description: newEntry.description,
      user: 'Current User', // In real app, this would come from auth context
    };

    // Here you would typically add the entry to your state/database
    console.log('New engagement entry:', entry);
    
    setNewEntry({ description: '' });
    
    toast({
      title: "Success",
      description: "Engagement entry added successfully.",
    });
    
    onClose();
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
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ description: e.target.value })}
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
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    Add Engagement Entry
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
