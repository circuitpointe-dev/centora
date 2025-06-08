
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

const initialComments: Comment[] = [
  {
    id: "1",
    author: "Jane Doe",
    content: "Lorem ipsum dolor sit amet consectetur. Blan dit in placerat morbi venenatis.",
    timestamp: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face"
  },
  {
    id: "2", 
    author: "Jane Doe",
    content: "Lorem ipsum dolor sit amet consectetur. Blan dit in placerat morbi venenatis.",
    timestamp: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face"
  }
];

const ProposalCommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        content: newComment,
        timestamp: "Just now",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Comments</h3>
        <span className="text-sm text-gray-500">View All</span>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.timestamp}</span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[60px] resize-none"
        />
        <Button
          onClick={addComment}
          disabled={!newComment.trim()}
          size="sm"
          className="w-full"
        >
          Add Comment
        </Button>
      </div>
    </div>
  );
};

export default ProposalCommentsSection;
