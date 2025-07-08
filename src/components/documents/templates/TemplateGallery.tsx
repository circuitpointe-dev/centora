import React, { useState } from 'react';
import { Search, Grid2X2, List, Filter, Plus, Eye, Download, Edit2, MoreHorizontal, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { TemplateCard } from './TemplateCard';
import { TemplateDetailDialog } from './TemplateDetailDialog';

const templatesData = [
  {
    id: '1',
    title: 'Annual Report Template',
    category: 'Report',
    department: 'Finance',
    lastUpdated: '2 days ago',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=240&fit=crop'
  },
  {
    id: '2',
    title: 'Employee Contract',
    category: 'Agreement',
    department: 'HR',
    lastUpdated: '2 days ago',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=240&fit=crop'
  },
  {
    id: '3',
    title: 'Invoice Template',
    category: 'Financial',
    department: 'Accounting',
    lastUpdated: '2 days ago',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=240&fit=crop'
  },
  {
    id: '4',
    title: 'Performance Review',
    category: 'Document',
    department: 'HR',
    lastUpdated: '2 days ago',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=240&fit=crop'
  },
  {
    id: '5',
    title: 'NDA Template',
    category: 'Agreement',
    department: 'Legal',
    lastUpdated: '2 days ago',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop'
  },
  {
    id: '6',
    title: 'Budget Report',
    category: 'Report',
    department: 'Finance',
    lastUpdated: '2 days ago',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=240&fit=crop'
  }
];

export const TemplateGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTemplates = templatesData.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || template.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleUseTemplate = (id: string) => {
    console.log('Use template:', id);
    // TODO: Implement template usage logic
  };

  const handleView = (id: string) => {
    const template = templatesData.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(template);
      setIsDialogOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    console.log('Edit template:', id);
    // TODO: Implement template editing logic
  };

  const handleCreateTemplate = () => {
    console.log('Create new template');
    // TODO: Implement template creation logic
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0",
                viewMode === 'grid' && "bg-muted"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0",
                viewMode === 'list' && "bg-muted"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Report')}>
                Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Agreement')}>
                Agreement
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Financial')}>
                Financial
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('Document')}>
                Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Template Button */}
          <Button 
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={handleCreateTemplate}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Templates Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              title={template.title}
              category={template.category}
              department={template.department}
              lastUpdated={template.lastUpdated}
              image={template.image}
              viewMode={viewMode}
              onUseTemplate={handleUseTemplate}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Template Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Last Updated</TableHead>
                <TableHead className="font-semibold w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-8 rounded overflow-hidden flex-shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt={`${template.title} Preview`}
                          src={template.image}
                        />
                      </div>
                      <div className="font-medium text-gray-900">{template.title}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{template.category}</TableCell>
                  <TableCell className="text-gray-600">{template.department}</TableCell>
                  <TableCell className="text-gray-600">{template.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUseTemplate(template.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Use as Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleView(template.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(template.id)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No templates found matching your search.' : 'No templates available.'}
          </p>
        </div>
      )}

      {/* Template Detail Dialog */}
      <TemplateDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        template={selectedTemplate}
        onUseTemplate={handleUseTemplate}
        onEdit={handleEdit}
      />
    </div>
  );
};