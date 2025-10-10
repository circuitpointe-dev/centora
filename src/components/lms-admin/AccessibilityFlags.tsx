import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Upload, 
  Eye,
  Video,
  FileText,
  Image as ImageIcon,
  Presentation
} from 'lucide-react';

// Mock data for accessibility flags
const accessibilityFlags = [
  {
    id: 1,
    fileName: 'Product demo.mp4',
    type: 'Video',
    issue: 'Caption missing',
    course: 'Onboarding basics',
    status: 'Pending'
  },
  {
    id: 2,
    fileName: 'Product demo.mp4',
    type: 'Video',
    issue: 'Caption missing',
    course: 'Onboarding basics',
    status: 'Pending'
  },
  {
    id: 3,
    fileName: 'Product demo.mp4',
    type: 'Video',
    issue: 'Caption missing',
    course: 'Onboarding basics',
    status: 'Pending'
  },
  {
    id: 4,
    fileName: 'Product demo.mp4',
    type: 'Pdf',
    issue: 'Caption missing',
    course: 'Intro to product demo',
    status: 'Pending'
  },
  {
    id: 5,
    fileName: 'Team meeting.png',
    type: 'Image',
    issue: 'Alt text missing',
    course: 'Communication skills',
    status: 'Pending'
  },
  {
    id: 6,
    fileName: 'Team meeting.png',
    type: 'Image',
    issue: 'Alt text missing',
    course: 'Communication skills',
    status: 'Pending'
  },
  {
    id: 7,
    fileName: 'Team meeting.png',
    type: 'Image',
    issue: 'Alt text missing',
    course: 'Communication skills',
    status: 'Pending'
  },
  {
    id: 8,
    fileName: 'Product demo.mp4',
    type: 'Pdf',
    issue: 'Caption missing',
    course: 'Intro to product demo',
    status: 'Pending'
  }
];

const AccessibilityFlags = () => {
  const [selectedFileType, setSelectedFileType] = useState('All');
  const [selectedIssueType, setSelectedIssueType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-green-600" />;
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'slide':
        return <Presentation className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
        {status}
      </span>
    );
  };

  // Filter data based on selected filters
  const filteredFlags = accessibilityFlags.filter(flag => {
    const matchesFileType = selectedFileType === 'All' || flag.type.toLowerCase() === selectedFileType.toLowerCase();
    const matchesIssueType = selectedIssueType === 'All' || flag.issue.toLowerCase().includes(selectedIssueType.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      flag.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFileType && matchesIssueType && matchesSearch;
  });

  // Calculate counts for filters
  const fileTypeCounts = {
    All: accessibilityFlags.length,
    Video: accessibilityFlags.filter(f => f.type.toLowerCase() === 'video').length,
    Image: accessibilityFlags.filter(f => f.type.toLowerCase() === 'image').length,
    Document: accessibilityFlags.filter(f => f.type.toLowerCase() === 'pdf').length,
    Slide: accessibilityFlags.filter(f => f.type.toLowerCase() === 'slide').length
  };

  const issueTypeCounts = {
    All: accessibilityFlags.length,
    Caption: accessibilityFlags.filter(f => f.issue.toLowerCase().includes('caption')).length,
    'Alt text': accessibilityFlags.filter(f => f.issue.toLowerCase().includes('alt text')).length,
    Contrast: accessibilityFlags.filter(f => f.issue.toLowerCase().includes('contrast')).length
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Accessibility flags</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
              
              {/* File Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">File Type</h3>
                <div className="space-y-2">
                  {Object.entries(fileTypeCounts).map(([type, count]) => (
                    <label key={type} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="fileType"
                          value={type}
                          checked={selectedFileType === type}
                          onChange={(e) => setSelectedFileType(e.target.value)}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </div>
                      <span className="text-sm text-gray-500">({count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Issue Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Issue type</h3>
                <div className="space-y-2">
                  {Object.entries(issueTypeCounts).map(([type, count]) => (
                    <label key={type} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="issueType"
                          value={type}
                          checked={selectedIssueType === type}
                          onChange={(e) => setSelectedIssueType(e.target.value)}
                          className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </div>
                      <span className="text-sm text-gray-500">({count})</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Accessibility Flags Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Accessibility flags</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Export flag report</span>
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">File</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Issue</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Course</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFlags.map((flag) => (
                      <tr key={flag.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            {getFileTypeIcon(flag.type)}
                            <span className="text-sm text-gray-900">{flag.fileName}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-gray-600">{flag.type}</span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-gray-600">{flag.issue}</span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-gray-600">{flag.course}</span>
                        </td>
                        <td className="py-4">
                          {getStatusBadge(flag.status)}
                        </td>
                        <td className="py-4">
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Showing {filteredFlags.length} of {accessibilityFlags.length} accessibility flags
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

export default AccessibilityFlags;
