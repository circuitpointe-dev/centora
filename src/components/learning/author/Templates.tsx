import React, { useState } from 'react';
import { Search, Filter, Grid3X3, List, Eye, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: string;
  title: string;
  description: string;
  editorType: 'block' | 'slide';
  instructor: {
    name: string;
    avatar: string;
  };
  date: string;
  thumbnail: string;
}

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 6;

  // Mock data for templates
  const templates: Template[] = [
    {
      id: '1',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      editorType: 'block',
      instructor: {
        name: 'Leslie Alex',
        avatar: '/placeholder-avatar.jpg'
      },
      date: 'Aug 2, 2025',
      thumbnail: '/src/assets/images/dummy image.png'
    },
    {
      id: '2',
      title: 'Enhancing User Experience',
      description: 'Learn how to prioritize content through size, color, and layout.',
      editorType: 'slide',
      instructor: {
        name: 'Jordan Lee',
        avatar: '/placeholder-avatar.jpg'
      },
      date: 'Sep 15, 2025',
      thumbnail: '/src/assets/images/dummy image.png'
    },
    {
      id: '3',
      title: 'Finding the Right Palette',
      description: 'Explore the impact of color choices on mood and perception in design.',
      editorType: 'block',
      instructor: {
        name: 'Taylor Kim',
        avatar: '/placeholder-avatar.jpg'
      },
      date: 'Oct 10, 2025',
      thumbnail: '/src/assets/images/dummy image.png'
    },
    {
      id: '4',
      title: 'Fundamentals of Color in Design',
      description: 'Explore how color impacts design and user experience.',
      editorType: 'slide',
      instructor: {
        name: 'Jordan Lee',
        avatar: '/placeholder-avatar.jpg'
      },
      date: 'Sep 15, 2025',
      thumbnail: '/src/assets/images/dummy image.png'
    },
    {
      id: '5',
      title: 'Understanding Fonts and Readability',
      description: 'Learn the importance of typography in enhancing user interfaces.',
      editorType: 'block',
      instructor: {
        name: 'Morgan Ray',
        avatar: '/placeholder-avatar.jpg'
      },
      date: 'Oct 10, 2025',
      thumbnail: '/src/assets/images/dummy image.png'
    },
    {
      id: '6',
      title: 'Gathering Insights for Effective Design',
      description: 'Master techniques for conducting user research to inform design decisions.',
      editorType: 'slide',
      instructor: {
        name: 'Alex Morgan',
        avatar: '/placeholder-avatar.jpg'
      },
      date: 'Nov 5, 2025',
      thumbnail: '/src/assets/images/dummy image.png'
    }
  ];

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const endIndex = startIndex + templatesPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);

  const getEditorTagStyle = (editorType: string) => {
    switch (editorType) {
      case 'block':
        return 'bg-green-100 text-green-800';
      case 'slide':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEditorLabel = (editorType: string) => {
    switch (editorType) {
      case 'block':
        return 'Block editor';
      case 'slide':
        return 'Slide editor';
      default:
        return 'Editor';
    }
  };

  const handlePreview = (templateId: string) => {
    navigate(`/dashboard/lmsAuthor/template-preview?id=${templateId}`);
  };

  const handleUseTemplate = (templateId: string) => {
    console.log('Using template:', templateId);
    // Add use template logic here
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Template</h1>
      </div>

      {/* Template Gallery Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-foreground">Template gallery</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search session..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pr-10"
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Filter Button */}
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <img 
                src={template.thumbnail} 
                alt={template.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Editor Type Tag */}
              <div className="mb-3">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getEditorTagStyle(template.editorType)}`}>
                  {getEditorLabel(template.editorType)}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{template.title}</h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{template.description}</p>

              {/* Instructor Info and Date */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{template.instructor.name}</p>
                    <p className="text-xs text-muted-foreground">Instructor</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{template.date}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(template.id)}
                  className="flex-1 flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1 flex items-center justify-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>Use template</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredTemplates.length)} of {filteredTemplates.length} template gallery
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Templates;
