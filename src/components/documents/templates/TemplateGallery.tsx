import React, { useState } from 'react';
import { Search, Grid3X3, List, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TemplateCard } from './TemplateCard';

const templatesData = [
  {
    id: '1',
    title: 'Annual Report Template',
    category: 'Report',
    department: 'Finance',
    lastUpdated: '2 days ago',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    title: 'Employee Contract',
    category: 'Agreement',
    department: 'HR',
    lastUpdated: '2 days ago',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    title: 'Invoice Template',
    category: 'Financial',
    department: 'Accounting',
    lastUpdated: '2 days ago',
    image: '/placeholder.svg'
  },
  {
    id: '4',
    title: 'Performance Review',
    category: 'Document',
    department: 'HR',
    lastUpdated: '2 days ago',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    title: 'NDA Template',
    category: 'Agreement',
    department: 'Legal',
    lastUpdated: '2 days ago',
    image: '/placeholder.svg'
  },
  {
    id: '6',
    title: 'Budget Report',
    category: 'Report',
    department: 'Finance',
    lastUpdated: '2 days ago',
    image: '/placeholder.svg'
  }
];

export const TemplateGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredTemplates = templatesData.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || template.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleUseTemplate = (id: string) => {
    console.log('Use template:', id);
  };

  const handleView = (id: string) => {
    console.log('View template:', id);
  };

  const handleDownload = (id: string) => {
    console.log('Download template:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit template:', id);
  };

  const handleCreateTemplate = () => {
    console.log('Create new template');
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
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

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
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
        </div>

        {/* Create Template Button */}
        <Button 
          className="bg-violet-600 hover:bg-violet-700 text-white"
          onClick={handleCreateTemplate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid/List */}
      <div className={`${viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
        : 'flex flex-col gap-4'
      }`}>
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            title={template.title}
            category={template.category}
            department={template.department}
            lastUpdated={template.lastUpdated}
            image={template.image}
            onUseTemplate={handleUseTemplate}
            onView={handleView}
            onDownload={handleDownload}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No templates found matching your search.' : 'No templates available.'}
          </p>
        </div>
      )}
    </div>
  );
};