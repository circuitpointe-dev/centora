
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MessageSquare, History } from "lucide-react";

type Props = {
  comment: string;
  onCommentChange: (value: string) => void;
};

const comments = [
  {
    id: 1,
    author: "Jane Doe",
    time: "2 hours ago",
    text: "Lorem ipsum dolor sit amet consectetur. Blandit dui in placerat morbi venenatis."
  },
  {
    id: 2,
    author: "Jane Doe", 
    time: "2 hours ago",
    text: "Lorem ipsum dolor sit amet consectetur. Blandit dui in placerat morbi venenatis."
  }
];

const versionHistory = [
  { version: "V1.3", author: "Jane Doe", time: "2 hours ago" },
  { version: "V1.2", author: "Jane Doe", time: "2 hours ago" },
  { version: "V1.1", author: "Jane Doe", time: "2 hours ago" },
];

const ProposalDialogSidebar: React.FC<Props> = ({ comment, onCommentChange }) => {
  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Comments Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments
              </CardTitle>
              <Button variant="link" size="sm" className="text-violet-600 p-0 h-auto">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{comment.text}</p>
              </div>
            ))}
            <Separator />
            <div>
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => onCommentChange(e.target.value)}
                className="min-h-[60px] text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Version History Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <History className="w-4 h-4" />
              Version History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {versionHistory.map((version, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{version.version}</div>
                  <div className="text-xs text-gray-500">
                    {version.author} • {version.time}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <History className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProposalDialogSidebar;
