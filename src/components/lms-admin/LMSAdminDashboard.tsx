import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  FileText, 
  AlertTriangle, 
  Plus, 
  Settings, 
  Upload, 
  BarChart3,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const LMSAdminDashboard = () => {
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

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Dashboard Title and Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Courses */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">314</p>
            <p className="text-sm font-medium text-gray-600">Total courses</p>
          </div>
        </div>

        {/* Active Learners */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">1502</p>
            <p className="text-sm font-medium text-gray-600">Active learners</p>
          </div>
        </div>

        {/* Completions */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">7200</p>
            <p className="text-sm font-medium text-gray-600">Completions</p>
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">185</p>
            <p className="text-sm font-medium text-gray-600">Enrollments</p>
          </div>
        </div>
      </div>

      {/* Alerts and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-900">Missing captions in 2 course</p>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-900">License expiring in 7 days</p>
            </div>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Activity feed</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">
                    Course <span className="underline">"Leadership 101"</span> published by admin
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">
                    Lerner <span className="underline">"John doe"</span> enrolled in <span className="underline">"Budget planning"</span>
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Plus className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Create course</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Manage learners</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Upload className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Upload media</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Run reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LMSAdminDashboard;
