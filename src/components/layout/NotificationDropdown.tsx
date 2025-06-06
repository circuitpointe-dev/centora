
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

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
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: ''
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const handleSendNotification = () => {
    const newNotif = {
      id: Date.now(),
      title: newNotification.title,
      message: newNotification.message,
      time: "Just now",
      unread: true
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    setNewNotification({ title: '', message: '' });
    setShowNewNotification(false);
    
    toast({
      title: "Notification Sent",
      description: "Your notification has been sent successfully.",
    });
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
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></div>
                  )}
                </div>
              </DropdownMenuItem>
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

      {/* New Notification Dialog */}
      <Dialog open={showNewNotification} onOpenChange={setShowNewNotification}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send New Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notif-title">Title</Label>
              <Input
                id="notif-title"
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notification title"
              />
            </div>
            <div>
              <Label htmlFor="notif-message">Message</Label>
              <Textarea
                id="notif-message"
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter notification message"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewNotification(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendNotification}
                disabled={!newNotification.title || !newNotification.message}
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationDropdown;
