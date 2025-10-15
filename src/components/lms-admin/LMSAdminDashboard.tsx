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
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Dashboard Title and Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
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
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${
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

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Courses */}
        <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">314</p>
            <p className="text-sm font-medium text-muted-foreground">Total courses</p>
          </div>
        </div>

        {/* Active Learners */}
        <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">1502</p>
            <p className="text-sm font-medium text-muted-foreground">Active learners</p>
          </div>
        </div>

        {/* Completions */}
        <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">7200</p>
            <p className="text-sm font-medium text-muted-foreground">Completions</p>
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">185</p>
            <p className="text-sm font-medium text-muted-foreground">Enrollments</p>
          </div>
        </div>
      </div>

      {/* Alerts and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Section */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">Missing captions in 2 course</p>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">License expiring in 7 days</p>
            </div>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Activity feed</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground">
                    Course <span className="underline">"Leadership 101"</span> published by admin
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground">
                    Lerner <span className="underline">"John doe"</span> enrolled in <span className="underline">"Budget planning"</span>
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Quick action</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-muted border border-border rounded-lg hover:bg-accent transition-colors">
            <Plus className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Create course</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-muted border border-border rounded-lg hover:bg-accent transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Manage learners</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-muted border border-border rounded-lg hover:bg-accent transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Upload media</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-muted border border-border rounded-lg hover:bg-accent transition-colors">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Run reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LMSAdminDashboard;
