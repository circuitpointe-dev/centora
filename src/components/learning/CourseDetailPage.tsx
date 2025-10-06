import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseModules from './CourseModules';

interface CourseDetailPageProps {
  courseId?: string;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId = '1' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock course data
  const course = {
    id: courseId,
    title: 'Responsive Design Principles',
    description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
    difficulty: 'Beginner',
    instructor: 'Leslie Alex',
    instructorAvatar: '/placeholder-instructor.jpg',
    price: 10,
    image: '/placeholder-course.jpg',
  };

  const learningObjectives = [
    'Explore the essential concepts of web accessibility to ensure your digital content is inclusive for everyone.',
    'Master techniques for crafting user-friendly experiences that cater to individuals with disabilities.',
    'Hone your ability to assess and enhance the accessibility of websites and applications effectively.'
  ];

  const handleBackToCatalogue = () => {
    navigate('/dashboard/learning/catalogue');
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <button
        onClick={handleBackToCatalogue}
        className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to catalogue
      </button>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                {/* Difficulty Badge */}
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                  {course.difficulty}
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium text-lg">
                    {course.instructor.split(' ').map(name => name[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{course.instructor}</div>
                  <div className="text-sm text-gray-500">Instructor</div>
                </div>
              </div>

              {/* Price and Enroll */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-3xl font-bold text-gray-900">${course.price}</div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                  Enroll
                </button>
              </div>
            </div>

            {/* Course Hero Image */}
            <div className="h-64 lg:h-80 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/src/assets/images/dummy image.png" 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tab Header */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'modules'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Modules
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h3>
              <ul className="space-y-3">
                {learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    </span>
                    <span className="ml-3 text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'modules' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h3>
              <CourseModules courseId={courseId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
