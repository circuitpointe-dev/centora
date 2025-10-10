import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  CheckCircle, 
  Award, 
  Eye, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const CourseDetailView = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timePeriods = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setIsDropdownOpen(false);
  };

  const learners = [
    { name: "Jane Doe", email: "janedoe@gmail.com", dateAssigned: "Jul 2, 2025", status: "Enrolled" },
    { name: "John Smith", email: "johnsmith@gmail.com", dateAssigned: "Jul 2, 2025", status: "Enrolled" },
    { name: "Sarah Johnson", email: "sarah.johnson@gmail.com", dateAssigned: "Jul 2, 2025", status: "Enrolled" },
    { name: "Mike Wilson", email: "mike.wilson@gmail.com", dateAssigned: "Jul 2, 2025", status: "Enrolled" },
    { name: "Emily Davis", email: "emily.davis@gmail.com", dateAssigned: "Jul 2, 2025", status: "Enrolled" },
    { name: "David Brown", email: "david.brown@gmail.com", dateAssigned: "Jul 2, 2025", status: "Enrolled" },
    { name: "Lisa Anderson", email: "lisa.anderson@gmail.com", dateAssigned: "Jul 2, 2025", status: "Enrolled" },
    { name: "Tom Miller", email: "tom.miller@gmail.com", dateAssigned: "Jul 2, 2025", status: "Enrolled" }
  ];

  const linkedResources = [
    { name: "Presentation Slides (from media library)", status: "Enabled" },
    { name: "Kickoff Meeting (Zoom)", status: "Enabled" },
    { name: "Presentation Slides (Enabled)", status: "Enabled" }
  ];

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Course management</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm text-gray-700">{selectedPeriod}</span>
            <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {timePeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodSelect(period)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      selectedPeriod === period ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Overview Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Project management basics</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Understanding the Fundamentals of Project Management is essential for anyone looking to excel in the field. 
              This course covers key concepts such as project planning, execution, monitoring, and closure.
            </p>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">LA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Leslie Alex</p>
                <p className="text-xs text-gray-500">Author</p>
              </div>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Preview</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Enrollment Trends */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">548</p>
            <p className="text-sm font-medium text-gray-600">Enrollment trends</p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">76%</p>
            <p className="text-sm font-medium text-gray-600">Completion rate</p>
          </div>
        </div>

        {/* Issued Certificates */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">22</p>
            <p className="text-sm font-medium text-gray-600">Issued certificate</p>
          </div>
        </div>
      </div>

      {/* Enrollments & Access Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Enrollments & access</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Learner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date assigned</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((learner, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{learner.name}</p>
                      <p className="text-xs text-gray-500">{learner.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{learner.dateAssigned}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {learner.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Showing 1 to 8 of 12 learner list</p>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Compliance & Accessibility Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance & Accessibility</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-900">Passed accessibility scan</span>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
              Report
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-900">SCORM conferment</span>
          </div>
        </div>
      </div>

      {/* Linked Resources Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Linked Resourced</h3>
        <div className="space-y-3">
          {linkedResources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-900">{resource.name}</span>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  <Eye className="h-3 w-3" />
                  <span>Preview</span>
                </button>
                <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  <ExternalLink className="h-3 w-3" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;
