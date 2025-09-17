import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateFinancialProject } from '@/hooks/finance/useFinancialProjects';
import { toast } from '@/hooks/use-toast';

interface CreateRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateRecordDialog: React.FC<CreateRecordDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [recordType, setRecordType] = useState<string>('');
  const [projectData, setProjectData] = useState({
    project_name: '',
    project_code: '',
    description: '',
    budget_allocated: '',
    start_date: '',
    end_date: '',
    status: 'planning' as const,
    manager_name: '',
    currency: 'USD',
  });

  const createProject = useCreateFinancialProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recordType) {
      toast({
        title: 'Error',
        description: 'Please select a record type',
        variant: 'destructive',
      });
      return;
    }

    if (recordType === 'project') {
      if (!projectData.project_name || !projectData.project_code || !projectData.budget_allocated) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }

      try {
        await createProject.mutateAsync({
          ...projectData,
          budget_allocated: parseFloat(projectData.budget_allocated),
          budget_spent: 0,
        });
        onOpenChange(false);
        resetForm();
      } catch (error) {
        console.error('Error creating project:', error);
      }
    }
  };

  const resetForm = () => {
    setRecordType('');
    setProjectData({
      project_name: '',
      project_code: '',
      description: '',
      budget_allocated: '',
      start_date: '',
      end_date: '',
      status: 'planning',
      manager_name: '',
      currency: 'USD',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Create New Record</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recordType">Record Type</Label>
            <Select value={recordType} onValueChange={setRecordType}>
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Financial Project</SelectItem>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="budget">Budget Entry</SelectItem>
                <SelectItem value="account">Account</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recordType === 'project' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_name">Project Name *</Label>
                  <Input
                    id="project_name"
                    value={projectData.project_name}
                    onChange={(e) => setProjectData(prev => ({ ...prev, project_name: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_code">Project Code *</Label>
                  <Input
                    id="project_code"
                    value={projectData.project_code}
                    onChange={(e) => setProjectData(prev => ({ ...prev, project_code: e.target.value }))}
                    placeholder="e.g., PRJ2024"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_allocated">Budget Allocated *</Label>
                  <Input
                    id="budget_allocated"
                    type="number"
                    min="0"
                    step="0.01"
                    value={projectData.budget_allocated}
                    onChange={(e) => setProjectData(prev => ({ ...prev, budget_allocated: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={projectData.currency} onValueChange={(value) => setProjectData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={projectData.start_date}
                    onChange={(e) => setProjectData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={projectData.end_date}
                    onChange={(e) => setProjectData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={projectData.status} onValueChange={(value: any) => setProjectData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager_name">Manager</Label>
                  <Input
                    id="manager_name"
                    value={projectData.manager_name}
                    onChange={(e) => setProjectData(prev => ({ ...prev, manager_name: e.target.value }))}
                    placeholder="Project manager name"
                  />
                </div>
              </div>
            </>
          )}

          {recordType && recordType !== 'project' && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Feature coming soon!</p>
              <p className="text-sm">This record type will be available in the next update.</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!recordType || createProject.isPending}
              className="flex-1"
            >
              {createProject.isPending ? 'Creating...' : 'Create Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};