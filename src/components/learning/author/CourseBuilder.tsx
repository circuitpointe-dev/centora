import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  MoreHorizontal, 
  Play, 
  FileText, 
  FileImage, 
  Mic, 
  ClipboardList, 
  FileCheck,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Eye,
  Upload
} from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
  isExpanded: boolean;
}

interface CourseLesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf' | 'audio' | 'quiz' | 'assignment';
  isActive: boolean;
}

const CourseBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { feature } = useParams();
  
  // Extract courseId from feature parameter (format: courses-{courseId}-builder)
  const courseId = feature?.replace('courses-', '').replace('-builder', '') || '';
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: '1',
      title: 'Module 1: Introduction to digital tools',
      isExpanded: true,
      lessons: [
        { id: '1', title: 'Introduction video', type: 'video', isActive: false },
        { id: '2', title: 'Assignment: Case study on digital tools', type: 'assignment', isActive: false },
        { id: '3', title: 'T Heading 1', type: 'text', isActive: true },
      ]
    }
  ]);

  const [showAddLesson, setShowAddLesson] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('1');

  const lessonTypeIcons = {
    video: Play,
    text: FileText,
    pdf: FileImage,
    audio: Mic,
    quiz: ClipboardList,
    assignment: FileCheck
  };

  const lessonTypeLabels = {
    video: 'Video',
    text: 'Text',
    pdf: 'PDF',
    audio: 'Audio',
    quiz: 'Quiz',
    assignment: 'Assignment'
  };

  const handleBackToCourseList = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
  };

  const handleAddSection = () => {
    const newModule: CourseModule = {
      id: Date.now().toString(),
      title: `Module ${modules.length + 1}: New section`,
      isExpanded: false,
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const handleAddLesson = (type: CourseLesson['type']) => {
    const module = modules.find(m => m.id === selectedModuleId);
    if (module) {
      const newLesson: CourseLesson = {
        id: Date.now().toString(),
        title: `${lessonTypeLabels[type]}: New ${lessonTypeLabels[type].toLowerCase()}`,
        type,
        isActive: false
      };
      
      const updatedModules = modules.map(m => 
        m.id === selectedModuleId 
          ? { ...m, lessons: [...m.lessons, newLesson] }
          : m
      );
      setModules(updatedModules);
      setShowAddLesson(false);
    }
  };

  const handleToggleModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
    ));
  };

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => ({
        ...lesson,
        isActive: module.id === moduleId && lesson.id === lessonId
      }))
    }));
    setModules(updatedModules);
    setSelectedModuleId(moduleId);
  };

  const handleEditLesson = (lesson: CourseLesson) => {
    // Navigate to appropriate editor based on lesson type
    const editorRoutes = {
      video: `/dashboard/lmsAuthor/courses-${courseId}-lessons-${lesson.id}-video`,
      text: `/dashboard/lmsAuthor/courses-${courseId}-lessons-${lesson.id}-text`,
      pdf: `/dashboard/lmsAuthor/courses-${courseId}-lessons-${lesson.id}-pdf`,
      audio: `/dashboard/lmsAuthor/courses-${courseId}-lessons-${lesson.id}-audio`,
      quiz: `/dashboard/lmsAuthor/courses-${courseId}-lessons-${lesson.id}-quiz`,
      assignment: `/dashboard/lmsAuthor/courses-${courseId}-lessons-${lesson.id}-assignment`
    };
    navigate(editorRoutes[lesson.type]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCourseList}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Course list
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              Introduction to Digital Marketing Strategies
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
            {modules.map((module) => (
              <div key={module.id} className="space-y-2">
                {/* Module Header */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-2">
                    <GripVertical size={16} className="text-muted-foreground" />
                    <button
                      onClick={() => handleToggleModule(module.id)}
                      className="flex items-center space-x-2 text-card-foreground hover:text-foreground"
                    >
                      {module.isExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                      <span className="font-medium">{module.title}</span>
                    </button>
                  </div>
                  <MoreHorizontal size={16} className="text-muted-foreground" />
                </div>

                {/* Module Lessons */}
                {module.isExpanded && (
                  <div className="ml-6 space-y-1">
                    {module.lessons.map((lesson) => {
                      const IconComponent = lessonTypeIcons[lesson.type];
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            handleSelectLesson(module.id, lesson.id);
                            handleEditLesson(lesson);
                          }}
                          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            lesson.isActive 
                              ? 'bg-primary/10 text-primary border border-primary/20' 
                              : 'hover:bg-accent'
                          }`}
                        >
                          <GripVertical size={14} className="text-muted-foreground" />
                          <IconComponent size={16} className="text-muted-foreground" />
                          <span className="text-sm text-card-foreground flex-1">{lesson.title}</span>
                        </div>
                      );
                    })}
                    
                    {/* Add Lesson Button */}
                    <button
                      onClick={() => {
                        setSelectedModuleId(module.id);
                        setShowAddLesson(true);
                      }}
                      className="flex items-center space-x-2 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full"
                    >
                      <Plus size={14} />
                      <span>Add lesson</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Section Button */}
          <button
            onClick={handleAddSection}
            className="flex items-center space-x-2 p-3 mt-6 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full"
          >
            <Plus size={16} />
            <span>Add section</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {showAddLesson ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">Add Lesson</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(lessonTypeLabels).map(([type, label]) => {
                  const IconComponent = lessonTypeIcons[type as CourseLesson['type']];
                  return (
                    <Card
                      key={type}
                      className="p-6 cursor-pointer hover:shadow-md transition-shadow border-border"
                      onClick={() => handleAddLesson(type as CourseLesson['type'])}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-4 bg-primary/10 rounded-full">
                          <IconComponent size={24} className="text-primary" />
                        </div>
                        <span className="font-medium text-card-foreground">{label}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-20">
                <div className="mb-8">
                  <Upload size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Start your course by adding the first section
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Create modules and lessons to build your course content
                  </p>
                </div>
                
                <Button
                  onClick={handleAddSection}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                >
                  <Plus size={20} className="mr-2" />
                  Add section
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;
