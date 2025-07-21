import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface SubmissionType {
  id: string;
  name: string;
  enabled: boolean;
  isCustom?: boolean;
}

interface Template {
  id: string;
  name: string;
  type: string;
  previewUrl: string;
  lastModified: string;
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

  // Mock template data for development
  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Template 1.pdf',
      type: 'Narrative',
      previewUrl: '/lovable-uploads/e7986328-5665-4739-b5a5-86ac2274eca2.png',
      lastModified: '2024-01-15',
    },
    {
      id: '2',
      name: 'Template 2.pdf',
      type: 'Financial',
      previewUrl: '/lovable-uploads/e7986328-5665-4739-b5a5-86ac2274eca2.png',
      lastModified: '2024-01-10',
    },
    {
      id: '3',
      name: 'Monthly Report Template.pdf',
      type: 'M & E',
      previewUrl: '/lovable-uploads/e7986328-5665-4739-b5a5-86ac2274eca2.png',
      lastModified: '2024-01-08',
    },
    {
      id: '4',
      name: 'Quarterly Financial.pdf',
      type: 'Financial',
      previewUrl: '/lovable-uploads/e7986328-5665-4739-b5a5-86ac2274eca2.png',
      lastModified: '2024-01-05',
    },
    {
      id: '5',
      name: 'Impact Assessment.pdf',
      type: 'M & E',
      previewUrl: '/lovable-uploads/e7986328-5665-4739-b5a5-86ac2274eca2.png',
      lastModified: '2024-01-03',
    },
    {
      id: '6',
      name: 'Annual Report.pdf',
      type: 'Narrative',
      previewUrl: '/lovable-uploads/e7986328-5665-4739-b5a5-86ac2274eca2.png',
      lastModified: '2024-01-01',
    },
    {
      id: '7',
      name: 'Budget Template.pdf',
      type: 'Financial',
      previewUrl: '/lovable-uploads/e7986328-5665-4739-b5a5-86ac2274eca2.png',
      lastModified: '2023-12-28',
    },
    {
      id: '8',
      name: 'Progress Report.pdf',
      type: 'Other',
      previewUrl: '/lovable-uploads/e7986328-5665-4739-b5a5-86ac2274eca2.png',
      lastModified: '2023-12-25',
    },
  ];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleUseTemplate = (template: Template) => {
    onTemplateSelect(template);
    onOpenChange(false);
  };

  const handleDownload = (template: Template) => {
    console.log('Downloading template:', template.name);
    // TODO: Implement download logic
  };

  const availableTypes = ['all', ...Array.from(new Set(mockTemplates.map(t => t.type)))];

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
            <div className="grid grid-cols-4 gap-6 p-1">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    {/* Template Preview */}
                    <div className="aspect-[3/4] bg-muted rounded-sm overflow-hidden">
                      <img
                        src={template.previewUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Template Name */}
                    <h3 className="font-medium text-sm truncate" title={template.name}>
                      {template.name}
                    </h3>
                    
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
                        className="flex-1 rounded-sm"
                      >
                        Use template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
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