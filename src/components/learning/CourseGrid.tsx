import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  thumbnail: string;
}

interface CourseCardProps {
  course: Course;
  onCourseClick: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseClick }) => {
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'self-paced':
        return 'bg-blue-100 text-blue-800';
      case 'wcag 2.2':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {course.tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-block px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Enroll Button */}
        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-900">${course.price}</div>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onCourseClick(course.id);
            }}
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const courses: Course[] = [
    {
      id: '1',
      title: 'Responsive Design Principles',
      description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
      tags: ['Beginner'],
      price: 10,
      thumbnail: '/placeholder.jpg'
    },
    {
      id: '2',
      title: 'Digital Governance Framework',
      description: 'Understand the principles and practices of effective digital governance in organizations.',
      tags: ['Self-paced'],
      price: 15,
      thumbnail: '/placeholder.jpg'
    },
    {
      id: '3',
      title: 'Data Privacy Essentials',
      description: 'Explore the key regulations and practices for maintaining data privacy in digital projects.',
      tags: ['WCAG 2.2'],
      price: 20,
      thumbnail: '/placeholder.jpg'
    },
    {
      id: '4',
      title: 'Financial Literacy for Beginners',
      description: 'Understand the basics of personal finance, budgeting, and savings.',
      tags: ['Beginner'],
      price: 15,
      thumbnail: '/placeholder.jpg'
    },
    {
      id: '5',
      title: 'Leadership Essentials',
      description: 'Explore key leadership theories and practical strategies for effective management.',
      tags: ['Self-paced'],
      price: 25,
      thumbnail: '/placeholder.jpg'
    },
    {
      id: '6',
      title: 'Investing 101',
      description: 'Discover the principles of investing in stocks, bonds, and mutual funds.',
      tags: ['WCAG 2.2'],
      price: 20,
      thumbnail: '/placeholder.jpg'
    },
  ];

  const totalCourses = 32;
  const coursesPerPage = 6;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  const handleCourseClick = (courseId: string) => {
    navigate(`/dashboard/learning/course-${courseId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Catalogue</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onCourseClick={handleCourseClick}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * coursesPerPage) + 1} to {Math.min(currentPage * coursesPerPage, totalCourses)} of {totalCourses} catalogue
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ArrowLeft size={16} className="inline mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
              <ArrowRight size={16} className="inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseGrid;