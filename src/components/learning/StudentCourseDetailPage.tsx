import React, { useState } from 'react';
import { ArrowLeft, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressiveModules from './ProgressiveModules';
import ResourcesTab from './ResourcesTab';
import DiscussionTab from './DiscussionTab';
import CertificateModal from './CertificateModal';

interface StudentCourseDetailPageProps {
  courseId?: string;
}

const StudentCourseDetailPage: React.FC<StudentCourseDetailPageProps> = ({ courseId = '1' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCertificate, setShowCertificate] = useState(false);

  // Mock course data with student progress
  const course = {
    id: courseId,
    title: 'Responsive Design Principles',
    description: 'Understand the key concepts to create designs that adapt to various screen sizes.',
    difficulty: 'Beginner',
    instructor: 'Leslie Alex',
    instructorAvatar: '/placeholder-instructor.jpg',
    progress: 0, // This could be fetched from user's progress
    status: 'not-started', // not-started, in-progress, completed
    image: '/placeholder-course.jpg',
  };

  const learningObjectives = [
    'Explore the essential concepts of web accessibility to ensure your digital content is inclusive for everyone.',
    'Master techniques for crafting user-friendly experiences that cater to individuals with disabilities.',
    'Hone your ability to assess and enhance the accessibility of websites and applications effectively.'
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'modules', label: 'Modules' },
    { id: 'resources', label: 'Resources' },
    { id: 'discussion', label: 'Discussion' },
  ];

  const handleBackToWorkspace = () => {
    navigate('/dashboard/learning/course-workspace');
  };

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

  const getStatusButtonColor = () => {
    switch (course.status) {
      case 'not-started':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'in-progress':
      case 'completed':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <button
        onClick={handleBackToWorkspace}
        className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Course workspace
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
                <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 mb-4">
                  {course.difficulty}
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center space-x-3 mb-4">
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

              {/* Progress Tracking */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    Course Progress
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-700">
                      {course.progress}%
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full ${course.status === 'not-started' ? 'bg-gray-100 text-gray-600' : course.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {getStatusText()}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Course Hero Image */}
            <div className="h-64 lg:h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-2xl">
                    {course.title.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Course Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Tab Header */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning objectives:</h3>
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

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next lesson
                </button>
                <button className={`px-6 py-2 text-white rounded-md text-sm font-medium ${getStatusButtonColor()}`}>
                  {course.status === 'not-started' ? 'Start Course' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Modules</h3>
              <ProgressiveModules courseId={courseId} />
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              <ResourcesTab courseId={courseId} />
            </div>
          )}

          {activeTab === 'discussion' && (
            <div>
              <DiscussionTab courseId={courseId} />
            </div>
          )}
        </div>

        {/* Bottom Navigation - Consistent across all tabs */}
        <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border p-6 mt-6">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            Previous lesson
          </button>
          <button 
            onClick={() => setShowCertificate(true)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Preview certificate
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        courseTitle={course.title}
        studentName="Olivia Ford"
        completionDate="January 1, 2027"
      />
    </div>
  );
};

export default StudentCourseDetailPage;
