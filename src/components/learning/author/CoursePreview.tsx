import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, FileText, FileCheck, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';
import dummyImage from '@/assets/images/dummy image.png';

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
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
  const { feature } = useParams();
  const location = useLocation();
  
  // Extract courseId from feature parameter (format: courses-{courseId}-preview)
  const courseId = feature?.replace('courses-', '').replace('-preview', '') || '';
  
  // Get course data from navigation state
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.title || 'Responsive Design Principles';
  const courseDescription = courseData?.description || 'Understand the key concepts to create designs that adapt to various screen sizes.';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'discussion'>('modules');
  
  // Sample course modules data
  const modules: CourseModule[] = [
    {
      id: '1',
      title: 'Module 1 : Introduction to digital tools',
      lessons: [
        {
          id: '1',
          title: 'Overview of advanced features',
          type: 'video',
          duration: '5:30',
          isCompleted: false
        },
        {
          id: '2',
          title: 'Setting up teams',
          type: 'video',
          duration: '8:15',
          isCompleted: false
        },
        {
          id: '3',
          title: 'Assignment: set up a project',
          type: 'assignment',
          duration: '15 min',
          isCompleted: false
        },
        {
          id: '4',
          title: 'Quiz: Collaboration basics',
          type: 'quiz',
          duration: '10 min',
          isCompleted: false
        }
      ]
    }
  ];

  const handleBackToCourseBuilder = () => {
    navigate(`/dashboard/lmsAuthor/courses-${courseId}-builder`);
  };

  const handlePublish = () => {
    console.log('Publishing course...');
    // Add publish logic here
  };

  const handleOpenLesson = (lesson: CourseLesson) => {
    console.log('Opening lesson:', lesson);
    console.log('CourseId:', courseId);
    console.log('Current URL:', window.location.href);
    
    // Navigate to appropriate preview based on lesson type
    if (lesson.type === 'quiz') {
      const quizPreviewUrl = `/dashboard/lmsAuthor/courses-${courseId}-quiz-${lesson.id}-preview`;
      console.log('Navigating to quiz preview URL:', quizPreviewUrl);
      console.log('Full URL would be:', window.location.origin + quizPreviewUrl);
      
      // Try React Router navigate first
      try {
        navigate(quizPreviewUrl, {
          state: { courseData: courseData },
          replace: false
        });
      } catch (error) {
        console.error('React Router navigate failed:', error);
        // Fallback to window.location
        window.location.href = quizPreviewUrl;
      }
    } else {
      // For other lesson types, show a placeholder or navigate to appropriate preview
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
      default:
        return <FileText size={16} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCourseBuilder}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>
          
          <div className="flex-1 text-center">
            <span className="text-sm text-gray-500">You are currently in preview mode</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={handlePublish} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2">
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Course Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Course Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={dummyImage} 
                alt="Course preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Course Info */}
          <div className="flex flex-col justify-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">{courseTitle}</h1>
            <p className="text-lg text-gray-600">{courseDescription}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-purple-600 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'modules'
                  ? 'border-purple-600 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'discussion'
                  ? 'border-purple-600 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Discussion
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-4">
                  {/* Module Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                    </div>
                    <ChevronUp size={16} className="text-gray-500" />
                  </div>
                  
                  {/* Lessons */}
                  <div className="space-y-3 ml-7">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          {getLessonIcon(lesson.type)}
                          <span className="text-gray-900">{lesson.title}</span>
                          {lesson.duration && (
                            <span className="text-sm text-gray-500">({lesson.duration})</span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {lesson.type === 'video' && (
                            <button className="text-sm text-gray-500 hover:text-gray-700">
                              Resources <ChevronDown size={14} className="inline ml-1" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenLesson(lesson);
                            }}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Open →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Next Button */}
            <div className="flex justify-end">
              <Button onClick={handleNextLesson} className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2">
                Next
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Course Overview</h3>
              <p className="text-muted-foreground">
                This course covers the fundamental principles of responsive design, 
                teaching you how to create designs that work seamlessly across different devices and screen sizes.
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Course Discussion</h3>
              <p className="text-muted-foreground">
                Discussion forum will be available once the course is published.
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={handlePreviousLesson} className="bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200">
            Previous lesson
          </Button>
          <Button variant="outline" onClick={handleNextLesson} className="bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200">
            Next lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;