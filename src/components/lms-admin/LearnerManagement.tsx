import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Grid3X3, 
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const LearnerManagement = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const learners = [
    { 
      id: 1, 
      name: "Jane Doe", 
      email: "janedoe@gmail.com", 
      department: "Field Ops", 
      enrollments: 4, 
      progress: 0, 
      lastActive: "Jul 2, 2025 09:00 pm", 
      status: "Active" 
    },
    { 
      id: 2, 
      name: "Jane Doe", 
      email: "janedoe@gmail.com", 
      department: "Field Ops", 
      enrollments: 4, 
      progress: 5, 
      lastActive: "Jul 2, 2025 09:00 pm", 
      status: "Active" 
    },
    { 
      id: 3, 
      name: "Jane Doe", 
      email: "janedoe@gmail.com", 
      department: "Field Ops", 
      enrollments: 4, 
      progress: 5, 
      lastActive: "Jul 2, 2025 09:00 pm", 
      status: "Inactive" 
    },
    { 
      id: 4, 
      name: "Jane Doe", 
      email: "janedoe@gmail.com", 
      department: "Field Ops", 
      enrollments: 4, 
      progress: 5, 
      lastActive: "Jul 2, 2025 09:00 pm", 
      status: "Active" 
    },
    { 
      id: 5, 
      name: "Jane Doe", 
      email: "janedoe@gmail.com", 
      department: "Field Ops", 
      enrollments: 4, 
      progress: 100, 
      lastActive: "Jul 2, 2025 09:00 pm", 
      status: "Active" 
    },
    { 
      id: 6, 
      name: "Jane Doe", 
      email: "janedoe@gmail.com", 
      department: "Field Ops", 
      enrollments: 4, 
      progress: 5, 
      lastActive: "Jul 2, 2025 09:00 pm", 
      status: "Active" 
    },
    { 
      id: 7, 
      name: "Jane Doe", 
      email: "janedoe@gmail.com", 
      department: "Field Ops", 
      enrollments: 4, 
      progress: 50, 
      lastActive: "Jul 2, 2025 09:00 pm", 
      status: "Inactive" 
    },
    { 
      id: 8, 
      name: "Jane Doe", 
      email: "janedoe@gmail.com", 
      department: "Field Ops", 
      enrollments: 4, 
      progress: 5, 
      lastActive: "Jul 2, 2025 09:00 pm", 
      status: "Active" 
    }
  ];

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200";
    if (progress === 100) return "bg-purple-600";
    return "bg-purple-400";
  };

  const handleViewLearner = (learnerId: number) => {
    navigate(`/dashboard/lmsAdmin/learner-detail`);
  };

  const handleBulkUpload = () => {
    navigate(`/dashboard/lmsAdmin/bulk-enrollment`);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Learner management</h1>
      </div>

      {/* Tabs and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <button className="px-3 py-2 text-sm font-medium text-purple-600 border-b-2 border-purple-600">
              Learners list
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search learners..."
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
              <span className="text-sm text-foreground">Bulk action</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Filter</span>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Add learner</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-700">
                      Add manually
                    </button>
                    <button 
                      onClick={handleBulkUpload}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      Bulk upload
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Learners Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Enrollments</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Progress (%)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((learner) => (
                <tr key={learner.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{learner.name}</p>
                      <p className="text-xs text-gray-500">{learner.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{learner.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{learner.enrollments}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-8">{learner.progress}%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressBarColor(learner.progress)}`}
                          style={{ width: `${learner.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{learner.lastActive}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(learner.status)}`}>
                      {learner.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleViewLearner(learner.id)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
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
    </div>
  );
};

export default LearnerManagement;
