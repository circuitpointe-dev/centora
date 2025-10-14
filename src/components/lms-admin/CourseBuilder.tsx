import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Eye,
  Plus,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseBuilder = () => {
  const [courseTitle] = useState('Introduction to Digital Marketing Strategies');
  const navigate = useNavigate();

  const handleBackToCourseList = () => {
    // Handle navigation back to course list
    console.log('Navigate back to course list');
  };

  const handlePreview = () => {
    // Handle course preview
    console.log('Preview course');
  };

  const handlePublish = () => {
    // Handle course publishing
    console.log('Publish course');
  };

  const handleAddSection = () => {
    // Navigate to add section page
    navigate('/dashboard/lmsAuthor/courses-add-section');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back Navigation */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToCourseList}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Course list</span>
            </Button>
          </div>

          {/* Center: Course Title */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {courseTitle}
            </h1>
          </div>

          {/* Right: Collaborators and Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Collaborator Avatars */}
            <div className="flex items-center space-x-1">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>

            {/* Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>

            {/* Publish Button */}
            <Button
              size="sm"
              onClick={handlePublish}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <span>Publish</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Contents */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Contents Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Contents</h2>
          </div>

          {/* Empty Contents Area */}
          <div className="flex-1 p-6">
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">No sections added yet</p>
            </div>
          </div>

          {/* Add Section Button - Bottom */}
          <div className="p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleAddSection}
              className="w-full flex items-center justify-center space-x-2 bg-background hover:bg-accent text-foreground border-border"
            >
              <Plus className="h-4 w-4" />
              <span>Add section</span>
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-background flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Main Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Start your course by adding the first section.
              </h2>
            </div>

            {/* Large Add Section Button */}
            <Button
              size="lg"
              onClick={handleAddSection}
              className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
            >
              <Plus className="h-6 w-6" />
              <span>Add section</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;
