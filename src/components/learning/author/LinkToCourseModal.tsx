import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizDetails {
  id: string;
  title: string;
  description: string;
}

interface LinkToCourseModalProps {
  quiz: QuizDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (quizId: string, courseId: string, moduleId: string) => void;
}

// Mock data for courses and modules
const mockCourses = [
  { id: 'course-1', name: 'Introduction to Web Development' },
  { id: 'course-2', name: 'Advanced React Patterns' },
  { id: 'course-3', name: 'UI/UX Design Fundamentals' },
  { id: 'course-4', name: 'Digital Marketing Strategies' },
  { id: 'course-5', name: 'Project Management Essentials' },
];

const mockModules = {
  'course-1': [
    { id: 'module-1-1', name: 'HTML Basics' },
    { id: 'module-1-2', name: 'CSS Styling' },
    { id: 'module-1-3', name: 'JavaScript Essentials' },
  ],
  'course-2': [
    { id: 'module-2-1', name: 'Hooks and Context' },
    { id: 'module-2-2', name: 'State Management with Redux' },
    { id: 'module-2-3', name: 'Performance Optimization' },
  ],
  'course-3': [
    { id: 'module-3-1', name: 'User Research' },
    { id: 'module-3-2', name: 'Wireframing and Prototyping' },
    { id: 'module-3-3', name: 'Usability Testing' },
  ],
  'course-4': [
    { id: 'module-4-1', name: 'SEO Fundamentals' },
    { id: 'module-4-2', name: 'Social Media Marketing' },
    { id: 'module-4-3', name: 'Content Strategy' },
  ],
  'course-5': [
    { id: 'module-5-1', name: 'Project Planning' },
    { id: 'module-5-2', name: 'Team Management' },
    { id: 'module-5-3', name: 'Risk Assessment' },
  ],
};

const LinkToCourseModal: React.FC<LinkToCourseModalProps> = ({
  quiz,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [availableModules, setAvailableModules] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    if (isOpen && quiz) {
      // Reset selections when modal opens
      setSelectedCourse('');
      setSelectedModule('');
      setAvailableModules([]);
    }
  }, [isOpen, quiz]);

  useEffect(() => {
    if (selectedCourse) {
      setAvailableModules(mockModules[selectedCourse as keyof typeof mockModules] || []);
      setSelectedModule(''); // Reset module when course changes
    } else {
      setAvailableModules([]);
      setSelectedModule('');
    }
  }, [selectedCourse]);

  const handleSave = () => {
    if (quiz && selectedCourse && selectedModule) {
      onSave(quiz.id, selectedCourse, selectedModule);
      onClose();
    } else {
      alert('Please select a course and module.');
    }
  };

  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{quiz.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Link to course
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Course</option>
                {mockCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-muted disabled:text-muted-foreground"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                disabled={!selectedCourse}
              >
                <option value="">Module</option>
                {availableModules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 bg-gray-900 hover:bg-gray-800 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkToCourseModal;
