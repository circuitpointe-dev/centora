import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Link, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface EditLiveSessionModalProps {
  session: LiveSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSession: LiveSession) => void;
}

const EditLiveSessionModal: React.FC<EditLiveSessionModalProps> = ({
  session,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    provider: 'zoom',
    zoomLink: '',
    capacity: '',
    host: '',
    allowEarlyJoin: true,
    recordingEnabled: true,
    course: '',
    module: ''
  });

  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);

  const providers = [
    { value: 'zoom', label: 'Zoom', icon: 'Z' },
    { value: 'google-meet', label: 'Google Meet', icon: 'G' },
    { value: 'teams', label: 'Microsoft Teams', icon: 'T' }
  ];

  const courses = [
    'Introduction to Digital Marketing Strategies',
    'Advanced React Patterns',
    'UI/UX Design Workshop',
    'Database Optimization',
    'DevOps Best Practices'
  ];

  const modules = [
    'Module 1: Introduction to digital tools',
    'Module 2: Advanced concepts',
    'Module 3: Practical applications',
    'Module 4: Final project'
  ];

  useEffect(() => {
    if (session && isOpen) {
      // Parse time range (e.g., "10:00 AM - 11:00 AM")
      const timeParts = session.timeRange.split(' - ');
      setFormData({
        title: session.title,
        description: session.description,
        date: session.date,
        timeFrom: timeParts[0] || '',
        timeTo: timeParts[1] || '',
        provider: session.provider.icon,
        zoomLink: generateSessionLink(session.provider.name),
        capacity: session.capacity.toString(),
        host: session.host,
        allowEarlyJoin: true,
        recordingEnabled: true,
        course: 'Introduction to Digital Marketing Strategies',
        module: 'Module 1: Introduction to digital tools'
      });
    }
  }, [session, isOpen]);

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

  const getProviderIcon = (provider: string) => {
    const providerData = providers.find(p => p.value === provider);
    if (providerData) {
      return (
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
          {providerData.icon}
        </div>
      );
    }
    return null;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const updatedSession: LiveSession = {
      ...session!,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      timeRange: `${formData.timeFrom} - ${formData.timeTo}`,
      provider: {
        name: providers.find(p => p.value === formData.provider)?.label || 'Zoom',
        icon: formData.provider
      },
      host: formData.host,
      capacity: parseInt(formData.capacity) || 0
    };

    onSave(updatedSession);
    onClose();
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Edit live session</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter session title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter session description"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <div className="relative">
                  <Input
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    placeholder="Select date"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                </div>
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Provider</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProviderDropdown(!showProviderDropdown)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-left flex items-center justify-between hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <div className="flex items-center space-x-2">
                      {getProviderIcon(formData.provider)}
                      <span>{providers.find(p => p.value === formData.provider)?.label}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  {showProviderDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                      {providers.map((provider) => (
                        <button
                          key={provider.value}
                          type="button"
                          onClick={() => {
                            handleInputChange('provider', provider.value);
                            setShowProviderDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-accent flex items-center space-x-2"
                        >
                          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                            {provider.icon}
                          </div>
                          <span>{provider.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Zoom link */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Zoom link</label>
                <div className="relative">
                  <Input
                    value={formData.zoomLink}
                    onChange={(e) => handleInputChange('zoomLink', e.target.value)}
                    placeholder="Paste link here"
                  />
                  <Link className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Capacity</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="Enter capacity"
                />
              </div>

              {/* Link to course */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Link to course</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-left flex items-center justify-between hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <span>{formData.course || 'Course'}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  {showCourseDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                      {courses.map((course) => (
                        <button
                          key={course}
                          type="button"
                          onClick={() => {
                            handleInputChange('course', course);
                            setShowCourseDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-accent"
                        >
                          {course}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Time (from) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Time (from)</label>
                <div className="relative">
                  <Input
                    value={formData.timeFrom}
                    onChange={(e) => handleInputChange('timeFrom', e.target.value)}
                    placeholder="Select start time"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                </div>
              </div>

              {/* Time (to) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Time (to)</label>
                <div className="relative">
                  <Input
                    value={formData.timeTo}
                    onChange={(e) => handleInputChange('timeTo', e.target.value)}
                    placeholder="Select end time"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                </div>
              </div>

              {/* Host */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Host</label>
                <Input
                  value={formData.host}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                  placeholder="Enter host name"
                />
              </div>

              {/* Allow joining 15 mins early */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.allowEarlyJoin}
                  onChange={(e) => handleInputChange('allowEarlyJoin', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-background border-border rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="text-sm font-medium text-foreground">Allow joining 15 mins early</label>
              </div>

              {/* Recording enabled */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.recordingEnabled}
                  onChange={(e) => handleInputChange('recordingEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-background border-border rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="text-sm font-medium text-gray-700">Recording enabled</label>
              </div>

              {/* Module */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowModuleDropdown(!showModuleDropdown)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-left flex items-center justify-between hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <span>{formData.module || 'Module'}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  
                  {showModuleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                      {modules.map((module) => (
                        <button
                          key={module}
                          type="button"
                          onClick={() => {
                            handleInputChange('module', module);
                            setShowModuleDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-accent"
                        >
                          {module}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 bg-gray-900 hover:bg-gray-800 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditLiveSessionModal;
