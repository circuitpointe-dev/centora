import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  author: string;
  timestamp: string;
  content: string;
  avatar: string;
}

export const CommunicationsSection: React.FC = () => {
  const messages: Message[] = [
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
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="font-medium text-base text-gray-900">
        Communications & Notes
      </h2>

      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <CardContent className="p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 w-full">
                <div className="pt-1">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={message.avatar}
                      alt={`${message.author}'s avatar`}
                      className="object-cover"
                    />
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
              </div>
            ))}
          </CardContent>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </Card>

      <Button
        variant="outline"
        className="w-full py-3 border-violet-600 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
      >
        Add Notes
      </Button>
    </div>
  );
};
