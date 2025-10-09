import React, { useState } from 'react';
import { X, Edit, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditLiveSessionModal from './EditLiveSessionModal';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  date: string;
  timeRange: string;
  provider: {
    name: string;
    icon: string;
  };
  host: string;
  capacity: number;
}

interface LiveSessionDetailsModalProps {
  session: LiveSession | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (session: LiveSession) => void;
  onSessionUpdate?: (updatedSession: LiveSession) => void;
}

const LiveSessionDetailsModal: React.FC<LiveSessionDetailsModalProps> = ({
  session,
  isOpen,
  onClose,
  onEdit,
  onSessionUpdate
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  if (!isOpen || !session) return null;

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'zoom':
        return <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">Z</div>;
      case 'google-meet':
        return <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">G</div>;
      case 'teams':
        return <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">T</div>;
      default:
        return <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center text-white text-xs font-bold">?</div>;
    }
  };

  const generateSessionLink = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'zoom':
        return 'https://zoom.us/j/1234567890';
      case 'google-meet':
        return 'https://meet.google.com/abc-defg-hij';
      case 'microsoft teams':
        return 'https://teams.microsoft.com/l/meetup-join/...';
      default:
        return 'https://example.com/session-link';
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleSessionUpdate = (updatedSession: LiveSession) => {
    if (onSessionUpdate) {
      onSessionUpdate(updatedSession);
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Live session details</h2>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-sm text-gray-900">{session.title}</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-sm text-gray-900">{session.description}</p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <p className="text-sm text-gray-900">{session.date}</p>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <p className="text-sm text-gray-900">{session.timeRange}</p>
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <div className="flex items-center space-x-2">
                  {getProviderIcon(session.provider.icon)}
                  <span className="text-sm text-gray-900">{session.provider.name}</span>
                </div>
              </div>

              {/* Live session link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Live session link</label>
                <a
                  href={generateSessionLink(session.provider.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
                >
                  <span>{generateSessionLink(session.provider.name)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Host */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                <p className="text-sm text-gray-900">{session.host}</p>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <p className="text-sm text-gray-900">{session.capacity}</p>
              </div>

              {/* Allow joining 15 mins early */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allow joining 15 mins early</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-900">Enabled</span>
                </div>
              </div>

              {/* Recording enabled */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recording enabled</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-900">Enabled</span>
                </div>
              </div>

              {/* Link to course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link to course</label>
                <div className="space-y-1">
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 underline block"
                  >
                    Introduction to Digital Marketing Strategies
                  </a>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 underline block"
                  >
                    Module 1 : Introduction to digital tools
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-center p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Edit Live Session Modal */}
      <EditLiveSessionModal
        session={session}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSave={handleSessionUpdate}
      />
    </div>
  );
};

export default LiveSessionDetailsModal;
