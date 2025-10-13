import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import CreateTicketModal from './CreateTicketModal';
import TicketViewModal from './TicketViewModal';

interface Ticket {
  id: string;
  title: string;
  description: string;
  ticketId: string;
  contact: string;
  role: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Suspended' | 'In progress' | 'Resolved';
  submitted: string;
}

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState<'help' | 'tickets'>('help');
  const [activeCategory, setActiveCategory] = useState('Courses & publishing');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isViewTicketModalOpen, setIsViewTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Mock ticket data
  const tickets: Ticket[] = [
    {
      id: '1',
      title: 'Course access issue',
      description: 'Unable to resolve the issue with the current settings. Please check your configurations or contact support for further assistance.',
      ticketId: 'TCK1020',
      contact: 'Han Romeo',
      role: 'Learner',
      priority: 'High',
      status: 'Suspended',
      submitted: 'Jul 5, 2025 09:00 pm'
    },
    {
      id: '2',
      title: 'Access Denied to Course',
      description: 'Unable to resolve the issue with the current settings. Please check your configurations or contact support for further assistance.',
      ticketId: 'TCK2025',
      contact: 'Alex Johnson',
      role: 'Instructor',
      priority: 'Medium',
      status: 'In progress',
      submitted: 'Jul 5, 2025 09:00 pm'
    },
    {
      id: '3',
      title: 'Access Denied to Course',
      description: 'Unable to resolve the issue with the current settings. Please check your configurations or contact support for further assistance.',
      ticketId: 'TCK2025',
      contact: 'Jordan Smith',
      role: 'Learner',
      priority: 'Low',
      status: 'Resolved',
      submitted: 'Jul 5, 2025 09:00 pm'
    },
    {
      id: '4',
      title: 'Access Denied to Course',
      description: 'Unable to resolve the issue with the current settings. Please check your configurations or contact support for further assistance.',
      ticketId: 'TCK2025',
      contact: 'Jordan Smith',
      role: 'Learner',
      priority: 'Low',
      status: 'Resolved',
      submitted: 'Jul 5, 2025 09:00 pm'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-600 text-white';
      case 'Medium':
        return 'bg-gray-600 text-white';
      case 'Low':
        return 'bg-gray-100 text-gray-700 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Suspended':
        return 'bg-pink-100 text-red-600';
      case 'In progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Resolved':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreateTicket = () => {
    setIsCreateTicketModalOpen(true);
  };

  const handleCloseCreateTicketModal = () => {
    setIsCreateTicketModalOpen(false);
  };

  const handleSubmitTicket = (ticketData: any) => {
    // Handle ticket submission logic here
    console.log('New ticket submitted:', ticketData);
    // You can add the new ticket to the tickets array or send to API
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewTicketModalOpen(true);
  };

  const handleCloseViewTicketModal = () => {
    setIsViewTicketModalOpen(false);
    setSelectedTicket(null);
  };

  const categories = [
    'Courses & publishing',
    'Web Development',
    'Graphic Design',
    'Data Science',
    'Roles & permission',
    'Report & analytics',
    'Data'
  ];

  const helpContent = {
    'Courses & publishing': {
      title: 'Courses & publishing',
      content: [
        'Welcome to the Courses & Publishing section of our help center! Here, you\'ll find comprehensive guidance on creating, managing, and publishing courses within our LMS platform. Our extensive library of resources covers everything from course creation basics to advanced publishing workflows.',
        'Whether you\'re looking for answers to frequently asked questions, troubleshooting tips, or step-by-step tutorials, we\'ve got you covered. If you can\'t find what you\'re looking for, don\'t hesitate to submit a support ticket, and our team will be happy to assist you.',
        'Our dedicated support team is committed to helping you succeed with your course creation and publishing needs. We regularly update our knowledge base with new articles, tutorials, and best practices to ensure you have access to the most current information.',
        'Thank you for choosing our platform. We\'re here to support you every step of the way and ensure your success with course creation and publishing.'
      ]
    },
    'Web Development': {
      title: 'Web Development',
      content: [
        'Welcome to the Web Development section! Here you\'ll find resources for integrating web development tools and frameworks with our LMS platform.',
        'From API documentation to custom integrations, we provide comprehensive guides to help you build powerful web applications.',
        'Our support team specializes in web development and can help you with technical implementation and troubleshooting.',
        'Explore our resources and don\'t hesitate to reach out if you need assistance with your web development projects.'
      ]
    },
    'Graphic Design': {
      title: 'Graphic Design',
      content: [
        'Welcome to the Graphic Design section! Discover tools and resources for creating engaging visual content for your courses.',
        'Learn about design best practices, template customization, and creating compelling course materials.',
        'Our design experts are available to help you create professional-looking course content.',
        'Access our design library and get inspired to create amazing visual learning experiences.'
      ]
    },
    'Data Science': {
      title: 'Data Science',
      content: [
        'Welcome to the Data Science section! Explore analytics tools and data visualization features for your courses.',
        'Learn how to track learner progress, analyze course performance, and make data-driven decisions.',
        'Our analytics experts can help you understand your course data and optimize learning outcomes.',
        'Discover powerful insights about your learners and course effectiveness.'
      ]
    },
    'Roles & permission': {
      title: 'Roles & Permission',
      content: [
        'Welcome to the Roles & Permission section! Learn how to manage user roles and permissions in your LMS.',
        'Understand different permission levels, role assignments, and access control features.',
        'Our security experts can help you set up proper access controls for your organization.',
        'Ensure your platform security with proper role and permission management.'
      ]
    },
    'Report & analytics': {
      title: 'Report & Analytics',
      content: [
        'Welcome to the Report & Analytics section! Access comprehensive reporting tools and analytics dashboards.',
        'Generate detailed reports on course performance, learner engagement, and system usage.',
        'Our analytics team can help you interpret data and create custom reports.',
        'Make informed decisions with powerful reporting and analytics capabilities.'
      ]
    },
    'Data': {
      title: 'Data',
      content: [
        'Welcome to the Data section! Learn about data management, export, and backup features.',
        'Understand data privacy, security, and compliance requirements for your LMS.',
        'Our data experts can help you with data migration, backup, and recovery procedures.',
        'Keep your data safe and accessible with our comprehensive data management tools.'
      ]
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Help center</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('help')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'help'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Help center
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tickets'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tickets
          </button>
        </nav>
      </div>

      {/* Help Center Tab */}
      {activeTab === 'help' && (
        <div className="space-y-6">
          {/* Search and Action Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4" />
              <span>Submit ticket</span>
            </Button>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {helpContent[activeCategory as keyof typeof helpContent]?.title}
                </h2>
                <div className="space-y-3 text-gray-700">
                  {helpContent[activeCategory as keyof typeof helpContent]?.content.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Search and Action Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search NGO by name..."
                value={ticketSearchQuery}
                onChange={(e) => setTicketSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button 
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
              onClick={handleCreateTicket}
            >
              <Plus className="h-4 w-4" />
              <span>Create new ticket</span>
            </Button>
          </div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title and Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {ticket.description}
                      </p>
                    </div>

                    {/* Ticket Details */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ticket ID:</span>
                        <span className="font-medium text-gray-900">{ticket.ticketId}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Contact:</span>
                        <span className="font-medium text-gray-900">{ticket.contact}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Role:</span>
                        <span className="font-medium text-gray-900">{ticket.role}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Submitted:</span>
                        <span className="font-medium text-gray-900">{ticket.submitted}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-1"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <X className="h-4 w-4" />
                        <span>Close ticket</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:border-red-300">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing 1 to 4 of 32 support ticket list
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateTicketModalOpen}
        onClose={handleCloseCreateTicketModal}
        onSubmit={handleSubmitTicket}
      />

      {/* View Ticket Modal */}
      <TicketViewModal
        isOpen={isViewTicketModalOpen}
        onClose={handleCloseViewTicketModal}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default HelpCenter;
