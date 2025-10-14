import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft, Eye, Plus, MoreHorizontal, ChevronUp, ChevronDown, GripVertical, FileText, Play, FileCheck } from 'lucide-react';

const TextLessonEditor: React.FC = () => {
  const navigate = useNavigate();
  const { feature } = useParams();
  const location = useLocation();
  
  // Extract courseId and lessonId from feature parameter
  const courseId = feature?.split('-')[1] || '';
  const lessonId = feature?.split('-')[3] || '';
  
  // Get course data from navigation state
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.title || 'Introduction to Digital Marketing Strategies';
  
  const [lessonTitle, setLessonTitle] = useState('T Heading 1');
  const [lessonContent, setLessonContent] = useState(`
    <h1>Heading1</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY2NjY2O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjI1JSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmYzYwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmZmMDA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iNzUlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBmZjAwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDAwZmY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPC9zdmc+" alt="Gradient Image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" />
  `);
  const [isOptional, setIsOptional] = useState(false);

  const handleBackToCourseBuilder = () => {
    navigate('/dashboard/lmsAuthor/courses-builder');
  };

  const handleSaveLesson = () => {
    // TODO: Implement save functionality
    console.log('Saving lesson:', { lessonTitle, lessonContent, isOptional });
    alert('Lesson saved successfully!');
  };

  const handleCancel = () => {
    handleBackToCourseBuilder();
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
              
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <GripVertical size={14} className="text-muted-foreground" />
                <FileCheck size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">Assignment: Case study on digital tools</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <GripVertical size={14} className="text-muted-foreground" />
                <FileText size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">Heading 1</span>
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

        {/* Main Content Area - Text Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Rich Text Editor */}
            <div className="border border-border rounded-lg overflow-hidden mb-6">
              <ReactQuill
                theme="snow"
                value={lessonContent}
                onChange={setLessonContent}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
                formats={[
                  'header', 'bold', 'italic', 'underline', 'strike',
                  'color', 'background',
                  'align', 'list', 'bullet', 'indent',
                  'link', 'image'
                ]}
                style={{
                  height: '500px',
                  backgroundColor: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))'
                }}
              />
            </div>

            {/* Lesson Settings Panel */}
            <div className="flex items-center justify-between pt-6 pb-12">
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

              <div className="flex items-center space-x-3">
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
    </div>
  );
};

export default TextLessonEditor;
