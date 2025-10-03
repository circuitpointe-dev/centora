import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Course {
  id: string;
  name: string;
  duration: string;
  category: string;
  checked: boolean;
}

interface BuildTrainingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuildTrainingPlanModal: React.FC<BuildTrainingPlanModalProps> = ({ isOpen, onClose }) => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Leadership Essentials', duration: '4 hours', category: 'Management', checked: true },
    { id: '2', name: 'Advanced Excel', duration: '6 hours', category: 'Productivity', checked: false },
    { id: '3', name: 'Safety Compliance 2025', duration: '3 hours', category: 'Compliance', checked: false },
    { id: '4', name: 'Emotional Intelligence', duration: '6 hours', category: 'Soft Skill', checked: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');

  const toggleCourse = (courseId: string) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, checked: !course.checked } : course
    ));
  };

  const handleSubmit = () => {
    const selectedCourses = courses.filter(course => course.checked);
    console.log('Submitted training plan:', selectedCourses);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Build your training plan</h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose courses you would like to participate in. Submit for HR approval.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colorg"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search....."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:Border-primary focus:outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:Border-primary focus:outline-none"
            >
              <option value="">Category</option>
              <option value="management">Management</option>
              <option value="productivity">Productivity</option>
              <option value="compliance">Compliance</option>
              <option value="soft-skills">Soft Skills</option>
            </select>
            <select
              value={selectedSkillLevel}
              onChange={(e) => setSelectedSkillLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:Border-primary focus:outline-none"
            >
              <option value="">Skill Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course List */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => toggleCourse(course.id)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex-shrink-0 w-5 h-5 mr-3 flex items-center justify-center">
                  {course.checked ? (
                    <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-sm"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{course.name}</div>
                  <div className="text-sm text-gray-500">{course.duration} | {course.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white"
            >
              Submit plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildTrainingPlanModal;
