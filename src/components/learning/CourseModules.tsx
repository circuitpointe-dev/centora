import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Video, FileText, HelpCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  type: 'play' | 'video' | 'assignment' | 'quiz';
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseModulesProps {
  courseId?: string;
}

const mockModules: Module[] = [
  {
    id: '1',
    title: 'Introduction to digital tools',
    lessons: [],
  },
  {
    id: '2',
    title: 'Advanced features of digital tools',
    lessons: [
      { id: '2.1', title: 'Overview of advanced features', type: 'play' },
      { id: '2.2', title: 'Setting up teams', type: 'play' },
      { id: '2.3', title: 'Live demo on zoom', type: 'video' },
      { id: '2.4', title: 'Assignment: set up a project', type: 'assignment' },
      { id: '2.5', title: 'Quiz: Collaboration basics', type: 'quiz' },
    ],
  },
  {
    id: '3',
    title: 'Best practices for digital tool usage',
    lessons: [],
  },
  {
    id: '4',
    title: 'Integrating digital tools into workflows',
    lessons: [],
  },
];

const getLessonIcon = (type: Lesson['type']) => {
  switch (type) {
    case 'play':
      return <Play size={16} className="text-muted-foreground" />;
    case 'video':
      return <Video size={16} className="text-muted-foreground" />;
    case 'assignment':
      return <FileText size={16} className="text-muted-foreground" />;
    case 'quiz':
      return <HelpCircle size={16} className="text-muted-foreground" />;
    default:
      return <Circle size={16} className="text-muted-foreground" />;
  }
};

const CourseModules: React.FC<CourseModulesProps> = ({ courseId = '1' }) => {
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<string | null>('2'); // Module 2 is expanded by default as per image
  
  console.log('CourseModules rendered with courseId:', courseId);
  console.log('Expanded module:', expandedModule);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleLessonClick = (lesson: Lesson) => {
    console.log('handleLessonClick called with:', lesson);
    console.log('Current courseId:', courseId);
    
    switch (lesson.type) {
      case 'play':
      case 'video':
        const lessonUrl = `/dashboard/learning/lesson-${lesson.id}-${courseId}`;
        console.log('Navigating to lesson:', lessonUrl);
        navigate(lessonUrl);
        break;
      case 'assignment':
        const assignmentUrl = `/dashboard/learning/assignment-${lesson.id}-${courseId}`;
        console.log('Navigating to assignment:', assignmentUrl);
        console.log('About to call navigate with:', assignmentUrl);
        navigate(assignmentUrl);
        console.log('Navigate called');
        break;
      case 'quiz':
        // Handle quiz navigation
        console.log('Navigate to quiz:', lesson.id);
        break;
      default:
        console.log('Unknown lesson type:', lesson.type);
        break;
    }
  };

  return (
    <div className="space-y-4">
      {mockModules.map((module) => (
        <div key={module.id} className="bg-card rounded-lg shadow-sm border">
          <button
            className="flex items-center justify-between w-full p-4 text-left focus:outline-none"
            onClick={() => toggleModule(module.id)}
          >
            <div className="flex items-center space-x-3">
              <Circle size={16} className="text-gray-400" />
              <span className="font-medium text-card-foreground">Module {module.id} : {module.title}</span>
            </div>
            {expandedModule === module.id ? (
              <ChevronUp size={20} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={20} className="text-muted-foreground" />
            )}
          </button>

          {expandedModule === module.id && module.lessons.length > 0 && (
            <div className="border-t border-border px-4 py-2">
              <div className="space-y-2 pl-8">
                {module.lessons.map((lesson) => {
                  const isClickable = lesson.type === 'play' || lesson.type === 'video' || lesson.type === 'assignment';
                  console.log('Lesson:', lesson.title, 'Type:', lesson.type, 'IsClickable:', isClickable);
                  
                  return (
                    <div 
                      key={lesson.id} 
                      className={`flex items-center space-x-3 py-2 text-sm text-card-foreground hover:text-card-foreground transition-colors ${
                        isClickable 
                          ? 'cursor-pointer hover:bg-accent px-2 rounded-lg' 
                          : ''
                      }`}
                      onClick={() => {
                        console.log('Lesson clicked:', lesson.title, 'Type:', lesson.type);
                        if (isClickable) {
                          handleLessonClick(lesson);
                        }
                      }}
                    >
                      {getLessonIcon(lesson.type)}
                      <span>{lesson.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseModules;
