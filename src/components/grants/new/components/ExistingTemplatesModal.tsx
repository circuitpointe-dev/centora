import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useTemplates } from '@/hooks/useTemplates';
import { supabase } from '@/integrations/supabase/client';

interface SubmissionType {
  id: string;
  name: string;
  enabled: boolean;
  isCustom?: boolean;
}

interface Template {
  id: string;
  title: string;
  category: string;
  file_name: string;
  file_path: string;
  created_at: string;
  mime_type?: string;
}

interface ExistingTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionTypes: SubmissionType[];
  onTemplateSelect: (template: Template) => void;
}

export const ExistingTemplatesModal: React.FC<ExistingTemplatesModalProps> = ({
  open,
  onOpenChange,
  submissionTypes,
  onTemplateSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const { data: templates = [], isLoading: loading } = useTemplates({
    search: searchQuery,
    category: selectedType === 'all' ? undefined : selectedType
  });

  const handleUseTemplate = (template: Template) => {
    onTemplateSelect(template);
    onOpenChange(false);
  };

  const handleDownload = async (template: Template) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(template.file_path);
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = template.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const availableTypes = ['all', ...Array.from(new Set(templates.map(t => t.category)))].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden backdrop-blur-md bg-background/95 border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create with Existing Templates</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-sm"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48 rounded-sm">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">Loading templates...</div>
            ) : (
              <div className="grid grid-cols-3 gap-6 p-1">
                {templates.map((template) => (
                  <Card key={template.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      {/* PDF Document Preview */}
                      <div className="aspect-[3/4] bg-muted rounded-sm overflow-hidden border flex items-center justify-center">
                        {template.mime_type?.includes('pdf') ? (
                          <div className="text-red-600 text-4xl">📄</div>
                        ) : template.mime_type?.includes('image') ? (
                          <div className="text-blue-600 text-4xl">🖼️</div>
                        ) : (
                          <div className="text-gray-600 text-4xl">📄</div>
                        )}
                      </div>
                      
                      {/* Document Name */}
                      <h3 className="font-medium text-sm truncate text-center" title={template.file_name}>
                        {template.file_name}
                      </h3>
                      
                      {/* Category */}
                      <p className="text-xs text-muted-foreground text-center">
                        {template.category}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(template)}
                          className="flex-1 rounded-sm"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1 rounded-sm bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {!loading && templates.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No templates found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};