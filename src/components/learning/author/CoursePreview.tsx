import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  FileImage, 
  Mic, 
  ClipboardList, 
  FileCheck,
  ChevronDown,
  ChevronUp,
  ChevronRight
} from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
  lessonCount: number;
}

interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'assignment' | 'quiz' | 'pdf' | 'audio';
  duration?: string;
  isCompleted?: boolean;
}

const CoursePreview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Static course data - no dynamic extraction
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.title || 'Responsive Design Principles';
  const courseDescription = courseData?.description || 'Understand the key concepts to create designs that adapt to various screen sizes.';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'discussion'>('modules');
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({
    '1': false,
    '2': true,  // Module 2 is expanded by default
    '3': false,
    '4': false
  });
  
  // Common lessons for all modules
  const commonLessons: CourseLesson[] = [
    {
      id: '1',
      title: 'Overview of advanced features',
      type: 'video',
      duration: '5:30',
      isCompleted: false
    },
    {
      id: '2',
      title: 'Resources',
      type: 'text',
      duration: '2 min',
      isCompleted: false
    },
    {
      id: '3',
      title: 'Setting up teams',
      type: 'video',
      duration: '8:15',
      isCompleted: false
    },
    {
      id: '4',
      title: 'Resources',
      type: 'text',
      duration: '1 min',
      isCompleted: false
    },
    {
      id: '5',
      title: 'Assignment: set up a project',
      type: 'assignment',
      duration: '15 min',
      isCompleted: false
    },
    {
      id: '6',
      title: 'Quiz: Collaboration basics',
      type: 'quiz',
      duration: '10 min',
      isCompleted: false
    }
  ];

  // Sample course modules data - all modules have the same content
  const modules: CourseModule[] = [
    {
      id: '1',
      title: 'Module 1: Introduction to digital tools',
      lessonCount: 6,
      lessons: commonLessons
    },
    {
      id: '2',
      title: 'Module 2: Advanced features of digital tools',
      lessonCount: 6,
      lessons: commonLessons
    },
    {
      id: '3',
      title: 'Module 3: Best practices for digital tool usage',
      lessonCount: 6,
      lessons: commonLessons
    },
    {
      id: '4',
      title: 'Module 4: Integrating digital tools into workflows',
      lessonCount: 6,
      lessons: commonLessons
    }
  ];

  const handleBackToCourseBuilder = () => {
    navigate('/dashboard/lmsAuthor/courses-builder');
  };

  const handlePublish = () => {
    console.log('Publishing course...');
    // Add publish logic here
  };

  const handleOpenLesson = (lesson: CourseLesson) => {
    console.log('Opening lesson:', lesson);
    
    // Navigate to appropriate preview based on lesson type
    if (lesson.type === 'quiz') {
      console.log('Navigating to quiz preview...');
      navigate('/dashboard/lmsAuthor/quiz-preview', {
        state: { courseData: courseData },
        replace: false
      });
    } else if (lesson.type === 'video') {
      console.log('Video lesson preview not implemented yet');
      // Placeholder for video lesson preview
    } else if (lesson.type === 'assignment') {
      console.log('Assignment lesson preview not implemented yet');
      // Placeholder for assignment lesson preview
    } else if (lesson.type === 'text') {
      console.log('Text lesson preview not implemented yet');
      // Placeholder for text lesson preview
    } else {
      console.log(`Preview for ${lesson.type} lesson not implemented yet`);
    }
  };

  const handleNextLesson = () => {
    console.log('Next lesson');
    // Add next lesson logic here
  };

  const handlePreviousLesson = () => {
    console.log('Previous lesson');
    // Add previous lesson logic here
  };

  const getLessonIcon = (type: CourseLesson['type']) => {
    switch (type) {
      case 'video':
        return <Play size={16} className="text-muted-foreground" />;
      case 'assignment':
        return <FileCheck size={16} className="text-muted-foreground" />;
      case 'quiz':
        return <ClipboardList size={16} className="text-muted-foreground" />;
      case 'text':
      case 'pdf':
        return <FileText size={16} className="text-muted-foreground" />;
      case 'audio':
        return <Mic size={16} className="text-muted-foreground" />;
      default:
        return <FileText size={16} className="text-muted-foreground" />;
    }
  };

  const handleToggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCourseBuilder}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">You are currently in preview mode</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePublish}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Course Information Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="flex">
            {/* Left Half - Course Image */}
            <div className="w-1/2">
              <img
                src="/src/assets/images/dummy image.png"
                alt={courseTitle}
                className="w-full h-64 object-cover"
              />
            </div>
            
            {/* Right Half - Course Details */}
            <div className="w-1/2 p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{courseTitle}</h1>
                <p className="text-gray-600 mb-4">{courseDescription}</p>
                <Badge variant="secondary" className="bg-gray-100 text-gray-600 mb-6">
                  Beginner
                </Badge>
              </div>
              
              {/* Instructor Information */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium text-lg">LA</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Leslie Alex</div>
                  <div className="text-sm text-gray-500">Instructor</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`pb-3 text-sm font-medium ${
                activeTab === 'modules'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`pb-3 text-sm font-medium ${
                activeTab === 'discussion'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Discussion
            </button>
          </div>
        </div>

        {/* Modules Content */}
        {activeTab === 'modules' && (
          <div className="space-y-0">
            {modules.map((module, index) => (
              <div key={module.id} className="border-b border-gray-200 last:border-b-0">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleToggleModule(module.id)}
                      className="flex items-center space-x-4 w-full text-left hover:bg-gray-50 p-2 -m-2 rounded"
                    >
                      {/* Radio button icon */}
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-500">0 / {module.lessonCount} lessons</p>
                      </div>
                      
                      {/* Chevron icon */}
                      {expandedModules[module.id] ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* Module Lessons */}
                  {expandedModules[module.id] && module.lessons.length > 0 && (
                    <div className="mt-4 ml-10 space-y-3">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            {getLessonIcon(lesson.type)}
                            <span className="text-gray-900">{lesson.title}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenLesson(lesson)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Open →
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h2>
            <p className="text-gray-600">
              This course covers the fundamental principles of responsive design and how to create 
              designs that work across different screen sizes and devices.
            </p>
          </Card>
        )}

        {/* Discussion Tab Content */}
        {activeTab === 'discussion' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Discussion</h2>
            <p className="text-gray-600">
              Join the discussion and ask questions about the course content.
            </p>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousLesson}
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Previous lesson
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNextLesson}
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Next lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;