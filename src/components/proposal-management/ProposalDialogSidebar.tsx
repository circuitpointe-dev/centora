
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MessageSquare, History } from "lucide-react";
import { useProposalComments, useAddProposalComment } from "@/hooks/useProposalComments";

type Props = {
  proposalId: string | null;
};

const versionHistory = [
  { version: "V1.3", author: "Jane Doe", time: "2 hours ago" },
  { version: "V1.2", author: "Jane Doe", time: "2 hours ago" },
  { version: "V1.1", author: "Jane Doe", time: "2 hours ago" },
];

const ProposalDialogSidebar: React.FC<Props> = ({ proposalId }) => {
  const [newComment, setNewComment] = useState("");
  const { data: comments = [], isLoading } = useProposalComments(proposalId || "");
  const addComment = useAddProposalComment();

  const handleAddComment = () => {
    if (newComment.trim() && proposalId) {
      addComment.mutate({
        proposal_id: proposalId,
        content: newComment.trim(),
      }, {
        onSuccess: () => {
          setNewComment("");
        }
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddComment();
    }
  };
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
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-sm text-gray-500">No comments yet.</div>
            ) : (
              comments.slice(0, 3).map((comment) => {
                const timeAgo = new Date(comment.created_at).toLocaleString();
                const userInitials = comment.user?.full_name 
                  ? comment.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                  : 'U';
                
                return (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {comment.user?.full_name || 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500">{timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                  </div>
                );
              })
            )}
            <Separator />
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[60px] text-sm"
              />
              <Button 
                onClick={handleAddComment}
                size="sm"
                disabled={!newComment.trim() || addComment.isPending}
                className="w-full"
              >
                {addComment.isPending ? "Adding..." : "Add Comment"}
              </Button>
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
