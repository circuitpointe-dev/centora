import React, { useState } from 'react';
import { Search, Download, FileText, Video, Volume2 } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'audio';
  duration?: string;
  size?: string;
}

interface ResourcesTabProps {
  courseId?: string;
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ courseId = '1' }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pdf' | 'video' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock resources data based on the image
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Case study: NGO digital tools',
      description: 'Real world NGO adoption examples',
      type: 'pdf',
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Workshop recording',
      description: '45 minutes session on cloud collaboration',
      type: 'video',
      duration: '45 min'
    },
    {
      id: '3',
      title: 'Accessibility tip podcast',
      description: '20 minutes audio discussion',
      type: 'audio',
      duration: '20 min'
    },
    {
      id: '4',
      title: 'Webinar series: Nonprofit marketing',
      description: 'Interactive sessions on effective strategies',
      type: 'pdf',
      size: '1.8 MB'
    },
    {
      id: '5',
      title: 'Research report: Impact measurement',
      description: 'Comprehensive study on outcomes in NGOs',
      type: 'video',
      duration: '32 min'
    },
    {
      id: '6',
      title: 'Training module: Volunteer management',
      description: 'Step-by-step guide for nonprofits',
      type: 'audio',
      duration: '28 min'
    }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-red-500" />;
      case 'video':
        return <Video size={20} className="text-blue-500" />;
      case 'audio':
        return <Volume2 size={20} className="text-green-500" />;
      default:
        return <FileText size={20} className="text-muted-foreground" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDFs';
      case 'video':
        return 'Videos';
      case 'audio':
        return 'Audio';
      default:
        return 'All';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesFilter = selectedFilter === 'all' || resource.type === selectedFilter;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownload = (resource: Resource) => {
    console.log(`Downloading ${resource.title}`);
    // In a real implementation, this would trigger a download
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Filters</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Sort by</h4>
                {(['all', 'pdf', 'video', 'audio'] as const).map((filter) => (
                  <label key={filter} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="resourceFilter"
                      value={filter}
                      checked={selectedFilter === filter}
                      onChange={() => setSelectedFilter(filter)}
                      className="w-4 h-4 text-primary focus:ring-primary border-border"
                    />
                    <span className="text-sm text-muted-foreground">
                      {getResourceTypeLabel(filter)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">All resources</h3>
              
              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-border bg-background text-foreground rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Resources List */}
            <div className="space-y-4">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {getResourceIcon(resource.type)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-card-foreground mb-1">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          {resource.duration && (
                            <span className="text-xs text-muted-foreground">
                              Duration: {resource.duration}
                            </span>
                          )}
                          {resource.size && (
                            <span className="text-xs text-muted-foreground">
                              Size: {resource.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(resource)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">
                    <FileText size={48} className="mx-auto" />
                  </div>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No resources found matching your search.' : 'No resources available for this filter.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;
