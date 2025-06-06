
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  return (
    <DropdownMenuItem
      key={notification.id}
      className="flex flex-col items-start p-3 cursor-pointer"
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex-1">
          <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-600'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          {notification.unread && (
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-red-100"
            onClick={(e) => onDelete(notification.id, e)}
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
