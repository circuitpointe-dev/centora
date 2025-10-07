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
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'self-paced':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
      case 'wcag 2.2':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div 
      className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onCourseClick(course.id)}
    >
      {/* Course Thumbnail */}
      <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
        <img 
          src="/src/assets/images/dummy image.png" 
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
        
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
          <div className="font-semibold text-card-foreground">${course.price}</div>
          <button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
    <div className="bg-card rounded-lg shadow-sm border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">Catalogue</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search....."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
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
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * coursesPerPage) + 1} to {Math.min(currentPage * coursesPerPage, totalCourses)} of {totalCourses} catalogue
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-border bg-background text-foreground rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              <ArrowLeft size={16} className="inline mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-border bg-background text-foreground rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
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