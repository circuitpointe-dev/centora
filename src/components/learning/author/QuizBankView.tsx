import React, { useState } from 'react';
import { ArrowLeft, Edit, Link, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import LinkToCourseModal from './LinkToCourseModal';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface QuizBankViewProps {
  quizId?: string;
}

const QuizBankView: React.FC<QuizBankViewProps> = ({ quizId }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const questionsPerPage = 8;

  // Mock quiz data
  const quiz = {
    id: '1',
    title: 'Collaboration basics',
    description: 'Intro and summary of collaboration',
    questions: [
      {
        id: '1',
        question: 'What are common benefits of using cloud storage?',
        options: [
          'Accessibility from anywhere',
          'Enhanced security features',
          'Automatic backups',
          'All of the above'
        ],
        correctAnswer: 3
      },
      {
        id: '2',
        question: 'Which of the following is a popular video conferencing tool?',
        options: [
          'Zoom',
          'Photoshop',
          'Trello',
          'Slack'
        ],
        correctAnswer: 0
      },
      {
        id: '3',
        question: 'What is a key feature of project management software?',
        options: [
          'Website hosting',
          'Graphic design',
          'Time tracking',
          'Social media management'
        ],
        correctAnswer: 2
      },
      {
        id: '4',
        question: 'Which of these is a well-known cloud storage provider?',
        options: [
          'Dropbox',
          'Microsoft Excel',
          'Adobe Illustrator',
          'Notepad'
        ],
        correctAnswer: 0
      },
      {
        id: '5',
        question: 'Which tool is best for collaborative design?',
        options: [
          'Figma',
          'Word',
          'Excel',
          'PowerPoint'
        ],
        correctAnswer: 0
      },
      {
        id: '6',
        question: 'What is an advantage of using online surveys?',
        options: [
          'Quick data collection',
          'Limited responses',
          'No analysis needed',
          'High cost'
        ],
        correctAnswer: 0
      },
      {
        id: '7',
        question: 'Which of these tools supports remote work?',
        options: [
          'Slack',
          'MS Paint',
          'Adobe Premiere',
          'Notepad++'
        ],
        correctAnswer: 0
      },
      {
        id: '8',
        question: 'What is a common use of cloud applications?',
        options: [
          'Local file storage',
          'Email management',
          'Printing',
          'Hardware maintenance'
        ],
        correctAnswer: 1
      }
    ]
  };

  const totalPages = Math.ceil(quiz.questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = quiz.questions.slice(startIndex, endIndex);

  const handleBack = () => {
    navigate('/dashboard/lmsAuthor/quiz-bank');
  };

  const handleEdit = () => {
    navigate(`/dashboard/lmsAuthor/quiz-bank-edit?id=${quiz.id}`);
  };

  const handleLinkToCourse = () => {
    setIsLinkModalOpen(true);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  const handleSaveLink = (quizId: string, courseId: string, moduleId: string) => {
    console.log('Linking quiz:', quizId, 'to course:', courseId, 'module:', moduleId);
    // Add link to course logic here
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Split questions into two columns
  const leftColumnQuestions = currentQuestions.filter((_, index) => index % 2 === 0);
  const rightColumnQuestions = currentQuestions.filter((_, index) => index % 2 === 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quiz bank view</h1>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <button
          onClick={handleBack}
          className="flex items-center space-x-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quiz bank list</span>
        </button>
      </div>

      {/* Quiz Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">{quiz.title}</h2>
            <p className="text-muted-foreground">{quiz.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLinkToCourse}
              className="flex items-center space-x-2"
            >
              <Link className="w-4 h-4" />
              <span>Link to a course</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Quiz Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {leftColumnQuestions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Q{startIndex + (index * 2) + 1} {question.question}
                  </h3>
                  <p className="text-sm text-muted-foreground">(Select one answer)</p>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionIndex}
                        className="w-4 h-4 text-primary focus:ring-primary border-border"
                        readOnly
                      />
                      <span className="text-sm text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {rightColumnQuestions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Q{startIndex + (index * 2) + 2} {question.question}
                  </h3>
                  <p className="text-sm text-muted-foreground">(Select one answer)</p>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionIndex}
                        className="w-4 h-4 text-primary focus:ring-primary border-border"
                        readOnly
                      />
                      <span className="text-sm text-foreground">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Link to Course Modal */}
      <LinkToCourseModal
        quiz={quiz}
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
      />
    </div>
  );
};

export default QuizBankView;
