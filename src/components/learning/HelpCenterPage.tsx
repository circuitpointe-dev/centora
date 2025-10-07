import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import SubmitTicketModal from './SubmitTicketModal';

type FilterCategory = 'all' | 'account' | 'courses' | 'technical';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FilterCategory;
}

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample FAQ data
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to Settings > Security',
      category: 'account'
    },
    {
      id: '2',
      question: 'Where can I see my certificates?',
      answer: 'You can view your certificates in the Course Workspace under the "Certificates" tab. Navigate to any completed course to download your certificate.',
      category: 'courses'
    },
    {
      id: '3',
      question: 'How do I download my certificates?',
      answer: 'Once you complete a course, go to Course Workspace, select the completed course, and click the "Download Certificate" button in the Certificates section.',
      category: 'courses'
    },
    {
      id: '4',
      question: "What should I do if I can't access my course materials?",
      answer: 'If you\'re unable to access course materials, try the following: 1) Clear your browser cache, 2) Check your internet connection, 3) Ensure you\'re enrolled in the course, 4) Contact support if the issue persists.',
      category: 'technical'
    },
    {
      id: '5',
      question: 'How can I reset my password for the LMS?',
      answer: 'Click on your profile icon, go to Settings > Security, and select "Change Password". You\'ll need to enter your current password and then create a new one.',
      category: 'account'
    },
    {
      id: '6',
      question: 'How do I enroll in a course?',
      answer: 'Go to the Catalogue, browse available courses, and click "Enroll Now" on any course you wish to take. Once enrolled, it will appear in your Course Workspace.',
      category: 'courses'
    },
    {
      id: '7',
      question: 'Can I access courses offline?',
      answer: 'Currently, courses require an internet connection to access. We recommend ensuring a stable connection when participating in live sessions or watching course videos.',
      category: 'technical'
    },
    {
      id: '8',
      question: 'How do I update my profile information?',
      answer: 'Click on your profile picture in the top right corner, select "Profile Settings", and update your information. Don\'t forget to save your changes.',
      category: 'account'
    }
  ];

  // Filter FAQs based on search query and selected category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || faq.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSubmitTicket = () => {
    setIsModalOpen(true);
  };

  const handleContactSupport = () => {
    // TODO: Implement contact support action (email, chat, etc.)
    window.location.href = 'mailto:support@example.com';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Help center</h1>
          <Button 
            onClick={handleSubmitTicket}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit a ticket
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search....."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base bg-white border-gray-200"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 mb-3">Sort by</p>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="filter"
                    value="all"
                    checked={selectedFilter === 'all'}
                    onChange={() => setSelectedFilter('all')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className={`text-sm ${selectedFilter === 'all' ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                    All
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="filter"
                    value="account"
                    checked={selectedFilter === 'account'}
                    onChange={() => setSelectedFilter('account')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className={`text-sm ${selectedFilter === 'account' ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                    Account
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="filter"
                    value="courses"
                    checked={selectedFilter === 'courses'}
                    onChange={() => setSelectedFilter('courses')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className={`text-sm ${selectedFilter === 'courses' ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                    Courses
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="filter"
                    value="technical"
                    checked={selectedFilter === 'technical'}
                    onChange={() => setSelectedFilter('technical')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className={`text-sm ${selectedFilter === 'technical' ? 'text-purple-600 font-medium' : 'text-gray-700'}`}>
                    Technical
                  </span>
                </label>
              </div>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white p-6">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No results found. Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div 
                      key={faq.id} 
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors rounded px-2"
                      >
                        <span className="font-medium text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        {expandedFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="pb-4 px-2 text-sm text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Support Button */}
              <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  className="bg-black hover:bg-gray-800 text-white border-black"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Ticket Modal */}
      <SubmitTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default HelpCenterPage;

