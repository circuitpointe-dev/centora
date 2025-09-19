import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Megaphone, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { formatDistanceToNow } from 'date-fns';
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

const AnnouncementDropdown = () => {
  const { announcements, loading } = useAnnouncements();
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [announcementToDismiss, setAnnouncementToDismiss] = useState<string | null>(null);

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return '🔧';
      case 'update': return '📝'; 
      case 'urgent': return '🚨';
      default: return 'ℹ️';
    }
  };

  const getAnnouncementBadgeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDismissClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnnouncementToDismiss(id);
    setDismissDialogOpen(true);
  };

  const confirmDismiss = () => {
    if (announcementToDismiss) {
      toast({
        title: "Announcement dismissed",
        description: "The announcement has been removed from your list.",
      });
    }
    setDismissDialogOpen(false);
    setAnnouncementToDismiss(null);
  };

  const unreadCount = announcements.length;

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
          
          {loading ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No announcements at this time
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="px-4 py-3 hover:bg-accent/50 border-b border-border last:border-b-0 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{getAnnouncementIcon(announcement.type)}</span>
                        <h4 className="font-medium text-sm text-foreground line-clamp-1">
                          {announcement.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAnnouncementBadgeColor(announcement.type)}`}>
                          {announcement.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
                        {announcement.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleDismissClick(announcement.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
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