import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Clock, MessageSquare, FileEdit, AlertTriangle } from 'lucide-react';
import { useGrantTodos } from '@/hooks/grants/useGrantTodos';
import { useGrantReports } from '@/hooks/grants/useGrantReports';
import { useGrants } from '@/hooks/grants/useGrants';
import { ReportViewDialog } from '@/components/grants/view/ReportViewDialog';
import { toast } from 'sonner';

interface ToDoItem {
  id: string;
  type: 'Deadline' | 'Feedback' | 'Revision request' | 'Reminder';
  title: string;
  description: string;
  timeSince: string;
  grantId?: string;
  relatedId?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Deadline':
      return <Clock className="h-4 w-4" />;
    case 'Feedback':
      return <MessageSquare className="h-4 w-4" />;
    case 'Revision request':
      return <FileEdit className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Deadline':
      return 'text-red-600 bg-red-50';
    case 'Feedback':
      return 'text-blue-600 bg-blue-50';
    case 'Revision request':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const ToDoRemindersSection = () => {
  const { todos, loading, markAsCompleted, deleteTodo } = useGrantTodos();
  const { reports, updateReport } = useGrantReports();
  const { grants } = useGrants();
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const handleView = (item: ToDoItem) => {
    console.log('View clicked for item:', item);
    
    // For Deadline type items, open the report dialog
    if (item.type === 'Deadline' && item.relatedId) {
      const report = reports.find(r => r.id === item.relatedId);
      console.log('Found report:', report);
      
      if (report) {
        // Attach grant information to the report
        const grant = grants.find(g => g.id === report.grant_id);
        console.log('Found grant:', grant);
        
        const reportWithGrant = {
          ...report,
          grant
        };
        
        setSelectedReport(reportWithGrant);
        setShowViewDialog(true);
      } else {
        toast.error('Report not found');
      }
    }
  };

  const handleMarkAsDone = async (item: ToDoItem) => {
    try {
      // If it's a deadline for a report, mark the report as submitted
      if (item.type === 'Deadline' && item.relatedId) {
        await updateReport(item.relatedId, {
          status: 'submitted',
          submitted: true,
          submitted_date: new Date().toISOString().split('T')[0]
        });
      }
      
      // Delete the todo item
      await deleteTodo(item.id);
      toast.success('Marked as done');
    } catch (error) {
      console.error('Failed to mark as done:', error);
      toast.error('Failed to mark as done');
    }
  };

  if (loading) {
    return (
      <Card className="mb-6 border border-purple-200">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading tasks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-600 flex items-center gap-2">
          To Do & Reminders
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">{todos.length}</span>
        </CardTitle>
        <CardDescription>Stay on top of your grant management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        {todos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pending tasks. Great job staying on top of things!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {todos.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Type Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                    {item.type}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    <p className="text-xs text-gray-500">{item.timeSince}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => handleView(item)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs"
                      onClick={() => handleMarkAsDone(item)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Done
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </CardContent>
      
      {showViewDialog && selectedReport && (
        <ReportViewDialog
          report={selectedReport}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />
      )}
    </Card>
  );
};