import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer (0-based)
}

interface QuizPageProps {
  quizId?: string;
  courseId?: string;
}

const QuizPage: React.FC<QuizPageProps> = ({ quizId, courseId }) => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock quiz data based on the image
  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What are common benefits of using cloud storage?',
      options: [
        'Accessibility from anywhere',
        'Limited storage capacity',
        'Higher security risks',
        'Slower performance'
      ],
      correctAnswer: 0
    },
    {
      id: 'q2',
      question: 'Which of the following is a popular video conferencing tool?',
      options: [
        'Photoshop',
        'Microsoft Word',
        'Excel',
        'PowerPoint'
      ],
      correctAnswer: 0
    },
    {
      id: 'q3',
      question: 'What is a key feature of project management software?',
      options: [
        'Social media management',
        'Task tracking and scheduling',
        'Photo editing',
        'Email marketing'
      ],
      correctAnswer: 1
    },
    {
      id: 'q4',
      question: 'Which of these is a well-known cloud storage provider?',
      options: [
        'Dropbox',
        'Notepad',
        'Calculator',
        'Paint'
      ],
      correctAnswer: 0
    },
    {
      id: 'q5',
      question: 'What does SaaS stand for?',
      options: [
        'System as a Software',
        'Software as a Service',
        'Storage as a Solution',
        'Security as a Service'
      ],
      correctAnswer: 1
    },
    {
      id: 'q6',
      question: 'Which tool is best for collaborative design?',
      options: [
        'Figma',
        'Calculator',
        'Notepad',
        'Paint'
      ],
      correctAnswer: 0
    },
    {
      id: 'q7',
      question: 'What is an advantage of using online surveys?',
      options: [
        'Quick data collection',
        'Limited responses',
        'High costs',
        'Complex setup'
      ],
      correctAnswer: 0
    },
    {
      id: 'q8',
      question: 'Which of these tools supports remote work?',
      options: [
        'Slack',
        'Calculator',
        'Notepad',
        'Paint'
      ],
      correctAnswer: 0
    },
    {
      id: 'q9',
      question: 'What is a common use of cloud applications?',
      options: [
        'Email management',
        'Hardware maintenance',
        'Physical storage',
        'Local processing'
      ],
      correctAnswer: 0
    },
    {
      id: 'q10',
      question: 'Which service is used for file sharing?',
      options: [
        'Google Drive',
        'Calculator',
        'Notepad',
        'Paint'
      ],
      correctAnswer: 0
    }
  ];

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    // Calculate score
    const totalQuestions = quizQuestions.length;
    const correctAnswers = quizQuestions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    console.log(`Quiz submitted! Score: ${score}% (${correctAnswers}/${totalQuestions})`);
    
    // Navigate back to course after submission
    setTimeout(() => {
      navigate(`/dashboard/learning/enrolled-course-${courseId}`);
    }, 2000);
  };

  const handleLessonNavigation = (direction: 'previous' | 'next') => {
    if (direction === 'previous') {
      console.log('Navigate to previous lesson');
    } else {
      console.log('Navigate to next lesson');
    }
  };

  const isAnswerSelected = (questionId: string) => {
    return selectedAnswers[questionId] !== undefined;
  };

  const getAnswerStyle = (questionId: string, optionIndex: number) => {
    const isSelected = selectedAnswers[questionId] === optionIndex;
    const question = quizQuestions.find(q => q.id === questionId);
    const isCorrect = question?.correctAnswer === optionIndex;
    
    if (isSubmitted) {
      if (isCorrect) {
        return 'bg-green-100 border-green-500 text-green-700';
      } else if (isSelected && !isCorrect) {
        return 'bg-red-100 border-red-500 text-red-700';
      }
    }
    
    if (isSelected) {
      return 'bg-purple-100 border-purple-500 text-purple-700';
    }
    
    return 'bg-white border-gray-300 text-gray-700 hover:border-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/dashboard/learning/enrolled-course-${courseId}`)}
                className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Course workspace
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-900">Module 2: Advanced features of digital tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Quiz Header */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Quiz: Collaboration basics
            </h1>
            <p className="text-gray-600">
              Test your knowledge of digital collaboration tools and practices.
            </p>
          </div>

          {/* Quiz Questions */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {quizQuestions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Q{index + 1}: {question.question}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">(Select one answer)</p>
                  </div>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-2 border rounded-md cursor-pointer transition-all duration-200 ${getAnswerStyle(question.id, optionIndex)}`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={optionIndex}
                          checked={selectedAnswers[question.id] === optionIndex}
                          onChange={() => handleAnswerSelect(question.id, optionIndex)}
                          disabled={isSubmitted}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-2 w-full">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers[question.id] === optionIndex
                              ? 'border-current bg-current'
                              : 'border-gray-300'
                          }`}>
                            {selectedAnswers[question.id] === optionIndex && (
                              <CheckCircle size={10} className="text-white" />
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button - positioned after Q5 as shown in image */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitted || Object.keys(selectedAnswers).length !== quizQuestions.length}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isSubmitted || Object.keys(selectedAnswers).length !== quizQuestions.length
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isSubmitted ? 'Quiz Submitted!' : 'Submit quiz'}
              </button>
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border p-6">
            <button
              onClick={() => handleLessonNavigation('previous')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Previous lesson
            </button>
            <button
              onClick={() => handleLessonNavigation('next')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Next lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
