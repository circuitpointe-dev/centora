import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  Play,
  FileText,
  FileImage,
  Mic,
  ClipboardList,
  FileCheck,
  User,
  Award,
  Clock
} from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
  isExpanded: boolean;
  progress: string;
}

interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf' | 'audio' | 'quiz' | 'assignment';
  duration?: string;
  isCompleted: boolean;
}

const CoursePreview: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'discussion'>('modules');
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: '1',
      title: 'Module 1: Introduction to digital tools',
      isExpanded: true,
      progress: '0/5 lessons',
      lessons: [
        { id: '1', title: 'Overview of advanced features', type: 'video', duration: '15 min', isCompleted: false },
        { id: '2', title: 'Resources', type: 'pdf', isCompleted: false },
        { id: '3', title: 'Setting up teams', type: 'video', duration: '20 min', isCompleted: false },
        { id: '4', title: 'Resources', type: 'pdf', isCompleted: false },
        { id: '5', title: 'Assignment: set up a project', type: 'assignment', duration: '45 min', isCompleted: false },
        { id: '6', title: 'Quiz: Collaboration basics', type: 'quiz', duration: '10 min', isCompleted: false }
      ]
    },
    {
      id: '2',
      title: 'Module 2: Advanced features of digital tools',
      isExpanded: false,
      progress: '0/5 lessons',
      lessons: [
        { id: '7', title: 'Advanced configurations', type: 'video', duration: '25 min', isCompleted: false },
        { id: '8', title: 'Best practices', type: 'text', isCompleted: false }
      ]
    },
    {
      id: '3',
      title: 'Module 3: Best practices for digital tool usage',
      isExpanded: false,
      progress: '0/5 lessons',
      lessons: []
    },
    {
      id: '4',
      title: 'Module 4: Integrating digital tools into workflows',
      isExpanded: false,
      progress: '0/5 lessons',
      lessons: []
    }
  ]);

  const handleBack = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
  };

  const handleToggleModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
    ));
  };

  const handleOpenLesson = (lesson: CourseLesson) => {
    console.log('Opening lesson:', lesson);
    // Navigate to lesson content
  };

  const lessonTypeIcons = {
    video: Play,
    text: FileText,
    pdf: FileImage,
    audio: Mic,
    quiz: ClipboardList,
    assignment: FileCheck
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">You are currently in preview mode</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Course Overview Card */}
        <Card className="mb-8 border-border">
          <div className="flex flex-col lg:flex-row">
            {/* Course Image */}
            <div className="lg:w-1/3">
              <div className="h-64 lg:h-80 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
                  alt="Course cover"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Course Details */}
            <div className="lg:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-card-foreground mb-4">
                Responsive Design Principles
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Understand the key concepts to create designs that adapt to various screen sizes.
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  Beginner
                </span>
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Leslie Alex</span>
                  <span className="text-sm text-muted-foreground">Instructor</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-border">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'modules', label: 'Modules' },
            { id: 'discussion', label: 'Discussion' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modules Content */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            {modules.map((module) => (
              <Card key={module.id} className="border-border">
                <div className="p-6">
                  {/* Module Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleModule(module.id)}
                        className="flex items-center space-x-2 text-card-foreground hover:text-primary"
                      >
                        {module.isExpanded ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                        <span className="text-lg font-semibold">{module.title}</span>
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">{module.progress}</span>
                  </div>

                  {/* Module Lessons */}
                  {module.isExpanded && module.lessons.length > 0 && (
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => {
                        const IconComponent = lessonTypeIcons[lesson.type];
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent size={20} className="text-muted-foreground" />
                              <div>
                                <span className="text-card-foreground font-medium">{lesson.title}</span>
                                {lesson.duration && (
                                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <Clock size={14} />
                                    <span>{lesson.duration}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleOpenLesson(lesson)}
                              className="text-sm text-primary hover:text-primary/80 font-medium"
                            >
                              Open →
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" disabled>
                Previous lesson
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Next lesson
              </Button>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="p-6 border-border">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Course Overview</h2>
              <p className="text-muted-foreground">
                This course covers the fundamental principles of responsive design, teaching you how to create 
                layouts that work seamlessly across different devices and screen sizes.
              </p>
            </Card>
          </div>
        )}

        {/* Discussion Tab */}
        {activeTab === 'discussion' && (
          <div className="space-y-6">
            <Card className="p-6 border-border">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Course Discussion</h2>
              <p className="text-muted-foreground">
                Join the discussion and connect with other learners in this course.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePreview;
