import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Video, FileText, HelpCircle, Circle } from 'lucide-react';

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
      return <Play size={16} className="text-gray-500" />;
    case 'video':
      return <Video size={16} className="text-gray-500" />;
    case 'assignment':
      return <FileText size={16} className="text-gray-500" />;
    case 'quiz':
      return <HelpCircle size={16} className="text-gray-500" />;
    default:
      return <Circle size={16} className="text-gray-500" />;
  }
};

const CourseModules: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>('2'); // Module 2 is expanded by default as per image

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-4">
      {mockModules.map((module) => (
        <div key={module.id} className="bg-white rounded-lg shadow-sm border">
          <button
            className="flex items-center justify-between w-full p-4 text-left focus:outline-none"
            onClick={() => toggleModule(module.id)}
          >
            <div className="flex items-center space-x-3">
              <Circle size={16} className="text-gray-400" />
              <span className="font-medium text-gray-900">Module {module.id} : {module.title}</span>
            </div>
            {expandedModule === module.id ? (
              <ChevronUp size={20} className="text-gray-500" />
            ) : (
              <ChevronDown size={20} className="text-gray-500" />
            )}
          </button>

          {expandedModule === module.id && module.lessons.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2">
              <div className="space-y-2 pl-8">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center space-x-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    {getLessonIcon(lesson.type)}
                    <span>{lesson.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseModules;
