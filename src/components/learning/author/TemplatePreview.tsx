import React, { useState } from 'react';
import { ArrowLeft, SquareDashedBottomCode, ChevronDown, ChevronUp, Play, Folder, FileText, HelpCircle, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: string;
  title: string;
  description: string;
  editorType: 'block' | 'slide';
  instructor: {
    name: string;
    avatar: string;
  };
  date: string;
  thumbnail: string;
}

interface TemplatePreviewProps {
  template?: Template;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template }) => {
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['2'])); // Module 2 expanded by default

  // Default template data if none provided
  const defaultTemplate: Template = {
    id: '1',
    title: 'Responsive Design Principles',
    description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
    editorType: 'block',
    instructor: {
      name: 'Leslie Alex',
      avatar: '/placeholder-avatar.jpg'
    },
    date: 'Aug 2, 2025',
    thumbnail: '/src/assets/images/dummy image.png'
  };

  const currentTemplate = template || defaultTemplate;

  const modules = [
    {
      id: '1',
      title: 'Module 1: Introduction to digital tools',
      lessonsCount: 5,
      completedLessons: 0,
      lessons: []
    },
    {
      id: '2',
      title: 'Module 2: Advanced features of digital tools',
      lessonsCount: 5,
      completedLessons: 0,
      lessons: [
        { id: '1', title: 'Overview of advanced features', type: 'video', icon: Play },
        { id: '2', title: 'Resources', type: 'folder', icon: Folder, hasDropdown: true },
        { id: '3', title: 'Setting up teams', type: 'video', icon: Play },
        { id: '4', title: 'Assignment: set up a project', type: 'assignment', icon: FileText },
        { id: '5', title: 'Quiz: Collaboration basics', type: 'quiz', icon: HelpCircle }
      ]
    },
    {
      id: '3',
      title: 'Module 3: Best practices for digital tool usage',
      lessonsCount: 5,
      completedLessons: 0,
      lessons: []
    },
    {
      id: '4',
      title: 'Module 4: Integrating digital tools into workflows',
      lessonsCount: 5,
      completedLessons: 0,
      lessons: []
    }
  ];

  const handleBack = () => {
    navigate('/dashboard/lmsAuthor/templates');
  };

  const handleUseTemplate = () => {
    console.log('Using template:', currentTemplate.id);
    // Add use template logic here
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handleOpenLesson = (lessonId: string) => {
    console.log('Opening lesson:', lessonId);
    // Add open lesson logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Button>
        
        <span className="text-sm text-gray-500">You are currently in preview mode</span>
        
        <Button 
          onClick={handleUseTemplate} 
          className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <SquareDashedBottomCode className="w-4 h-4" />
          <span>Use template</span>
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Course Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Section (Image) */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentTemplate.thumbnail}
                alt={currentTemplate.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Section (Course Details) */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentTemplate.title}</h1>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">{currentTemplate.description}</p>
              
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Beginner
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentTemplate.instructor.name}</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Navigation */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              <button className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary border-b-2 border-transparent transition-colors">
                Overview
              </button>
              <button className="px-6 py-3 text-sm font-medium text-primary border-b-2 border-primary">
                Modules
              </button>
              <button className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-primary hover:border-primary border-b-2 border-transparent transition-colors">
                Discussion
              </button>
            </div>

            {/* Modules Content */}
            <div className="p-6">
              <div className="flex justify-end mb-6">
                <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                  Next
                </Button>
              </div>

              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Module Header */}
                    <div 
                      className={`p-4 cursor-pointer transition-colors ${
                        expandedModules.has(module.id) 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input 
                            type="radio" 
                            className="w-4 h-4 text-primary focus:ring-primary" 
                            checked={module.id === '2'} // Module 2 is selected
                            readOnly
                          />
                          <div>
                            <p className={`font-medium ${
                              expandedModules.has(module.id) ? 'text-primary' : 'text-gray-900'
                            }`}>
                              {module.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {module.completedLessons}/{module.lessonsCount} lessons
                            </p>
                          </div>
                        </div>
                        {expandedModules.has(module.id) ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Module Lessons (Expanded) */}
                    {expandedModules.has(module.id) && module.lessons.length > 0 && (
                      <div className="px-4 pb-4 bg-white">
                        <div className="ml-7 space-y-3">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between py-2">
                              <div className="flex items-center space-x-3">
                                <lesson.icon className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{lesson.title}</span>
                                {lesson.hasDropdown && (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleOpenLesson(lesson.id)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                              >
                                Open <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  Previous lesson
                </Button>
                <Button 
                  variant="outline" 
                  className="text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  Next lesson
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
