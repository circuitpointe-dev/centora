import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressUpdateModal from './ProgressUpdateModal';
import {
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  CheckCircle,
  Circle,
  Calendar,
  User,
  Target,
  BarChart3,
  Clock
} from 'lucide-react';

interface GoalDetailViewProps {
  onBack: () => void;
}

const GoalDetailView: React.FC<GoalDetailViewProps> = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    alignment: true,
    progress: true,
    activity: true
  });
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleProgressUpdate = (newProgress: number, achievement: string, nextSteps: string) => {
    console.log('Progress updated:', { newProgress, achievement, nextSteps });
    // Here you would typically update the goal data and send to backend
  };

  const goalData = {
    title: "Improve NPS Score",
    type: "OKR",
    description: "View and manage goal details, progress updates, and alignment information.",
    detailedDescription: "Increase customer Net Promoter Score from 7.2 to 8.5",
    progress: 65,
    status: "On track",
    statusColor: "bg-green-100 text-green-800",
    owner: "Jane Doe",
    weight: "30%",
    nextCheckIn: "Jul 2, 2025",
    companyOkr: "Customer satisfaction",
    milestones: [
      { id: 1, label: "25% - Foundation Complete", completed: true },
      { id: 2, label: "50% - Halfway Point", completed: true },
      { id: 3, label: "75% - Near Completion", completed: false },
      { id: 4, label: "100% - Goal Achieved", completed: false }
    ],
    activities: [
      { id: 1, action: "Goal created", user: "Adam Mark", date: "Jan 01, 2025" },
      { id: 2, action: "Progress updated to 65%", user: "Jane Doe", date: "Feb 15, 2025" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button 
          onClick={onBack}
          className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Performance management</span>
        </button>
        <span>/</span>
        <span>KPIs & Objectives</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">detailed view</span>
      </div>

      {/* Goal Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{goalData.title}</h1>
                <Badge variant="outline" className="text-gray-600">
                  {goalData.type}
                </Badge>
              </div>
              <p className="text-gray-600">{goalData.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Details Section */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('details')}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
            >
              {expandedSections.details ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
              <span>Details</span>
            </button>
            
            {expandedSections.details && (
              <div className="space-y-4 pl-7">
                <div>
                  <p className="text-gray-700 mb-4">{goalData.detailedDescription}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">{goalData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goalData.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={goalData.statusColor}>{goalData.status}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{goalData.owner}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{goalData.weight}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{goalData.nextCheckIn}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Goal Alignment Tree Section */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('alignment')}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
            >
              {expandedSections.alignment ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
              <span>Goal alignment tree</span>
            </button>
            
            {expandedSections.alignment && (
              <div className="pl-7">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Company OKR: {goalData.companyOkr}</span>
                  </div>
                  <div className="flex items-center space-x-2 ml-6">
                    <div className="w-px h-6 bg-gray-300 ml-2"></div>
                    <div className="w-2 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-600">{goalData.title}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Updates Section */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('progress')}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
            >
              {expandedSections.progress ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
              <span>Progress updates</span>
            </button>
            
            {expandedSections.progress && (
              <div className="pl-7 space-y-6">
                {/* Quick Progress Update Buttons */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Progress Update</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setIsProgressModalOpen(true)}
                    >
                      +10% Good Progress
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setIsProgressModalOpen(true)}
                    >
                      +25% Major Progress
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setIsProgressModalOpen(true)}
                    >
                      Mark Complete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setIsProgressModalOpen(true)}
                    >
                      Detailed Update
                    </Button>
                  </div>
                </div>

                {/* Goal Milestones */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Goal milestones</h4>
                  <div className="space-y-2">
                    {goalData.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-3">
                        {milestone.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                        <span className={`text-sm ${milestone.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {milestone.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Log Section */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('activity')}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
            >
              {expandedSections.activity ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
              <span>Activity log</span>
            </button>
            
            {expandedSections.activity && (
              <div className="pl-7">
                <div className="space-y-3">
                  {goalData.activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{activity.action}</span>
                        <span className="text-sm text-gray-500">by {activity.user}</span>
                      </div>
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Update Modal */}
      <ProgressUpdateModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        goalTitle={goalData.title}
        currentProgress={goalData.progress}
        onUpdateProgress={handleProgressUpdate}
      />
    </div>
  );
};

export default GoalDetailView;
