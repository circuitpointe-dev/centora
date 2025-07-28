import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  FileImage, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  Download, 
  Trash2,
  FileText,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';

interface Template {
  id: number;
  name: string;
  type: 'Report' | 'Proposal' | 'Financial' | 'Compliance';
  category: string;
  description: string;
  lastModified: string;
  usageCount: number;
  createdBy: string;
}

const templatesData: Template[] = [
  {
    id: 1,
    name: 'Quarterly Progress Report',
    type: 'Report',
    category: 'Progress Reports',
    description: 'Standard template for quarterly grant progress reporting',
    lastModified: 'Jul 20, 2025',
    usageCount: 45,
    createdBy: 'Admin'
  },
  {
    id: 2,
    name: 'Financial Summary Template',
    type: 'Financial',
    category: 'Financial Reports',
    description: 'Template for financial summaries and budget reports',
    lastModified: 'Jul 15, 2025',
    usageCount: 32,
    createdBy: 'Finance Team'
  },
  {
    id: 3,
    name: 'Grant Proposal Framework',
    type: 'Proposal',
    category: 'Grant Applications',
    description: 'Comprehensive template for grant proposal submissions',
    lastModified: 'Jul 10, 2025',
    usageCount: 28,
    createdBy: 'Program Manager'
  },
  {
    id: 4,
    name: 'Compliance Checklist',
    type: 'Compliance',
    category: 'Compliance Reports',
    description: 'Standard compliance requirements checklist template',
    lastModified: 'Jul 5, 2025',
    usageCount: 67,
    createdBy: 'Compliance Officer'
  }
];

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>(templatesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'Report' as Template['type'],
    category: '',
    description: ''
  });
  const { toast } = useToast();

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: Template['type']) => {
    switch (type) {
      case 'Report': return <FileText className="h-4 w-4" />;
      case 'Financial': return <BarChart3 className="h-4 w-4" />;
      case 'Proposal': return <FileImage className="h-4 w-4" />;
      case 'Compliance': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadgeClass = (type: Template['type']) => {
    switch (type) {
      case 'Report': return 'bg-blue-100 text-blue-800';
      case 'Financial': return 'bg-green-100 text-green-800';
      case 'Proposal': return 'bg-purple-100 text-purple-800';
      case 'Compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateTemplate = () => {
    const template: Template = {
      id: templates.length + 1,
      ...newTemplate,
      lastModified: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      usageCount: 0,
      createdBy: 'Current User'
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '', type: 'Report', category: '', description: '' });
    setShowCreateDialog(false);
    
    toast({
      title: "Template Created",
      description: `${template.name} has been created successfully.`,
    });
  };

  const handleUseTemplate = (template: Template) => {
    const updatedTemplates = templates.map(t => 
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    );
    setTemplates(updatedTemplates);
    
    toast({
      title: "Template Used",
      description: `Using ${template.name} template.`,
    });
  };

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowViewDialog(true);
  };

  const handleCopyTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: templates.length + 1,
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdBy: 'Current User',
      lastModified: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
    
    setTemplates([...templates, newTemplate]);
    
    toast({
      title: "Template Copied",
      description: `${template.name} has been copied successfully.`,
    });
  };

  const handleDeleteTemplate = (template: Template) => {
    setTemplates(templates.filter(t => t.id !== template.id));
    
    toast({
      title: "Template Deleted",
      description: `${template.name} has been deleted.`,
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Templates</h1>
        </div>
        <Button variant="brand-purple" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Template
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <CardTitle className="text-base font-medium">{template.name}</CardTitle>
                </div>
                <Badge className={getTypeBadgeClass(template.type)}>
                  {template.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Category: {template.category}</span>
                  <span>Used: {template.usageCount} times</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Modified: {template.lastModified}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Created by: {template.createdBy}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="brand-purple"
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1"
                >
                  Use Template
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewTemplate(template)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCopyTemplate(template)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteTemplate(template)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No templates found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new report template for grants management
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="template-type">Template Type</Label>
              <Select 
                value={newTemplate.type} 
                onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value as Template['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Proposal">Proposal</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="template-category">Category</Label>
              <Input
                id="template-category"
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
            <div>
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Enter template description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="brand-purple"
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name || !newTemplate.category || !newTemplate.description}
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Template Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate && getTypeIcon(selectedTemplate.type)}
              {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Template details and preview
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-gray-600">{selectedTemplate.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-gray-600">{selectedTemplate.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Usage Count</Label>
                  <p className="text-sm text-gray-600">{selectedTemplate.usageCount} times</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Modified</Label>
                  <p className="text-sm text-gray-600">{selectedTemplate.lastModified}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Created By</Label>
                <p className="text-sm text-gray-600">{selectedTemplate.createdBy}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            <Button 
              variant="brand-purple" 
              onClick={() => selectedTemplate && handleUseTemplate(selectedTemplate)}
            >
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesPage;