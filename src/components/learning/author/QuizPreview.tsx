import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Check,
  X
} from 'lucide-react';

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
  const location = useLocation();
  
  // Static course data - no dynamic extraction
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.title || 'Introduction to Digital Marketing Strategies';
  
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string[] }>({
    '1': ['1'], // Pre-select "Accessibility from anywhere" for Q1
    '2': ['2']  // Pre-select "Photoshop" for Q2
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sample quiz data matching the design exactly
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
    navigate('/dashboard/lmsAuthor/course-preview', {
      state: { courseData: courseData }
    });
  };

  const handlePublish = () => {
    console.log('Publishing course...');
    // Add publish logic here
  };

  const handleAnswerChange = (
    questionId: string, 
    optionId: string, 
    isChecked: boolean
  ) => {
    setSelectedAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (isChecked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, optionId]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(id => id !== optionId)
        };
      }
    });
  };

  const isOptionSelected = (questionId: string, optionId: string) => {
    return selectedAnswers[questionId]?.includes(optionId) || false;
  };

  const getFeedbackText = (questionId: string, optionId: string) => {
    if (!isSubmitted) return '';
    
    const question = quiz.find(q => q.id === questionId);
    const option = question?.options.find(o => o.id === optionId);
    
    if (isOptionSelected(questionId, optionId)) {
      return option?.isCorrect ? 'Correct' : 'Wrong';
    }
    return '';
  };

  const getFeedbackColor = (questionId: string, optionId: string) => {
    if (!isSubmitted) return '';
    
    const question = quiz.find(q => q.id === questionId);
    const option = question?.options.find(o => o.id === optionId);
    
    if (isOptionSelected(questionId, optionId)) {
      return option?.isCorrect ? 'text-green-600' : 'text-red-600';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToPreview}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">You are currently in preview mode</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handlePublish}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <Card className="w-full max-w-4xl bg-card shadow-lg">
          <div className="p-8">
            {/* Quiz Title */}
            <h1 className="text-2xl font-bold text-foreground mb-8">
              Quiz: Collaboration basics
            </h1>

            {/* Questions */}
            <div className="space-y-8">
              {quiz.map((question, questionIndex) => (
                <div key={question.id} className="space-y-4">
                  {/* Question Header */}
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-foreground">
                      Q{questionIndex + 1} {question.question}
                    </h2>
                    <p className="text-sm text-muted-foreground">(Select one answer)</p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-3 flex-1">
                          <input
                            type="checkbox"
                            id={`${question.id}-${option.id}`}
                            checked={isOptionSelected(question.id, option.id)}
                            onChange={(e) => handleAnswerChange(question.id, option.id, e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-background border-border rounded focus:ring-purple-500 focus:ring-2"
                            style={{
                              accentColor: '#9333ea'
                            }}
                          />
                          <label 
                            htmlFor={`${question.id}-${option.id}`}
                            className="text-foreground cursor-pointer"
                          >
                            {option.text}
                          </label>
                        </div>
                        
                        {/* Feedback */}
                        {getFeedbackText(question.id, option.id) && (
                          <span className={`text-sm font-medium ${getFeedbackColor(question.id, option.id)}`}>
                            {getFeedbackText(question.id, option.id)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Button */}
            <div className="mt-8 flex justify-start">
              <Button
                onClick={() => setIsSubmitted(true)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2"
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