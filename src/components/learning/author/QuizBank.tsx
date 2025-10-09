import React, { useState } from 'react';
import { Search, Filter, Plus, Grid3X3, List, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: number;
  tags: string[];
}

const QuizBank: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view as per design
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 8;

  // Mock data for quizzes
  const quizzes: Quiz[] = [
    {
      id: '1',
      title: 'Collaboration basics',
      description: 'Intro and summary of collaboration',
      questions: 8,
      tags: ['Safety'],
    },
    {
      id: '2',
      title: 'Effective Communication',
      description: 'Key principles for clear communication',
      questions: 150,
      tags: ['Quality'],
    },
    {
      id: '3',
      title: 'Conflict Resolution',
      description: 'Strategies for resolving disputes',
      questions: 250,
      tags: ['Efficiency'],
    },
    {
      id: '4',
      title: 'Team Dynamics',
      description: 'Understanding team roles and interactions',
      questions: 300,
      tags: ['Sustainability'],
    },
    {
      id: '5',
      title: 'Building Trust',
      description: 'Ways to foster trust within teams',
      questions: 180,
      tags: ['Innovation'],
    },
    {
      id: '6',
      title: 'Feedback Mechanisms',
      description: 'Importance of providing constructive feedback',
      questions: 220,
      tags: ['Customer Satisfaction'],
    },
    {
      id: '7',
      title: 'Cultural Awareness',
      description: 'Navigating cultural differences in teams',
      questions: 240,
      tags: ['Accessibility'],
    },
    {
      id: '8',
      title: 'Goal Setting',
      description: 'Establishing and aligning team goals',
      questions: 170,
      tags: ['Scalability'],
    },
    {
      id: '9',
      title: 'Time Management',
      description: 'Techniques for effective time utilization',
      questions: 120,
      tags: ['Productivity'],
    },
    {
      id: '10',
      title: 'Decision Making',
      description: 'Frameworks for sound decision processes',
      questions: 190,
      tags: ['Strategy'],
    },
    {
      id: '11',
      title: 'Problem Solving',
      description: 'Systematic approaches to complex issues',
      questions: 210,
      tags: ['Critical Thinking'],
    },
    {
      id: '12',
      title: 'Leadership Skills',
      description: 'Developing effective leadership qualities',
      questions: 280,
      tags: ['Development'],
    },
  ];

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
  const startIndex = (currentPage - 1) * quizzesPerPage;
  const endIndex = startIndex + quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(startIndex, endIndex);

  const handleViewQuiz = (quizId: string) => {
    navigate(`/dashboard/lmsAuthor/quiz-bank-view?id=${quizId}`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    console.log('Deleting quiz:', quizId);
    // Add delete quiz logic here
  };

  const handleNewBank = () => {
    console.log('Creating new quiz bank');
    // Add new bank logic here
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quiz bank</h1>
      </div>

      {/* Quiz Bank List Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-gray-900">Quiz bank list</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
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
          
          {/* New Bank Button */}
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleNewBank}
          >
            <Plus className="w-4 h-4 mr-2" />
            New bank
          </Button>
        </div>
      </div>

      {/* Quiz List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Quiz</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Questions</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Tags</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentQuizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                  {/* Quiz Column */}
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{quiz.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{quiz.description}</div>
                    </div>
                  </td>
                  
                  {/* Questions Column */}
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{quiz.questions}</span>
                  </td>
                  
                  {/* Tags Column */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {quiz.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewQuiz(quiz.id)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuiz(quiz.id)}
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
          Showing {startIndex + 1} to {Math.min(endIndex, filteredQuizzes.length)} of {filteredQuizzes.length} quiz bank list
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
    </div>
  );
};

export default QuizBank;
