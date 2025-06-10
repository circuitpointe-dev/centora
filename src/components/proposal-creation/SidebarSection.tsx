
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Clock, MessageCircle, RefreshCw } from "lucide-react";

const SidebarSection: React.FC = () => {
  const comments = [
    {
      id: 1,
      author: "Jane Doe",
      avatar: "",
      time: "2 hours ago",
      content: "Lorem ipsum dolor sit amet consetur. Blan dit in placerat morbi venenatis.",
    },
    {
      id: 2,
      author: "Jane Doe",
      avatar: "",
      time: "2 hours ago",
      content: "Lorem ipsum dolor sit amet consetur. Blan dit in placerat morbi venenatis.",
    },
  ];

  const versions = [
    {
      id: 1,
      version: "V1.3",
      author: "Jane Doe",
      time: "2 hours ago",
    },
    {
      id: 2,
      version: "V1.2",
      author: "Jane Doe",
      time: "2 hours ago",
    },
    {
      id: 3,
      version: "V1.1",
      author: "Jane Doe",
      time: "2 hours ago",
    },
  ];

  return (
    <aside className="w-[370px] h-[728px] p-6">
      <div className="flex flex-col w-full items-start gap-4">
        {/* Comments Section Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-medium text-[#383839] text-sm">Comments</h3>
          </div>
          <a href="#" className="text-violet-600 text-xs underline">
            View All
          </a>
        </div>

        {/* Comments List */}
        <div className="flex flex-col items-start gap-4 w-full">
          {comments.map((comment) => (
            <Card key={comment.id} className="w-full shadow-[0px_4px_16px_#eae2fd]">
              <CardContent className="p-0">
                <div className="flex flex-col items-start gap-1 p-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.avatar} alt={comment.author} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-[#383839] text-sm">
                        {comment.author}
                      </span>
                    </div>
                    <span className="text-[#383839a8] text-xs">{comment.time}</span>
                  </div>
                  <p className="text-[#383839a8] text-sm">{comment.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Comment Input */}
          <Card className="w-full border">
            <CardContent className="p-4">
              <Textarea
                placeholder="Add a comment..."
                className="border-0 p-0 focus-visible:ring-0 resize-none h-[72px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Divider */}
      <Separator className="my-6" />

      {/* Version History Section */}
      <div className="flex flex-col w-full items-start gap-4">
        <div className="flex items-center gap-1">
          <Clock className="w-5 h-5" />
          <h3 className="font-medium text-[#383839] text-sm">Version History</h3>
        </div>

        <div className="flex flex-col items-start gap-4 w-full">
          {versions.map((version) => (
            <Card key={version.id} className="w-full border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-medium text-[#383839] text-sm">{version.version}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{version.author}</span>
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-[3px]" />
                      <span className="text-gray-400 text-sm">{version.time}</span>
                    </div>
                  </div>
                  <RefreshCw className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarSection;
