import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  tag: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  thumbnail: string;
}

interface CourseCardProps {
  course: EnrolledCourse;
  onCourseClick: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseClick }) => {
  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200';
    if (progress === 100) return 'bg-green-500';
    return 'bg-yellow-400';
  };

  const getStatusText = () => {
    switch (course.status) {
      case 'not-started':
        return 'Not started';
      case 'in-progress':
        return 'In-progress';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  const getButtonText = () => {
    switch (course.status) {
      case 'not-started':
        return 'Start';
      case 'in-progress':
      case 'completed':
        return 'Continue';
      default:
        return 'Start';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onCourseClick(course.id)}
    >
      {/* Course Thumbnail */}
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img 
          src="/src/assets/images/dummy image.png" 
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
        
        {/* Tag */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {course.tag}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              {course.progress}% Complete
            </span>
            <span className="text-xs text-gray-500">{getStatusText()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(course.progress)}`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-medium transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onCourseClick(course.id);
          }}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

const EnrolledCoursesGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleCourseClick = (courseId: string) => {
    navigate(`/dashboard/learning/enrolled-course-${courseId}`);
  };
  
  const enrolledCourses: EnrolledCourse[] = [
    {
      id: '1',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      tag: 'Beginner',
      progress: 0,
      status: 'not-started',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: '2',
      title: 'Web Accessibility Basics',
      description: 'Learn the fundamentals of creating accessible web content for everyone.',
      tag: 'Beginner',
      progress: 43,
      status: 'in-progress',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: '3',
      title: 'Advanced SEO Techniques',
      description: 'Explore strategies to enhance your site\'s visibility and ranking on search engines.',
      tag: 'Self-paced',
      progress: 67,
      status: 'in-progress',
      thumbnail: '/placeholder.jpg'
    },
    {
      id: '4',
      title: 'Web Accessibility Basics',
      description: 'Learn the fundamentals of creating accessible web content for everyone.',
      tag: 'WCAG 2.2',
      progress: 100,
      status: 'completed',
      thumbnail: '/placeholder.jpg'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All courses</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search....."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onCourseClick={handleCourseClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCoursesGrid;
