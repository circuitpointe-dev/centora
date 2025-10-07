import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: { topic: string; content: string }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && content.trim()) {
      onSubmit({ topic: topic.trim(), content: content.trim() });
      setTopic('');
      setContent('');
      onClose();
    }
  };

  const handleClose = () => {
    setTopic('');
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Create New Post</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your post title..."
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, questions, or insights..."
                rows={6}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                required
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-border bg-background text-foreground rounded-md text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!topic.trim() || !content.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-md text-sm font-medium transition-colors"
            >
              <Send size={16} />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
