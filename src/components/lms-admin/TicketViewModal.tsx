import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  X,
  ChevronDown,
  Paperclip
} from 'lucide-react';

interface TicketViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    id: string;
    title: string;
    description: string;
    ticketId: string;
    contact: string;
    role: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Suspended' | 'In progress' | 'Resolved';
    submitted: string;
  } | null;
}

interface Comment {
  id: string;
  user: string;
  role: string;
  avatar?: string;
  initials?: string;
  text: string;
  timestamp: string;
}

const TicketViewModal: React.FC<TicketViewModalProps> = ({
  isOpen,
  onClose,
  ticket
}) => {
  const [status, setStatus] = useState(ticket?.status || 'In progress');
  const [priority, setPriority] = useState(ticket?.priority || 'High');
  const [replyText, setReplyText] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const statusOptions = ['In progress', 'Suspended', 'Resolved', 'Closed'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  // Mock comments data
  const comments: Comment[] = [
    {
      id: '1',
      user: 'Somachi ogbuh',
      role: 'Student',
      initials: 'SO',
      text: 'Investigating the module access issue now',
      timestamp: 'Jul 5, 2025 09:00 pm'
    },
    {
      id: '2',
      user: 'Mark doe',
      role: 'Admin',
      avatar: '/placeholder.svg',
      text: 'We can\'t see any grant templates after login',
      timestamp: 'Jul 5, 2025 09:30 pm'
    }
  ];

  const handleStatusSelect = (newStatus: string) => {
    setStatus(newStatus as any);
    setShowStatusDropdown(false);
  };

  const handlePrioritySelect = (newPriority: string) => {
    setPriority(newPriority as any);
    setShowPriorityDropdown(false);
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Handle sending reply logic here
      console.log('Reply sent:', replyText);
      setReplyText('');
    }
  };

  const handleCancel = () => {
    setReplyText('');
    onClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Student':
        return 'bg-blue-100 text-blue-700';
      case 'Admin':
        return 'bg-purple-100 text-purple-700';
      case 'Instructor':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Ticket #{ticket.ticketId} - {ticket.title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Ticket Description */}
          <div>
            <p className="text-gray-700 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Status and Priority Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <div className="relative">
                <Input
                  value={status}
                  readOnly
                  className="w-full pr-10 cursor-pointer"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                />
                <ChevronDown 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                />
                
                {/* Status Dropdown */}
                {showStatusDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {statusOptions.map((option) => (
                      <div
                        key={option}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleStatusSelect(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Priority</Label>
              <div className="relative">
                <Input
                  value={priority}
                  readOnly
                  className="w-full pr-10 cursor-pointer"
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                />
                <ChevronDown 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                />
                
                {/* Priority Dropdown */}
                {showPriorityDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {priorityOptions.map((option) => (
                      <div
                        key={option}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handlePrioritySelect(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Comments ({comments.length})
            </h3>
            
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {comment.avatar ? (
                      <img
                        src={comment.avatar}
                        alt={comment.user}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {comment.initials}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.user}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(comment.role)}`}>
                        {comment.role}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Reply Section */}
          <div className="space-y-4">
            <Label htmlFor="reply" className="text-sm font-medium text-gray-700">
              Add reply
            </Label>
            <textarea
              id="reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Paperclip className="h-4 w-4" />
                <span>Attach file</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendReply}
            className="px-6 bg-gray-900 hover:bg-gray-800"
            disabled={!replyText.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketViewModal;
