import React, { useState } from 'react';
import { ArrowLeft, GripVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options: QuizOption[];
}

interface QuizBankEditProps {
  quizId?: string;
}

const QuizBankEdit: React.FC<QuizBankEditProps> = ({ quizId }) => {
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState('Collaboration basics');
  const [quizDescription, setQuizDescription] = useState('Introduction video');
  const [isOptional, setIsOptional] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: '1',
      question: '',
      type: 'single',
      options: [
        { id: 'opt-1-1', text: '', isCorrect: false },
        { id: 'opt-1-2', text: '', isCorrect: false },
        { id: 'opt-1-3', text: '', isCorrect: false },
        { id: 'opt-1-4', text: '', isCorrect: false }
      ]
    }
  ]);

  const handleBack = () => {
    navigate('/dashboard/lmsAuthor/quiz-bank-view');
  };

  const handleSaveQuiz = () => {
    console.log('Saving quiz:', {
      title: quizTitle,
      description: quizDescription,
      isOptional,
      questions
    });
    // Add save logic here
    navigate('/dashboard/lmsAuthor/quiz-bank-view');
  };

  const handleCancel = () => {
    navigate('/dashboard/lmsAuthor/quiz-bank-view');
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: (questions.length + 1).toString(),
      question: '',
      type: 'single',
      options: [
        { id: `opt-${questions.length + 1}-1`, text: '', isCorrect: false },
        { id: `opt-${questions.length + 1}-2`, text: '', isCorrect: false },
        { id: `opt-${questions.length + 1}-3`, text: '', isCorrect: false },
        { id: `opt-${questions.length + 1}-4`, text: '', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionId: string, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options.map(opt => 
              opt.id === optionId ? { ...opt, [field]: value } : opt
            )
          }
        : q
    ));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOption = {
        id: `opt-${questionId}-${question.options.length + 1}`,
        text: '',
        isCorrect: false
      };
      updateQuestion(questionId, 'options', [...question.options, newOption]);
    }
  };

  const removeOption = (questionId: string, optionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options.length > 1) {
      updateQuestion(questionId, 'options', question.options.filter(opt => opt.id !== optionId));
    }
  };

  const handleCorrectAnswerChange = (questionId: string, optionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      // For single answer questions, uncheck all other options
      const updatedOptions = question.options.map(opt => ({
        ...opt,
        isCorrect: opt.id === optionId
      }));
      updateQuestion(questionId, 'options', updatedOptions);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quiz bank edit</h1>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button
          onClick={handleBack}
          className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quiz bank list</span>
        </button>
      </div>

      {/* Quiz Details Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz title
            </label>
            <Input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz description
            </label>
            <Input
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Enter quiz description"
            />
          </div>
        </div>
      </Card>

      {/* Lesson Settings Card */}
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="optional"
            checked={isOptional}
            onChange={(e) => setIsOptional(e.target.checked)}
            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="optional" className="text-sm font-medium text-gray-700">
            Mark as optional
          </label>
        </div>
      </Card>

      {/* Questions */}
      {questions.map((question, questionIndex) => (
        <Card key={question.id} className="p-6">
          <div className="space-y-4">
            {/* Question Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Question #{questionIndex + 1}
              </h3>
              <div className="flex items-center space-x-2">
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="single">One correct answer</option>
                  <option value="multiple">Multiple correct answers</option>
                  <option value="text">Text answer</option>
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <div className="border border-gray-300 rounded-md">
                {/* Rich Text Editor Toolbar */}
                <div className="border-b border-gray-300 p-2 bg-gray-50 flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" />
                    </svg>
                  </button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <select className="text-sm border-none bg-transparent focus:outline-none">
                    <option>Normal text</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold">B</button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600 italic">I</button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600 underline">U</button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600 line-through">S</button>
                </div>
                {/* Text Area */}
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                  placeholder="Enter your question here..."
                  className="w-full p-3 border-0 focus:outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <div key={option.id} className="flex items-start space-x-3">
                  <div className="flex items-center space-x-2 mt-3">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                  </div>
                  <div className="flex-1">
                    <div className="border border-gray-300 rounded-md">
                      {/* Option Rich Text Editor Toolbar */}
                      <div className="border-b border-gray-300 p-2 bg-gray-50 flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" />
                          </svg>
                        </button>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <select className="text-sm border-none bg-transparent focus:outline-none">
                          <option>Normal text</option>
                          <option>Heading 1</option>
                          <option>Heading 2</option>
                        </select>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold">B</button>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600 italic">I</button>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600 underline">U</button>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600 line-through">S</button>
                      </div>
                      {/* Option Text Area */}
                      <textarea
                        value={option.text}
                        onChange={(e) => updateOption(question.id, option.id, 'text', e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="w-full p-3 border-0 focus:outline-none resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={() => handleCorrectAnswerChange(question.id, option.id)}
                          className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-700">This is the correct answer</label>
                      </div>
                      {question.options.length > 1 && (
                        <button
                          onClick={() => removeOption(question.id, option.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            <Button
              variant="outline"
              onClick={() => addOption(question.id)}
              className="text-primary border-primary hover:bg-primary hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add option
            </Button>
          </div>
        </Card>
      ))}

      {/* Add Question Button */}
      <Button
        variant="outline"
        onClick={addQuestion}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add question
      </Button>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveQuiz}
          className="px-6 bg-gray-900 hover:bg-gray-800 text-white"
        >
          Save quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizBankEdit;
