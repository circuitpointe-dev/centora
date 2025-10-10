import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Upload, 
  Trash2, 
  Eye, 
  Download, 
  MoreVertical,
  Calendar,
  Play,
  FileText,
  Music,
  Image as ImageIcon
} from 'lucide-react';

// Mock data for media items
const mediaItems = [
  {
    id: 1,
    name: 'Onboarding_video.mp4',
    type: 'Video',
    size: '3.2mb',
    thumbnail: 'video-thumbnail',
    actions: ['Preview', 'Download']
  },
  {
    id: 2,
    name: 'Infographic.png',
    type: 'Image',
    size: '3.2mb',
    thumbnail: 'infographic-thumbnail',
    actions: ['Replace']
  },
  {
    id: 3,
    name: 'Data_sheet.pdf',
    type: 'Document',
    size: '6.2kb',
    thumbnail: 'pdf-thumbnail',
    actions: []
  },
  {
    id: 4,
    name: 'Onboarding_video.mp4',
    type: 'Video',
    size: '3.2mb',
    thumbnail: 'video-thumbnail',
    actions: ['Preview', 'Download']
  },
  {
    id: 5,
    name: 'Voiceover.mp3',
    type: 'Audio',
    size: '6.2kb',
    thumbnail: 'audio-thumbnail',
    actions: []
  },
  {
    id: 6,
    name: 'Governance.png',
    type: 'Image',
    size: '3.2mb',
    thumbnail: 'governance-thumbnail',
    actions: []
  }
];

const MediaLibrary = () => {
  const [selectedType, setSelectedType] = useState('Image');
  const [sortBy, setSortBy] = useState('Newest');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemSelect = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === mediaItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(mediaItems.map(item => item.id));
    }
  };

  const getThumbnailComponent = (item: typeof mediaItems[0]) => {
    switch (item.type) {
      case 'Video':
        return (
          <div className="relative w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg"></div>
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-purple-600 ml-1" />
            </div>
          </div>
        );
      case 'Image':
        if (item.name === 'Infographic.png') {
          return (
            <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center p-2">
              <div className="text-xs text-center text-gray-600">
                <div className="flex justify-center space-x-1 mb-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                </div>
                <div className="text-xs font-semibold">LOREM IPSUM</div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          );
        }
      case 'Document':
        return (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        );
      case 'Audio':
        return (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <Music className="w-16 h-16 text-gray-400" />
          </div>
        );
      default:
        return (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400" />
          </div>
        );
    }
  };

  const getActionButtons = (item: typeof mediaItems[0]) => {
    return item.actions.map((action, index) => {
      switch (action) {
        case 'Preview':
          return (
            <Button key={index} variant="ghost" size="sm" className="h-8 px-2">
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          );
        case 'Download':
          return (
            <Button key={index} variant="ghost" size="sm" className="h-8 px-2">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          );
        case 'Replace':
          return (
            <Button key={index} variant="ghost" size="sm" className="h-8 px-2">
              <Upload className="w-4 h-4 mr-1" />
              Replace
            </Button>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Media library</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
              
              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Type</h3>
                <div className="space-y-2">
                  {['Video', 'Image', 'Document', 'Audio'].map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
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
                    className="w-full pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sort by</h3>
                <div className="space-y-2">
                  {['Newest', 'Oldest', 'A-Z', 'Z-A'].map((sort) => (
                    <label key={sort} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value={sort}
                        checked={sortBy === sort}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{sort}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Media Items */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Media library</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search....."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload new</span>
                  </Button>
                </div>
              </div>

              {/* Media Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {mediaItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Checkbox */}
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Thumbnail */}
                    <div className="mb-3">
                      {getThumbnailComponent(item)}
                    </div>

                    {/* File Info */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.type} {item.size}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-1">
                      {getActionButtons(item)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing 1 to 6 of 32 media library
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;
