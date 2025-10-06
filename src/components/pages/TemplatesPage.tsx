import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from '@/hooks/useTemplates';
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
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Using the Template interface from useTemplates hook
import type { Template } from '@/hooks/useTemplates';

const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    description: '',
    category: '',
    file: null as File | null
  });
  const { toast } = useToast();

  // Backend integration
  const { data: templates = [], isLoading, error } = useTemplates({
    search: searchTerm,
    category: categoryFilter === 'all' ? undefined : categoryFilter
  });
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const templatesPerPage = 8;

  // Templates are already filtered by the backend hook
  const totalPages = Math.ceil(templates.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const paginatedTemplates = templates.slice(startIndex, startIndex + templatesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTypeIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'report': return <FileText className="h-4 w-4" />;
      case 'financial': return <BarChart3 className="h-4 w-4" />;
      case 'proposal': return <FileImage className="h-4 w-4" />;
      case 'compliance': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'report': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateTemplate = async () => {
    try {
      if (isEditMode && selectedTemplate) {
        // Update existing template
        await updateTemplate.mutateAsync({
          id: selectedTemplate.id,
          title: newTemplate.title,
          description: newTemplate.description,
          category: newTemplate.category,
        });
        toast({
          title: "Template Updated",
          description: `${newTemplate.title} has been updated successfully.`,
        });
      } else {
        // Create new template
        await createTemplate.mutateAsync({
          title: newTemplate.title,
          description: newTemplate.description,
          category: newTemplate.category,
          file_name: newTemplate.file?.name || 'template',
          file_path: newTemplate.file ? URL.createObjectURL(newTemplate.file) : '',
          mime_type: newTemplate.file?.type,
          file_size: newTemplate.file?.size,
        });
        toast({
          title: "Template Created",
          description: `${newTemplate.title} has been created successfully.`,
        });
      }

      setNewTemplate({
        title: '',
        description: '',
        category: '',
        file: null
      });
      setShowCreateDialog(false);
      setSelectedTemplate(null);
      setIsEditMode(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setNewTemplate({
      title: template.title,
      description: template.description || '',
      category: template.category,
      file: null
    });
    setIsEditMode(true);
    setShowCreateDialog(true);
  };

  const handleViewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setShowViewDialog(true);
  };

  const handleDeleteTemplate = async (template: Template) => {
    try {
      await deleteTemplate.mutateAsync(template.id);
      toast({
        title: "Template Deleted",
        description: `${template.title} has been deleted successfully.`,
      });
      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleDownloadTemplate = async (template: Template) => {
    try {
      // Download logic would go here
      toast({
        title: "Download Started",
        description: `Downloading ${template.title}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download template",
        variant: "destructive",
      });
    }
  };

  const handleCopyTemplate = (template: Template) => {
    setNewTemplate({
      title: `${template.title} (Copy)`,
      description: template.description || '',
      category: template.category,
      file: null
    });
    setIsEditMode(false);
    setShowCreateDialog(true);
  };

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(templates.map(t => t.category)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load templates</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Manage and organize your document templates
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {paginatedTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm || categoryFilter !== 'all'
                ? 'No templates match your current search or filter criteria.'
                : 'Get started by creating your first template.'}
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(template.category)}
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <Badge className={getTypeBadgeClass(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTemplate(template)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTemplateToDelete(template);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description || 'No description provided'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Created {new Date(template.created_at).toLocaleDateString()}</span>
                  <span>{template.creator?.full_name || 'Unknown'}</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTemplate(template)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyTemplate(template)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Create/Edit Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update the template information below.'
                : 'Fill in the details to create a new template.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Template Name</Label>
              <Input
                id="title"
                value={newTemplate.title}
                onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                placeholder="Enter template name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTemplate.category}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Enter template description"
                rows={3}
              />
            </div>
            {!isEditMode && (
              <div>
                <Label htmlFor="file">Template File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setNewTemplate({ ...newTemplate, file: e.target.files?.[0] || null })}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={!newTemplate.title || !newTemplate.category || (!isEditMode && !newTemplate.file)}
            >
              {isEditMode ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Template Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.title}</DialogTitle>
            <DialogDescription>
              Template details and information
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Badge className={getTypeBadgeClass(selectedTemplate.category)}>
                  {selectedTemplate.category}
                </Badge>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-gray-600">
                  {selectedTemplate.description || 'No description provided'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedTemplate.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Created By</Label>
                  <p className="text-sm text-gray-600">
                    {selectedTemplate.creator?.full_name || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleDownloadTemplate(selectedTemplate)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowViewDialog(false);
                    handleEditTemplate(selectedTemplate);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TemplatesPage;