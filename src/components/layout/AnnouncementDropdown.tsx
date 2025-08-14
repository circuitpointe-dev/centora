import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AnnouncementItem from './AnnouncementItem';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Announcement {
  id: number;
  title: string;
  content: string;
  time: string;
  unread: boolean;
}

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    content: "The system will undergo scheduled maintenance on Friday, December 15th from 2:00 AM to 4:00 AM EST. During this time, some features may be temporarily unavailable.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "New Grant Opportunity Available",
    content: "We've identified a new grant opportunity from the Global Health Foundation. The deadline is January 30th. Please review the eligibility criteria and submit your application through the grants portal.",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 3,
    title: "Policy Update: Data Protection",
    content: "Updated data protection policies are now in effect. All team members are required to complete the new compliance training by the end of this month.",
    time: "3 days ago",
    unread: false,
  },
  {
    id: 4,
    title: "Quarterly Review Meeting",
    content: "All department heads are invited to the quarterly review meeting scheduled for next Tuesday at 10:00 AM in the main conference room.",
    time: "1 week ago",
    unread: false,
  },
];

const DISMISSED_ANNOUNCEMENTS_KEY = 'dismissedAnnouncements';

const AnnouncementDropdown = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [announcementToDismiss, setAnnouncementToDismiss] = useState<number | null>(null);

  useEffect(() => {
    // Load dismissed announcements from localStorage
    const dismissed = JSON.parse(localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY) || '[]');
    const filteredAnnouncements = mockAnnouncements.filter(
      announcement => !dismissed.includes(announcement.id)
    );
    setAnnouncements(filteredAnnouncements);
  }, []);

  const unreadCount = announcements.filter(announcement => announcement.unread).length;

  const markAsRead = (id: number) => {
    setAnnouncements(prev =>
      prev.map(announcement =>
        announcement.id === id ? { ...announcement, unread: false } : announcement
      )
    );
  };

  const handleDismissClick = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnnouncementToDismiss(id);
    setDismissDialogOpen(true);
  };

  const confirmDismiss = () => {
    if (announcementToDismiss) {
      // Remove from current state
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== announcementToDismiss));
      
      // Add to dismissed list in localStorage
      const dismissed = JSON.parse(localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY) || '[]');
      dismissed.push(announcementToDismiss);
      localStorage.setItem(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify(dismissed));
      
      toast({
        title: "Announcement dismissed",
        description: "The announcement has been removed from your list.",
      });
    }
    setDismissDialogOpen(false);
    setAnnouncementToDismiss(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-8 w-8 p-0 hover:bg-accent"
          >
            <Megaphone className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-80 max-h-96 overflow-y-auto bg-background border border-border shadow-lg"
          sideOffset={8}
        >
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm text-foreground">Announcements</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {unreadCount} unread
              </p>
            )}
          </div>
          
          {announcements.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No announcements at this time
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {announcements.map((announcement) => (
                <AnnouncementItem
                  key={announcement.id}
                  announcement={announcement}
                  onMarkAsRead={markAsRead}
                  onDismiss={handleDismissClick}
                />
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dismissDialogOpen} onOpenChange={setDismissDialogOpen}>
        <AlertDialogContent className="bg-background border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Dismiss Announcement</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to dismiss this announcement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDismiss}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Dismiss
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AnnouncementDropdown;