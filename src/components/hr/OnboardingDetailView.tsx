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
  onBack: () => void;
  checklist?: {
    name?: string;
    email?: string;
    role?: string | null;
    start?: string | null;
    manager?: string | null;
    progress?: number;
    blockers?: number;
    status?: string;
  } | null;
}

const OnboardingDetailView: React.FC<OnboardingDetailViewProps> = ({ onBack, checklist }) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [currentCompletedTasks, setCurrentCompletedTasks] = useState<Set<string>>(completedTasks);
  const [isPositiveView, setIsPositiveView] = useState(false);

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">{title}</h3>
                {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                <span>Assignee: {assignee}</span>
                <span className="mx-2">•</span>
                <span>Due: {dueDate}</span>
              </div>
              {note && (
                <p className="mt-2 text-xs text-muted-foreground">{note}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleTaskToggle = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      setCurrentCompletedTasks(next);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4 cursor-pointer" onClick={onBack} />
        <span>Onboarding checklist</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{checklist?.name || 'Checklist'}</span>
            <Badge className="bg-muted text-muted-foreground">{checklist?.status || 'in_progress'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>Role: <span className="text-foreground">{checklist?.role || '—'}</span></div>
          <div>Start date: <span className="text-foreground">{checklist?.start || '—'}</span></div>
          <div>Manager: <span className="text-foreground">{checklist?.manager || '—'}</span></div>
          <div>Progress: <span className="text-foreground">{(checklist?.progress ?? 0)}%</span></div>
          <div>Blockers: <span className="text-foreground">{checklist?.blockers ?? 0}</span></div>
        </CardContent>
      </Card>

      {/* Example tasks (static for now) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TaskCard taskId="t1" title="Sign offer & policy docs" assignee={checklist?.name || '—'} dueDate={checklist?.start || '—'} icon={Shield} />
        <TaskCard taskId="t2" title="Create accounts & access" assignee={checklist?.manager || 'HR'} dueDate={checklist?.start || '—'} icon={Settings} />
        <TaskCard taskId="t3" title="Equipment & tools ready" assignee={checklist?.manager || 'IT'} dueDate={checklist?.start || '—'} icon={Code} />
        <TaskCard taskId="t4" title="First week schedule" assignee={checklist?.manager || '—'} dueDate={checklist?.start || '—'} icon={Users} />
      </div>

      <div className="flex justify-end">
        <Button onClick={onBack} variant="outline">Back</Button>
      </div>
    </div>
  );
};

export default OnboardingDetailView;
