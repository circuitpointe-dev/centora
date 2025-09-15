import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useCreateTemplate } from '@/hooks/useTemplates';

interface CreateTemplateDialogProps {
  trigger?: React.ReactNode;
}

export const CreateTemplateDialog: React.FC<CreateTemplateDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
  });

  const createTemplateMutation = useCreateTemplate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const fileName = `${formData.title.replace(/\s+/g, '-').toLowerCase()}.html`;
      
      await createTemplateMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file_name: fileName,
        file_path: `templates/${Date.now()}-${fileName}`,
        mime_type: 'text/html',
        file_size: formData.content.length,
      });
      
      setOpen(false);
      setFormData({ title: '', description: '', category: '', content: '' });
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const defaultTrigger = (
    <Button className="bg-violet-600 hover:bg-violet-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Create Template
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Template Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter template title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Agreement">Agreement</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Brief">Brief</SelectItem>
                  <SelectItem value="Form">Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the template"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Template Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter template content..."
              className="min-h-[200px]"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-violet-600 hover:bg-violet-700"
              disabled={createTemplateMutation.isPending}
            >
              {createTemplateMutation.isPending ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};