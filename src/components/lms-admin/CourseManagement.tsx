import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Trash2, 
  Plus, 
  Eye, 
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CourseManagement = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleViewCourse = (courseId: number) => {
    console.log('Navigating to course detail:', courseId);
    const url = `/dashboard/lmsAdmin/course-detail`;
    console.log('Navigation URL:', url);
    navigate(url);
  };

  const courses = [
    {
      id: 1,
      title: "Project management basics",
      description: "Introduction to project management",
      learners: 35,
      author: { name: "Leslie Alex", role: "Author", avatar: "LA" },
      date: "Oct 25, 2025",
      time: "05:00 PM",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 2,
      title: "Advanced UX Design",
      description: "Deep dive into user experience",
      learners: 50,
      author: { name: "Jessica Racheal", role: "Admin", avatar: "JR" },
      date: "Nov 10, 2025",
      time: "03:00 PM",
      status: "Archived",
      statusColor: "bg-muted text-muted-foreground"
    },
    {
      id: 3,
      title: "Data Analysis for Beginners",
      description: "Fundamentals of data interpretation",
      learners: 40,
      author: { name: "Jessica Racheal", role: "Admin", avatar: "JR" },
      date: "Dec 15, 2025",
      time: "01:00 PM",
      status: "Published",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 4,
      title: "Advanced Agile Techniques",
      description: "Deep dive into Agile methodologies",
      learners: 50,
      author: { name: "Jordan Lee", role: "Instructor", avatar: "JL" },
      date: "Nov 15, 2025",
      time: "10:00 AM",
      status: "Published",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 5,
      title: "Effective Communication in Teams",
      description: "Building strong team communication",
      learners: 40,
      author: { name: "Annette Black", role: "Instructor", avatar: "AB" },
      date: "Dec 5, 2025",
      time: "02:00 PM",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 6,
      title: "Risk Management Strategies",
      description: "Identifying and mitigating risks",
      learners: 30,
      author: { name: "Eleanor Pena", role: "Instructor", avatar: "EP" },
      date: "Jan 10, 2026",
      time: "01:00 PM",
      status: "Published",
      statusColor: "bg-green-100 text-green-800"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Course management</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg bg-background hover:bg-accent transition-colors"
          >
            <span className="text-sm text-foreground">{selectedPeriod}</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-popover border border-border rounded-lg shadow-lg z-10">
              <div className="py-1">
                {timePeriods.map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodSelect(period)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      selectedPeriod === period ? 'bg-accent text-accent-foreground font-medium' : 'text-foreground'
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

      {/* Course Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Courses */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">110</p>
            <p className="text-sm font-medium text-gray-600">Total courses</p>
          </div>
        </div>

        {/* Published Courses */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">95</p>
            <p className="text-sm font-medium text-gray-600">Published courses</p>
          </div>
        </div>

        {/* Draft Courses */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">10</p>
            <p className="text-sm font-medium text-gray-600">Draft courses</p>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">5</p>
            <p className="text-sm font-medium text-muted-foreground">Pending approval</p>
          </div>
        </div>
      </div>

      {/* Courses List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Courses list</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users, department..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <Trash2 className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Delete</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Add course</span>
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="space-y-4">
                {/* Course Title and Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>

                {/* Learners Count */}
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {course.learners} learners
                  </span>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">{course.author.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.author.name}</p>
                    <p className="text-xs text-gray-500">{course.author.role}</p>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="text-sm text-gray-600">
                  <p>{course.date}</p>
                  <p>{course.time}</p>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${course.statusColor}`}>
                    {course.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleViewCourse(course.id)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                    {course.status === "Archived" && (
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors">
                        <Archive className="h-3 w-3" />
                        <span>Rearchived</span>
                      </button>
                    )}
                    {course.status === "Published" && (
                      <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors">
                        <Archive className="h-3 w-3" />
                        <span>Archived</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-6">
          <p className="text-sm text-gray-600">Showing 1 to 8 of 12 course list</p>
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
    </div>
  );
};

export default CourseManagement;
