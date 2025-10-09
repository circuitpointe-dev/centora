import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
}

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const QuizPreview: React.FC = () => {
  const navigate = useNavigate();
  const { feature } = useParams();
  const location = useLocation();
  
  // Extract courseId and quizId from feature parameter (format: courses-{courseId}-quiz-{quizId}-preview)
  const courseId = feature?.split('-')[1] || '';
  const quizId = feature?.split('-')[3] || '';
  
  // Get course data from navigation state
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.title || 'Introduction to Digital Marketing Strategies';
  
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string[] }>({
    '1': ['1'], // Pre-select "Accessibility from anywhere" for Q1
    '2': ['2']  // Pre-select "Photoshop" for Q2
  });

  // Sample quiz data matching the design
  const quiz: QuizQuestion[] = [
    {
      id: '1',
      question: 'What are common benefits of using cloud storage?',
      type: 'single',
      options: [
        { id: '1', text: 'Accessibility from anywhere', isCorrect: true },
        { id: '2', text: 'Enhanced security features', isCorrect: false },
        { id: '3', text: 'Automatic backups', isCorrect: false },
        { id: '4', text: 'All of the above', isCorrect: false }
      ]
    },
    {
      id: '2',
      question: 'Which of the following is a popular video conferencing tool?',
      type: 'single',
      options: [
        { id: '1', text: 'Zoom', isCorrect: true },
        { id: '2', text: 'Photoshop', isCorrect: false },
        { id: '3', text: 'Trello', isCorrect: false },
        { id: '4', text: 'Slack', isCorrect: false }
      ]
    }
  ];

  const handleBackToPreview = () => {
    navigate(`/dashboard/lmsAuthor/courses-${courseId}-preview`, {
      state: { courseData: courseData }
    });
  };

  const handlePublish = () => {
    console.log('Publishing course...');
    // Add publish logic here
  };

  const handleAnswerChange = (questionId: string, optionId: string, checked: boolean) => {
    setSelectedAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (checked) {
        // For single choice questions, replace the current selection
        return {
          ...prev,
          [questionId]: [optionId]
        };
      } else {
        // Remove the option if unchecked
        return {
          ...prev,
          [questionId]: currentAnswers.filter(id => id !== optionId)
        };
      }
    });
  };

  const handleSubmitQuiz = () => {
    console.log('Submitting quiz with answers:', selectedAnswers);
    // Add quiz submission logic here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToPreview}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>
          
          <div className="flex-1 text-center">
            <span className="text-sm text-muted-foreground">You are currently in preview mode</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={handlePublish} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 shadow-lg">
          <div className="space-y-8">
            {/* Quiz Title */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Quiz: Collaboration basics</h1>
            </div>

            {/* Questions */}
            <div className="space-y-8">
              {quiz.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  {/* Question */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Q{index + 1} {question.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const isSelected = selectedAnswers[question.id]?.includes(option.id) || false;
                      
                      return (
                        <div key={option.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={`${question.id}-${option.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleAnswerChange(question.id, option.id, checked as boolean)
                            }
                            className="w-5 h-5"
                          />
                          <label 
                            htmlFor={`${question.id}-${option.id}`}
                            className="text-foreground cursor-pointer flex-1"
                          >
                            {option.text}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-start pt-4">
              <Button 
                onClick={handleSubmitQuiz}
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-2"
              >
                Submit quiz
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizPreview;
