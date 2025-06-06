
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import NotificationItem from './NotificationItem';
import SendNotificationDialog from './SendNotificationDialog';

const mockNotifications = [
  {
    id: 1,
    title: "New donor registered",
    message: "Jane Smith has registered as a new donor",
    time: "2 min ago",
    unread: true
  },
  {
    id: 2,
    title: "Campaign milestone reached",
    message: "Education for All campaign has reached 75% of its goal",
    time: "1 hour ago",
    unread: true
  },
  {
    id: 3,
    title: "Monthly report ready",
    message: "Your monthly fundraising report is now available",
    time: "3 hours ago",
    unread: false
  },
  {
    id: 4,
    title: "Event reminder",
    message: "Annual Gala is scheduled for next week",
    time: "1 day ago",
    unread: false
  },
  {
    id: 5,
    title: "System maintenance",
    message: "Scheduled maintenance tonight from 2-4 AM",
    time: "2 days ago",
    unread: false
  }
];

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNewNotification, setShowNewNotification] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const deleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
    });
  };

  const handleSendNotification = (notification: { title: string; message: string; recipients: string[] }) => {
    const newNotif = {
      id: Date.now(),
      title: notification.title,
      message: notification.message,
      time: "Just now",
      unread: true
    };
    
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-white" align="end" forceMount>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <Badge variant="secondary">{unreadCount} new</Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setShowNewNotification(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Send Notification</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SendNotificationDialog
        isOpen={showNewNotification}
        onClose={() => setShowNewNotification(false)}
        onSend={handleSendNotification}
      />
    </>
  );
};

export default NotificationDropdown;
