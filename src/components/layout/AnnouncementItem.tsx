import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Clock } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Announcement {
  id: number;
  title: string;
  content: string;
  time: string;
  unread: boolean;
}

interface AnnouncementItemProps {
  announcement: Announcement;
  onMarkAsRead: (id: number) => void;
  onDismiss: (id: number, e: React.MouseEvent) => void;
}

const AnnouncementItem = ({ announcement, onMarkAsRead, onDismiss }: AnnouncementItemProps) => {
  return (
    <DropdownMenuItem
      key={announcement.id}
      className="flex flex-col items-start p-4 cursor-pointer border-b border-border last:border-b-0"
      onClick={() => onMarkAsRead(announcement.id)}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-sm font-medium ${announcement.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
              {announcement.title}
            </p>
            {announcement.unread && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{announcement.content}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{announcement.time}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-destructive/10 flex-shrink-0"
          onClick={(e) => onDismiss(announcement.id, e)}
        >
          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </DropdownMenuItem>
  );
};

export default AnnouncementItem;