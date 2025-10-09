import React, { useState } from 'react';
import { Search, Trash2, Upload, Eye, Download, MoreHorizontal, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface MediaItem {
  id: string;
  name: string;
  type: 'video' | 'image' | 'document' | 'audio';
  size: string;
  thumbnail: string;
  uploadedDate: string;
}

const MediaLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock data for media items
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      name: 'Onboarding_video.mp4',
      type: 'video',
      size: '3.2mb',
      thumbnail: '/src/assets/images/dummy image.png',
      uploadedDate: '2025-01-15'
    },
    {
      id: '2',
      name: 'Infographic.png',
      type: 'image',
      size: '2.1mb',
      thumbnail: '/src/assets/images/dummy image.png',
      uploadedDate: '2025-01-14'
    },
    {
      id: '3',
      name: 'Data_sheet.pdf',
      type: 'document',
      size: '6.2kb',
      thumbnail: '/src/assets/images/dummy image.png',
      uploadedDate: '2025-01-13'
    },
    {
      id: '4',
      name: 'Onboarding_video.mp4',
      type: 'video',
      size: '3.2mb',
      thumbnail: '/src/assets/images/dummy image.png',
      uploadedDate: '2025-01-12'
    },
    {
      id: '5',
      name: 'Voiceover.mp3',
      type: 'audio',
      size: '6.2kb',
      thumbnail: '/src/assets/images/dummy image.png',
      uploadedDate: '2025-01-11'
    },
    {
      id: '6',
      name: 'Governance.png',
      type: 'image',
      size: '3.2mb',
      thumbnail: '/src/assets/images/dummy image.png',
      uploadedDate: '2025-01-10'
    }
  ];

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map(item => item.id));
    }
  };

  const handleDelete = () => {
    console.log('Deleting items:', selectedItems);
    // Add delete logic here
    setSelectedItems([]);
  };

  const handleUpload = () => {
    console.log('Opening upload dialog');
    // Add upload logic here
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-8 h-8 text-white" />;
      case 'image':
        return <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">IMG</div>;
      case 'document':
        return <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">PDF</div>;
      case 'audio':
        return <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">♪</div>;
      default:
        return <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-xs font-bold">?</div>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'image':
        return 'Image';
      case 'document':
        return 'Document';
      case 'audio':
        return 'Audio';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media library</h1>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search....."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pr-10"
            />
          </div>
          
          {/* Action Buttons */}
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
            className="flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
          
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleUpload}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload new
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            
            {/* Type Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Type</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'video', label: 'Video' },
                  { value: 'image', label: 'Image' },
                  { value: 'document', label: 'Document' },
                  { value: 'audio', label: 'Audio' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={option.value}
                      checked={typeFilter === option.value}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Uploaded Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Date uploaded</h3>
              <div className="relative">
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {/* Sort By Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sort by</h3>
              <div className="space-y-2">
                {[
                  { value: 'newest', label: 'Newest' },
                  { value: 'oldest', label: 'Oldest' },
                  { value: 'a-z', label: 'A-Z' },
                  { value: 'z-a', label: 'Z-A' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Media Items Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  {/* Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemSelect(item.id)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {item.type === 'video' ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={item.thumbnail} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    ) : item.type === 'image' ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={item.thumbnail} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        {getMediaIcon(item.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {getTypeLabel(item.type)} {item.size}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {item.type === 'video' && (
                          <>
                            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center space-x-1">
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </Button>
                          </>
                        )}
                        {item.type === 'image' && (
                          <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <Upload className="w-3 h-3" />
                            <span>Replace</span>
                          </Button>
                        )}
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} media library
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
      </div>
    </div>
  );
};

export default MediaLibrary;
