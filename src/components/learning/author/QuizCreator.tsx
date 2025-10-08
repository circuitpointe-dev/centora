import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { 
  ArrowLeft, 
  Plus, 
  GripVertical, 
  ChevronDown, 
  ChevronRight,
  Eye,
  Upload,
  ClipboardList,
  MoreHorizontal
} from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
  isExpanded: boolean;
}

const QuizCreator: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const [quizTitle, setQuizTitle] = useState('Collaboration basics');
  const [quizDescription, setQuizDescription] = useState('Introduction video');
  const [isOptional, setIsOptional] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: '1',
      question: 'What are common benefits of using cloud storage?',
      type: 'single',
      isExpanded: true,
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
      isExpanded: false,
      options: [
        { id: '1', text: 'Zoom', isCorrect: true },
        { id: '2', text: 'Photoshop', isCorrect: false },
        { id: '3', text: 'Trello', isCorrect: false },
        { id: '4', text: 'Slack', isCorrect: false }
      ]
    }
  ]);

  const handleBackToCourseList = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
  };

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'single',
      isExpanded: true,
      options: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleToggleQuestion = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, isExpanded: !q.isExpanded } : q
    ));
  };

  const handleQuestionChange = (questionId: string, content: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, question: content } : q
    ));
  };

  const handleAddOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: [...q.options, { 
              id: Date.now().toString(), 
              text: '', 
              isCorrect: false 
            }]
          }
        : q
    ));
  };

  const handleOptionChange = (questionId: string, optionId: string, text: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options.map(opt => 
              opt.id === optionId ? { ...opt, text } : opt
            )
          }
        : q
    ));
  };

  const handleCorrectAnswerChange = (questionId: string, optionId: string, isCorrect: boolean) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options.map(opt => 
              opt.id === optionId 
                ? { ...opt, isCorrect }
                : q.type === 'single' 
                  ? { ...opt, isCorrect: false } // For single choice, uncheck others
                  : opt
            )
          }
        : q
    ));
  };

  const handleQuestionTypeChange = (questionId: string, type: 'single' | 'multiple') => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            type,
            options: q.options.map(opt => ({ ...opt, isCorrect: false })) // Reset correct answers
          }
        : q
    ));
  };

  const handleSaveLesson = () => {
    console.log('Saving quiz:', {
      title: quizTitle,
      description: quizDescription,
      isOptional,
      questions
    });
    // Navigate back or show success message
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCourseList}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Course list
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              Introduction to Digital Marketing Strategies
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">LA</span>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">SA</span>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-sm font-medium">MJ</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Quiz Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quiz title</label>
            <Input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Quiz description</label>
            <Textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Enter quiz description"
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Publish to Quiz Bank */}
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <Upload size={16} className="mr-2" />
              Publish to quiz bank
            </Button>
          </div>

          {/* Lesson Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Lesson settings</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="optional"
                checked={isOptional}
                onCheckedChange={(checked) => setIsOptional(checked as boolean)}
              />
              <label htmlFor="optional" className="text-sm text-foreground">
                Mark as optional
              </label>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Add question to your quiz</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <ClipboardList size={16} className="mr-2" />
                  Import from quiz bank
                </Button>
                <Button onClick={handleAddQuestion} size="sm">
                  <Plus size={16} className="mr-2" />
                  Add question
                </Button>
              </div>
            </div>

            {questions.map((question, index) => (
              <Card key={question.id} className="p-6 border-border">
                <div className="space-y-4">
                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GripVertical size={16} className="text-muted-foreground" />
                      <button
                        onClick={() => handleToggleQuestion(question.id)}
                        className="flex items-center space-x-2 text-foreground hover:text-primary"
                      >
                        {question.isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                        <span className="font-medium">Question #{index + 1}</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={question.type}
                        onChange={(e) => handleQuestionTypeChange(question.id, e.target.value as 'single' | 'multiple')}
                        className="h-8 px-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="single">One correct answer</option>
                        <option value="multiple">Multiple correct answers</option>
                      </select>
                      <MoreHorizontal size={16} className="text-muted-foreground" />
                    </div>
                  </div>

                  {question.isExpanded && (
                    <div className="space-y-4">
                      {/* Question Text */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Question</label>
                        <RichTextEditor
                          content={question.question}
                          onChange={(content) => handleQuestionChange(question.id, content)}
                          placeholder="Enter your question here..."
                          className="min-h-[100px]"
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <div key={option.id} className="flex items-start space-x-3">
                            <GripVertical size={16} className="text-muted-foreground mt-2" />
                            <div className="flex-1 space-y-2">
                              <label className="text-sm font-medium text-foreground">
                                :: Option {optionIndex + 1}
                              </label>
                              <RichTextEditor
                                content={option.text}
                                onChange={(content) => handleOptionChange(question.id, option.id, content)}
                                placeholder="Enter option text..."
                                className="min-h-[80px]"
                              />
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Checkbox
                                checked={option.isCorrect}
                                onCheckedChange={(checked) => handleCorrectAnswerChange(question.id, option.id, checked as boolean)}
                              />
                              <span className="text-sm text-foreground">
                                This is the correct answer
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddOption(question.id)}
                          className="mt-2"
                        >
                          <Plus size={16} className="mr-2" />
                          Add option
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={handleBackToCourseList}>
              Cancel
            </Button>
            <Button onClick={handleSaveLesson} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save lesson
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
