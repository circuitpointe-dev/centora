import React, { useState } from 'react';
import { Search, Filter, Plus, Grid3X3, List, Eye, Trash2, Calendar, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import LiveSessionDetailsModal from './LiveSessionDetailsModal';

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

const LiveSessions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sessionsPerPage = 8;

  // Mock data for live sessions
  const liveSessions: LiveSession[] = [
    {
      id: '1',
      title: 'Accessibility 101- Live Q&A',
      description: 'Open Q&A with instructor',
      date: 'Aug 2, 2025',
      timeRange: '10:00 AM - 11:00 AM',
      provider: { name: 'Zoom', icon: 'zoom' },
      host: 'Jane doe',
      capacity: 200
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      description: 'Deep dive into React best practices',
      date: 'Aug 3, 2025',
      timeRange: '2:00 PM - 3:30 PM',
      provider: { name: 'Google Meet', icon: 'google-meet' },
      host: 'John Smith',
      capacity: 150
    },
    {
      id: '3',
      title: 'UI/UX Design Workshop',
      description: 'Interactive design session',
      date: 'Aug 4, 2025',
      timeRange: '9:00 AM - 12:00 PM',
      provider: { name: 'Microsoft Teams', icon: 'teams' },
      host: 'Sarah Johnson',
      capacity: 100
    },
    {
      id: '4',
      title: 'Database Optimization',
      description: 'Performance tuning techniques',
      date: 'Aug 5, 2025',
      timeRange: '1:00 PM - 2:30 PM',
      provider: { name: 'Zoom', icon: 'zoom' },
      host: 'Mike Chen',
      capacity: 180
    },
    {
      id: '5',
      title: 'DevOps Best Practices',
      description: 'CI/CD pipeline optimization',
      date: 'Aug 6, 2025',
      timeRange: '3:00 PM - 4:30 PM',
      provider: { name: 'Google Meet', icon: 'google-meet' },
      host: 'Alex Rodriguez',
      capacity: 120
    },
    {
      id: '6',
      title: 'Mobile App Development',
      description: 'Cross-platform development',
      date: 'Aug 7, 2025',
      timeRange: '10:30 AM - 12:00 PM',
      provider: { name: 'Microsoft Teams', icon: 'teams' },
      host: 'Emily Davis',
      capacity: 90
    },
    {
      id: '7',
      title: 'Cloud Architecture',
      description: 'AWS and Azure comparison',
      date: 'Aug 8, 2025',
      timeRange: '2:00 PM - 3:30 PM',
      provider: { name: 'Zoom', icon: 'zoom' },
      host: 'David Wilson',
      capacity: 160
    },
    {
      id: '8',
      title: 'Security Fundamentals',
      description: 'Web application security',
      date: 'Aug 9, 2025',
      timeRange: '11:00 AM - 12:30 PM',
      provider: { name: 'Google Meet', icon: 'google-meet' },
      host: 'Lisa Brown',
      capacity: 140
    },
    {
      id: '9',
      title: 'API Design Patterns',
      description: 'RESTful API best practices',
      date: 'Aug 10, 2025',
      timeRange: '1:30 PM - 3:00 PM',
      provider: { name: 'Microsoft Teams', icon: 'teams' },
      host: 'Tom Anderson',
      capacity: 110
    },
    {
      id: '10',
      title: 'Machine Learning Basics',
      description: 'Introduction to ML concepts',
      date: 'Aug 11, 2025',
      timeRange: '9:30 AM - 11:00 AM',
      provider: { name: 'Zoom', icon: 'zoom' },
      host: 'Rachel Green',
      capacity: 130
    },
    {
      id: '11',
      title: 'Frontend Performance',
      description: 'Optimizing web performance',
      date: 'Aug 12, 2025',
      timeRange: '2:30 PM - 4:00 PM',
      provider: { name: 'Google Meet', icon: 'google-meet' },
      host: 'Kevin Lee',
      capacity: 95
    },
    {
      id: '12',
      title: 'Backend Architecture',
      description: 'Scalable backend design',
      date: 'Aug 13, 2025',
      timeRange: '10:00 AM - 11:30 AM',
      provider: { name: 'Microsoft Teams', icon: 'teams' },
      host: 'Maria Garcia',
      capacity: 125
    }
  ];

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

  const filteredSessions = liveSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const endIndex = startIndex + sessionsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  const handleViewSession = (sessionId: string) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleEditSession = (session: LiveSession) => {
    console.log('Editing session:', session);
    // Add edit logic here
    handleCloseModal();
  };

  const handleSessionUpdate = (updatedSession: LiveSession) => {
    // Update the session in the list
    const updatedSessions = liveSessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    );
    // In a real app, you would update the state or make an API call
    console.log('Session updated:', updatedSession);
    handleCloseModal();
  };

  const handleDeleteSession = (sessionId: string) => {
    console.log('Deleting session:', sessionId);
    // Add delete logic here
  };

  const handleScheduleSession = () => {
    console.log('Opening schedule session modal');
    // Add schedule session logic here
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Live session</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-gray-900">Live session list</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search session..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pr-10"
            />
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Filter Button */}
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          
          {/* Schedule Sessions Button */}
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleScheduleSession}
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule sessions
          </Button>
        </div>
      </div>

      {/* Live Sessions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Title</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">When</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Provider</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Host</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Capacity</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  {/* Title Column */}
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{session.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{session.description}</div>
                    </div>
                  </td>
                  
                  {/* When Column */}
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{session.date}</div>
                      <div className="text-sm text-gray-500 mt-1">{session.timeRange}</div>
                    </div>
                  </td>
                  
                  {/* Provider Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getProviderIcon(session.provider.icon)}
                      <span className="text-sm text-gray-900">{session.provider.name}</span>
                    </div>
                  </td>
                  
                  {/* Host Column */}
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{session.host}</span>
                  </td>
                  
                  {/* Capacity Column */}
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{session.capacity}</span>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSession(session.id)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSession(session.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredSessions.length)} of {filteredSessions.length} live session list
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Live Session Details Modal */}
      <LiveSessionDetailsModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditSession}
        onSessionUpdate={handleSessionUpdate}
      />
    </div>
  );
};

export default LiveSessions;
