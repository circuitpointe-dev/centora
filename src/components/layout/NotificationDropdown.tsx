
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
import { Bell, Plus, Trash2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { staffList, Staff } from '@/data/staffData';

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
    message: '',
    recipients: [] as string[]
  });
  const [open, setOpen] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);

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

  const handleRecipientSelect = (staffId: string) => {
    if (sendToAll) return;
    
    setNewNotification(prev => ({
      ...prev,
      recipients: prev.recipients.includes(staffId)
        ? prev.recipients.filter(id => id !== staffId)
        : [...prev.recipients, staffId]
    }));
  };

  const handleSendToAllChange = (checked: boolean) => {
    setSendToAll(checked);
    if (checked) {
      setNewNotification(prev => ({
        ...prev,
        recipients: staffList.map(staff => staff.id)
      }));
    } else {
      setNewNotification(prev => ({
        ...prev,
        recipients: []
      }));
    }
  };

  const handleSendNotification = () => {
    const recipientNames = sendToAll 
      ? ['All Staff']
      : newNotification.recipients.map(id => 
          staffList.find(staff => staff.id === id)?.name
        ).filter(Boolean);

    const newNotif = {
      id: Date.now(),
      title: newNotification.title,
      message: newNotification.message,
      time: "Just now",
      unread: true
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    setNewNotification({ title: '', message: '', recipients: [] });
    setSendToAll(false);
    setShowNewNotification(false);
    
    toast({
      title: "Notification Sent",
      description: `Notification sent to ${recipientNames.join(', ')}.`,
    });
  };

  const getSelectedStaffNames = () => {
    if (sendToAll) return 'All Staff';
    if (newNotification.recipients.length === 0) return 'Select recipients...';
    
    const names = newNotification.recipients.map(id => 
      staffList.find(staff => staff.id === id)?.name
    ).filter(Boolean);
    
    if (names.length > 2) {
      return `${names.slice(0, 2).join(', ')} +${names.length - 2} more`;
    }
    return names.join(', ');
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
                  <div className="flex items-center gap-1 ml-2">
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-red-100"
                      onClick={(e) => deleteNotification(notification.id, e)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
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
              <Label htmlFor="notif-to">To</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="send-to-all"
                    checked={sendToAll}
                    onCheckedChange={handleSendToAllChange}
                  />
                  <Label htmlFor="send-to-all" className="text-sm">Send to all staff</Label>
                </div>
                
                {!sendToAll && (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {getSelectedStaffNames()}
                        <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search staff..." />
                        <CommandList>
                          <CommandEmpty>No staff found.</CommandEmpty>
                          <CommandGroup>
                            {staffList.map((staff) => (
                              <CommandItem
                                key={staff.id}
                                onSelect={() => handleRecipientSelect(staff.id)}
                              >
                                <Checkbox
                                  checked={newNotification.recipients.includes(staff.id)}
                                  onChange={() => handleRecipientSelect(staff.id)}
                                  className="mr-2"
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{staff.name}</span>
                                  <span className="text-xs text-gray-500">{staff.role}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            
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
                disabled={!newNotification.title || !newNotification.message || (!sendToAll && newNotification.recipients.length === 0)}
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
