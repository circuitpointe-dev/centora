import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Check,
  Shield,
  Users,
  Settings,
  Code,
  BarChart3,
  Rocket
} from 'lucide-react';

interface OnboardingDetailViewProps {
  onBack?: () => void;
}

const OnboardingDetailView: React.FC<OnboardingDetailViewProps> = ({ onBack }) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(['offer-accepted']));
  const [isPositiveView, setIsPositiveView] = useState(false);

  // Define all task IDs
  const allTaskIds = [
    'offer-accepted',
    'document-signed', 
    'security-badge-setup',
    'access-codebase',
    'user-feedback-analysis',
    'deployment-features'
  ];

  // Get current completed tasks based on view mode
  const getCurrentCompletedTasks = () => {
    if (isPositiveView) {
      return new Set(allTaskIds);
    }
    return completedTasks;
  };

  const currentCompletedTasks = getCurrentCompletedTasks();

  const handleTaskToggle = (taskId: string) => {
    if (isPositiveView) {
      // In positive view, don't allow toggling
      return;
    }
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const isOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  const TaskCard = ({ 
    taskId, 
    title, 
    assignee, 
    dueDate, 
    note, 
    icon: Icon 
  }: {
    taskId: string;
    title: string;
    assignee: string;
    dueDate: string;
    note?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }) => {
    const isCompleted = currentCompletedTasks.has(taskId);
    const overdue = isOverdue(dueDate) && !isPositiveView;
    
    return (
      <Card className={`transition-all duration-200 ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {isCompleted ? (
                <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : (
                <Checkbox 
                  checked={false}
                  onCheckedChange={() => handleTaskToggle(taskId)}
                  disabled={isPositiveView}
                  className="w-5 h-5"
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-medium ${isCompleted ? 'text-green-800 line-through' : 'text-foreground'}`}>
                  {title}
                </h3>
                {overdue && !isCompleted && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Assigned to:</span>
                  <span className="ml-1">{assignee}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium">Due date:</span>
                  <span className={`ml-1 ${overdue && !isCompleted ? 'text-red-600 font-medium' : ''}`}>
                    {dueDate}
                  </span>
                </div>
                
                {note && (
                  <div className="text-sm text-muted-foreground italic mt-2">
                    {note}
                  </div>
                )}
              </div>
            </div>
            
            {Icon && (
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Button>
          <span>Onboarding checklist</span>
          <span>/</span>
          <span className="text-foreground font-medium">Hire detail view</span>
        </div>
        
        {/* View Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setIsPositiveView(!isPositiveView)}
          className="flex items-center gap-2"
        >
          {isPositiveView ? 'Show Current Status' : 'Show Positive View'}
        </Button>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Sarah Chen - Onboarding</h1>
        <p className="text-muted-foreground">
          Track onboarding progress, view tasks by category, and manage completion status for this new hire.
        </p>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Position</label>
              <p className="text-foreground">Software Engineer</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Start date</label>
              <p className="text-foreground">Aug 5, 2025</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Manager</label>
              <p className="text-foreground">Alicia smith</p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted-foreground">Progress</label>
              <span className="text-sm font-medium text-foreground">
                {isPositiveView ? '100%' : '62%'}
              </span>
            </div>
            <Progress value={isPositiveView ? 100 : 62} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Pre-Day 1 Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Pre-Day 1</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaskCard
            taskId="offer-accepted"
            title="Offer accepted"
            assignee="HR Team"
            dueDate="Jul 15, 2025"
            icon={Users}
          />
          
          <TaskCard
            taskId="document-signed"
            title="Document signed"
            assignee="HR Team"
            dueDate="Jul 20, 2025"
            note="Missing tax forms"
            icon={Users}
          />
          
          <TaskCard
            taskId="security-badge-setup"
            title="Security badge setup"
            assignee="Facilities"
            dueDate="Aug 1, 2025"
            note="Background check pending"
            icon={Shield}
          />
        </div>
      </div>

      {/* Day 1 Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Day 1 - Aug 15, 2025</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaskCard
            taskId="access-codebase"
            title="Access to the codebase"
            assignee="IT Team"
            dueDate="Aug 15, 2025"
            icon={Code}
          />
          
          <TaskCard
            taskId="user-feedback-analysis"
            title="User feedback analysis"
            assignee="Product Management"
            dueDate="Aug 15, 2025"
            icon={BarChart3}
          />
          
          <TaskCard
            taskId="deployment-features"
            title="Deployment of new features"
            assignee="Development Team"
            dueDate="Aug 15, 2025"
            icon={Rocket}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingDetailView;
