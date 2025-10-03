import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, FileText, ClipboardList, CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  type: 'lesson' | 'resources' | 'assignment' | 'quiz';
  status: 'completed' | 'in-progress' | 'not-started';
  hasDropdown?: boolean;
}

interface Module {
  id: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  status: 'completed' | 'in-progress' | 'not-started';
  lessons: Lesson[];
  isExpanded?: boolean;
}

interface ProgressiveModulesProps {
  courseId?: string;
}

const ProgressiveModules: React.FC<ProgressiveModulesProps> = ({ courseId = '1' }) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Introduction to digital tools',
      totalLessons: 5,
      completedLessons: 5,
      status: 'completed',
      isExpanded: false,
      lessons: []
    },
    {
      id: '2',
      title: 'Advanced features of digital tools',
      totalLessons: 5,
      completedLessons: 3,
      status: 'in-progress',
      isExpanded: true,
      lessons: [
        { id: '2.1', title: 'Overview of advanced features', type: 'lesson', status: 'completed' },
        { id: '2.2', title: 'Resources', type: 'resources', status: 'completed', hasDropdown: true },
        { id: '2.3', title: 'Setting up teams', type: 'lesson', status: 'completed' },
        { id: '2.4', title: 'Resources', type: 'resources', status: 'not-started', hasDropdown: true },
        { id: '2.5', title: 'Assignment: set up a project', type: 'assignment', status: 'not-started' },
        { id: '2.6', title: 'Quiz: Collaboration basics', type: 'quiz', status: 'not-started' },
      ]
    },
    {
      id: '3',
      title: 'Best practices for digital tool usage',
      totalLessons: 5,
      completedLessons: 0,
      status: 'not-started',
      isExpanded: false,
      lessons: []
    },
    {
      id: '4',
      title: 'Integrating digital tools into workflows',
      totalLessons: 5,
      completedLessons: 0,
      status: 'not-started',
      isExpanded: false,
      lessons: []
    }
  ]);

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, isExpanded: !module.isExpanded }
        : module
    ));
  };

  const getModuleIcon = (status: string, completedLessons: number, totalLessons: number) => {
    if (status === 'completed') {
      return <CheckCircle size={20} className="text-purple-600" />;
    }
    return <Circle size={20} className="text-gray-400" />;
  };

  const handleLessonClick = (lesson: Lesson, moduleId: string) => {
    if (lesson.type === 'lesson') {
      // Navigate to video lesson page
      navigate(`/dashboard/learning/lesson-${lesson.id}-${courseId}`);
    }
    // Other lesson types can be handled differently (resources, assignments, quizzes)
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'lesson':
       	return <Play size={16} className="text-gray-500" />;
      case 'resources':
        return <FileText size={16} className="text-gray-500" />;
      case 'assignment':
        return <FileText size={16} className="text-gray-500" />;
      case 'quiz':
        return <ClipboardList size={16} className="text-gray-500" />;
      default:
        return <Play size={16} className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            In-progress
          </span>
        );
      case 'not-started':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500">
            Not started →
          </span>
        );
      default:
        return null;
    }
  };

  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-purple-200 bg-purple-50';
      case 'in-progress':
        return 'border-gray-200 bg-white';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <div 
          key={module.id} 
          className={`border rounded-xl p-4 transition-all duration-200 ${getModuleStatusColor(module.status)}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getModuleIcon(module.status, module.completedLessons, module.totalLessons)}
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Module {module.id}: {module.title}
                  </h3>
                  {module.status === 'completed' && (
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Next
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {module.completedLessons}/{module.totalLessons} lessons
                  {module.status === 'completed' ? ' completed' : ''}
                </p>
              </div>
            </div>
            
            {module.lessons.length > 0 && (
              <button
                onClick={() => toggleModule(module.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {module.isExpanded ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
            )}
          </div>

          {module.isExpanded && module.lessons.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="space-y-3">
                {module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className={`flex items-center justify-between py-2 ${lesson.type === 'lesson' ? 'cursor-pointer hover:bg-gray-50 px-2 rounded-lg' : ''}`}
                    onClick={() => lesson.type === 'lesson' && handleLessonClick(lesson, module.id)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {getLessonIcon(lesson.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {lesson.title}
                          </span>
                          {lesson.hasDropdown && (
                            <ChevronDown size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(lesson.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          Previous lesson
        </button>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium">
          Next lesson
        </button>
      </div>
    </div>
  );
};

export default ProgressiveModules;
