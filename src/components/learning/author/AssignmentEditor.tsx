import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, Upload, Plus, MoreHorizontal, ChevronUp, ChevronDown, GripVertical, FileCheck, Play } from 'lucide-react';

const AssignmentEditor: React.FC = () => {
  const navigate = useNavigate();
  const { feature } = useParams();
  const location = useLocation();
  
  // Extract courseId and lessonId from feature parameter
  const courseId = feature?.split('-')[1] || '';
  const lessonId = feature?.split('-')[3] || '';
  
  // Get course data from navigation state
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.title || 'Introduction to Digital Marketing Strategies';
  
  const [assignmentTitle, setAssignmentTitle] = useState('Assignment: Case study on digital tools');
  const [instructions, setInstructions] = useState('Please write a 15000 word case study in pdf, describing how NGOs can leverage digital collaboration tools to improve operational efficiency');
  const [isOptional, setIsOptional] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleBackToCourseBuilder = () => {
    navigate('/dashboard/lmsAuthor/courses-builder');
  };

  const handleSaveLesson = () => {
    console.log('Saving assignment:', { assignmentTitle, instructions, isOptional });
    alert('Assignment saved successfully!');
  };

  const handleCancel = () => {
    handleBackToCourseBuilder();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log('File dropped:', files[0]);
      alert(`File uploaded: ${files[0].name}`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('File selected:', files[0]);
      alert(`File uploaded: ${files[0].name}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCourseBuilder}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Course list
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              {courseTitle}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">LA</span>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">SA</span>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">MJ</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Contents */}
        <div className="w-80 bg-card border-r border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-6">Contents</h2>
          
          <div className="space-y-2">
            {/* Module Header */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-2">
                <GripVertical size={16} className="text-muted-foreground" />
                <button className="flex items-center space-x-2 text-card-foreground hover:text-foreground">
                  <ChevronUp size={16} />
                  <span className="font-medium">Module 1: Introduction to digital tools</span>
                </button>
              </div>
              <MoreHorizontal size={16} className="text-muted-foreground" />
            </div>

            {/* Module Lessons */}
            <div className="ml-6 space-y-1">
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <GripVertical size={14} className="text-muted-foreground" />
                <Play size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">Introduction video</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <GripVertical size={14} className="text-muted-foreground" />
                <FileCheck size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">Assignment: Case study on digital tools</span>
              </div>
              
              {/* Add Lesson Button */}
              <button className="flex items-center space-x-2 p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full">
                <Plus size={16} />
                <span>Add lesson</span>
              </button>
            </div>
          </div>

          {/* Add Section Button */}
          <button className="flex items-center space-x-2 p-3 mt-6 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full">
            <Plus size={16} />
            <span>Add section</span>
          </button>
        </div>

        {/* Main Content Area - Assignment Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Assignment title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Assignment title</label>
              <Input
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="Enter assignment title"
                className="w-full"
              />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Instructions</label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter assignment instructions"
                className="w-full min-h-[120px]"
              />
            </div>

            {/* Upload file */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Upload file</label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileUpload')?.click()}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground mb-2">Choose a file or drag & drop it here</p>
                <Button type="button" variant="outline" size="sm" className="mb-2">
                  Browse file
                </Button>
                <p className="text-xs text-muted-foreground">Maximum size: 25MB</p>
                <p className="text-xs text-muted-foreground mt-2">OR</p>
                <button className="text-xs text-primary hover:text-primary/90 underline">
                  Select from media library
                </button>
              </div>
              
              {/* Hidden file input */}
              <input
                id="fileUpload"
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {/* Lesson settings */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Lesson settings</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="optional"
                  checked={isOptional}
                  onCheckedChange={(checked) => setIsOptional(checked as boolean)}
                />
                <label htmlFor="optional" className="text-sm font-medium text-foreground">
                  Mark as optional
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 pb-12">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveLesson} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save lesson
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentEditor;
