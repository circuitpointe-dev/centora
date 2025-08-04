import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Clock, MessageSquare, FileEdit, AlertTriangle } from 'lucide-react';

interface ToDoItem {
  id: string;
  type: 'Deadline' | 'Feedback' | 'Revision request' | 'Reminder';
  title: string;
  description: string;
  timeSince: string;
}

const toDoItems: ToDoItem[] = [
  {
    id: '1',
    type: 'Deadline',
    title: 'Proposal submission due in 3 days',
    description: 'Reminder: Proposal submission due in 3 days',
    timeSince: '23 min ago'
  },
  {
    id: '2',
    type: 'Feedback',
    title: 'Proposal submission due in 3 days',
    description: 'Reminder: Proposal submission due in 3 days',
    timeSince: '23 min ago'
  },
  {
    id: '3',
    type: 'Revision request',
    title: 'Proposal submission due in 3 days',
    description: 'Reminder: Proposal submission due in 3 days',
    timeSince: '23 min ago'
  },
  {
    id: '4',
    type: 'Feedback',
    title: 'Proposal submission due in 3 days',
    description: 'Reminder: Proposal submission due in 3 days',
    timeSince: '23 min ago'
  }
];

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
  return (
    <Card className="mb-6 border border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-600 flex items-center gap-2">
          To Do & Reminders
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">4</span>
        </CardTitle>
        <CardDescription>Stay on top of your grant management tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {toDoItems.map((item) => (
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
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};