
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddNotesDialog } from "@/components/fundraising/AddNotesDialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Message {
  id: number;
  author: string;
  timestamp: string;
  content: string;
  avatar: string;
}

export const CommunicationsSection: React.FC = () => {
  const { user } = useAuth();
  const [addNotesOpen, setAddNotesOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "John Doe",
      timestamp: "April 10th, 2:13 AM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nibh sit enim sagittis in duis non dolor sagittis eu.",
      avatar: "https://c.animaapp.com/LmQp0a9i/img/profile-picture-2-5@2x.png",
    },
    {
      id: 2,
      author: "Jane Smith",
      timestamp: "April 11th, 10:45 AM",
      content:
        "Please review the documents I shared yesterday and let me know your feedback.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      author: "Mike Johnson",
      timestamp: "April 12th, 4:30 PM",
      content:
        "The project timeline has been updated. Check the shared spreadsheet for details.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 4,
      author: "Sarah Wilson",
      timestamp: "April 13th, 9:20 AM",
      content:
        "Great progress on the fundraising campaign! We've reached 75% of our goal.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 5,
      author: "David Brown",
      timestamp: "April 14th, 1:15 PM",
      content:
        "Meeting scheduled for next week to discuss the new partnership opportunities.",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      id: 6,
      author: "Emily Davis",
      timestamp: "April 15th, 11:30 AM",
      content:
        "The quarterly report is ready for review. Please let me know if you need any additional information.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
  ]);

  const handleAddNote = (noteContent: string) => {
    const newMessage: Message = {
      id: Date.now(),
      author: user?.name || "Current User",
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      content: noteContent,
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleDeleteClick = (messageId: number) => {
    setMessageToDelete(messageId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      setMessages(prev => prev.filter(msg => msg.id !== messageToDelete));
      setMessageToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || 'U';
  };

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        <h2 className="font-medium text-base text-gray-900">
          Communications & Notes
        </h2>

        <Card className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <CardContent className="p-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3 w-full group">
                  <div className="pt-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={message.avatar}
                        alt={`${message.author}'s avatar`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {getUserInitials(message.author)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-gray-700">
                        {message.author}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {message.content}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(message.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </Card>

        <Button
          variant="outline"
          className="w-full py-3 border-violet-600 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
          onClick={() => setAddNotesOpen(true)}
        >
          Add Notes
        </Button>
      </div>

      <AddNotesDialog
        isOpen={addNotesOpen}
        onClose={() => setAddNotesOpen(false)}
        onSave={handleAddNote}
      />

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};
