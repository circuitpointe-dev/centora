import React, { useState } from 'react';
import { 
  Send, 
  RotateCcw, 
  UserX, 
  FileText, 
  BookOpen, 
  Award, 
  Clock,
  Eye,
  Download
} from 'lucide-react';

const LearnerDetailView = () => {
  const [activeTab, setActiveTab] = useState('enrollments');

  const tabs = [
    { id: 'enrollments', label: 'Enrollments' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'compliance', label: 'Compliance & Alerts' },
    { id: 'audit', label: 'Audit Logs' }
  ];

  const enrollments = [
    {
      id: 1,
      course: "Introduction to digital tools",
      modules: "2 in progress",
      score: "10%",
      lastActivity: "Jul 2, 2025 09:00 pm",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      course: "Advanced data visualization techniques",
      modules: "Complete",
      score: "30%",
      lastActivity: "Aug 15, 2025 10:30 am",
      status: "In progress",
      statusColor: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 3,
      course: "User experience principles",
      modules: "Not started",
      score: "0%",
      lastActivity: "Sep 20, 2025 11:00 am",
      status: "Overdue",
      statusColor: "bg-red-100 text-red-800"
    },
    {
      id: 4,
      course: "Introduction to machine learning",
      modules: "1 completed",
      score: "100%",
      lastActivity: "Jun 10, 2025 02:00 pm",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800"
    }
  ];

  const certificates = [
    {
      id: 1,
      course: "Introduction to digital tools",
      issueDate: "Jul 2, 2025 09:00 pm"
    },
    {
      id: 2,
      course: "Advanced data visualization techniques",
      issueDate: "Aug 15, 2025 10:30 am"
    },
    {
      id: 3,
      course: "User experience principles",
      issueDate: "Sep 20, 2025 11:00 am"
    },
    {
      id: 4,
      course: "Introduction to machine learning",
      issueDate: "Jun 10, 2025 02:00 pm"
    }
  ];

  const auditLogs = [
    {
      id: 1,
      action: "Completed module: \"Advanced data analysis\"",
      timestamp: "April 30, 2025 2:30 pm"
    },
    {
      id: 2,
      action: "Created a discussion post on: \"Impact of AI in education\"",
      timestamp: "April 29, 2025 10:00 am"
    },
    {
      id: 3,
      action: "Achieved a quiz score of 85% in: \"Fundamentals of UX design\"",
      timestamp: "April 28, 2025 1:45 pm"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'enrollments':
        return (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Modules</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Last activity</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b border-border hover:bg-accent">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-foreground">{enrollment.course}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{enrollment.modules}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{enrollment.score}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{enrollment.lastActivity}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${enrollment.statusColor}`}>
                          {enrollment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'certificates':
        return (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Issue date</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((certificate) => (
                    <tr key={certificate.id} className="border-b border-border hover:bg-accent">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-foreground">{certificate.course}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{certificate.issueDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </button>
                          <button className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <Download className="h-3 w-3" />
                            <span>Download</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'compliance':
        return (
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <p className="text-muted-foreground">Compliance & Alerts content will be displayed here.</p>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{log.action}</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Learner management</h1>
      </div>

      {/* Learner Profile Card */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-start space-x-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-medium text-muted-foreground">JD</span>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mb-2">
              Active
            </span>
          </div>
          
          {/* Learner Details */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">Jane Doe</h2>
            <p className="text-muted-foreground mb-1">janedoe@gmail.com</p>
            <p className="text-muted-foreground">Field Ops</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
              <Send className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Send remainder</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Reset password</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-border rounded-lg bg-background hover:bg-accent transition-colors">
              <UserX className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Deactivate</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Quick enroll</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-16 w-16 mb-4">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#8b5cf6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="175.93"
                  strokeDashoffset="61.58"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600">65%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Overall progress (%)</p>
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">4</p>
            <p className="text-sm font-medium text-muted-foreground">Enrollments</p>
          </div>
        </div>

        {/* Total Certificates */}
        <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">2</p>
            <p className="text-sm font-medium text-muted-foreground">Total certificates</p>
          </div>
        </div>

        {/* Last Activity */}
        <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-bold text-foreground mb-1">Aug 7, 2023</p>
            <p className="text-sm font-medium text-muted-foreground">Last activity</p>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <div className="space-y-4">
        <div className="flex items-center space-x-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default LearnerDetailView;
