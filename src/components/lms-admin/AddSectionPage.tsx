import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Eye,
  Users
} from 'lucide-react';

interface AddSectionPageProps {
  onBack: () => void;
  onSave: (sectionData: SectionFormData) => void;
}

interface SectionFormData {
  sectionName: string;
  description: string;
}

const AddSectionPage: React.FC<AddSectionPageProps> = ({
  onBack,
  onSave
}) => {
  const [formData, setFormData] = useState<SectionFormData>({
    sectionName: '',
    description: ''
  });

  const handleInputChange = (field: keyof SectionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the section data to the parent component
    onSave(formData);
    // Navigate back to course builder (this will be handled by the parent)
  };

  const handleBack = () => {
    // Reset form
    setFormData({
      sectionName: '',
      description: ''
    });
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back Navigation */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Course list</span>
            </Button>
          </div>

          {/* Center: Course Title */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-medium text-gray-900">Introduction to Digital Marketing Strategies</h1>
          </div>

          {/* Right: Collaborators and Actions */}
          <div className="flex items-center space-x-3">
            {/* Collaborator Avatars */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Preview Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            
            {/* Publish Button */}
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6">
          <div className="space-y-6">
            {/* Contents Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">Contents</h2>
              {/* Empty state - no sections yet */}
              <div className="text-sm text-gray-500 italic">
                No sections added yet
              </div>
            </div>
            
            {/* Add Section Button */}
            <div className="mt-auto">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <span className="text-lg">+</span>
                <span>Add section</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-sm max-w-md w-full p-8">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-8">New section</h1>
            
            {/* Form */}
            <form onSubmit={handleSave} className="space-y-6">
              {/* Section Title Field */}
              <div className="space-y-2">
                <Label htmlFor="sectionName" className="text-sm font-medium text-gray-700">
                  Section title
                </Label>
                <Input
                  id="sectionName"
                  value={formData.sectionName}
                  onChange={(e) => handleInputChange('sectionName', e.target.value)}
                  placeholder="Module 1: Introduction to digital tools"
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-6 bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSectionPage;
