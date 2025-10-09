import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, Plus, MoreHorizontal, ChevronUp, ChevronDown, GripVertical, Play, FileText, FileCheck, ClipboardList, Trash2 } from 'lucide-react';

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

const QuizEditor: React.FC = () => {
  const navigate = useNavigate();
  const { feature } = useParams();
  const location = useLocation();
  
  // Extract courseId and lessonId from feature parameter
  const courseId = feature?.split('-')[1] || '';
  const lessonId = feature?.split('-')[3] || '';
  
  // Get course data from navigation state
  const courseData = location.state?.courseData;
  const courseTitle = courseData?.title || 'Introduction to Digital Marketing Strategies';
  
  const [quizTitle, setQuizTitle] = useState('Quiz :Collaboration basics');
  const [quizDescription, setQuizDescription] = useState('Introduction video');
  const [isOptional, setIsOptional] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
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
  ]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const handleBackToCourseBuilder = () => {
    navigate(`/dashboard/lmsAuthor/courses-${courseId}-builder`);
  };

  const handleSaveLesson = () => {
    console.log('Saving quiz:', { quizTitle, quizDescription, questions, isOptional });
    alert('Quiz saved successfully!');
  };

  const handleCancel = () => {
    handleBackToCourseBuilder();
  };

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'single',
      options: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleAddOption = (questionId: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const newOption: QuizOption = {
          id: Date.now().toString(),
          text: 'New option',
          isCorrect: false
        };
        return { ...q, options: [...q.options, newOption] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleUpdateQuestion = (questionId: string, field: string, value: any) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleUpdateOption = (questionId: string, optionId: string, field: string, value: any) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const updatedOptions = q.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, [field]: value };
          }
          return opt;
        });
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const updatedOptions = q.options.filter(opt => opt.id !== optionId);
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToCourseBuilder}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Course list
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground">
              {courseTitle}
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

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Contents */}
        <div className="w-80 bg-card border-r border-border p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-6">Contents</h2>
          
          <div className="space-y-2">
            {/* Module Header */}
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center space-x-2">
                <GripVertical size={16} className="text-muted-foreground" />
                <button className="flex items-center space-x-2 text-card-foreground hover:text-foreground">
                  <ChevronUp size={16} />
                  <span className="font-medium">Module 1: Introduction to digital tools</span>
                </button>
              </div>
              <MoreHorizontal size={16} className="text-muted-foreground" />
            </div>

            {/* Module Lessons */}
            <div className="ml-6 space-y-1">
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <GripVertical size={14} className="text-muted-foreground" />
                <Play size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">Introduction video</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <GripVertical size={14} className="text-muted-foreground" />
                <FileCheck size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">Assignment: Case study on digital tools</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <GripVertical size={14} className="text-muted-foreground" />
                <FileText size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">Heading 1</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <GripVertical size={14} className="text-muted-foreground" />
                <ClipboardList size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground flex-1">Quiz: Collaboration basics</span>
              </div>
              
              {/* Add Lesson Button */}
              <button className="flex items-center space-x-2 p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full">
                <Plus size={16} />
                <span>Add lesson</span>
              </button>
            </div>
          </div>

          {/* Add Section Button */}
          <button className="flex items-center space-x-2 p-3 mt-6 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full">
            <Plus size={16} />
            <span>Add section</span>
          </button>
        </div>

        {/* Main Content Area - Quiz Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Quiz Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Quiz Details</h2>
                <Button variant="outline">
                  Publish to quiz bank
                </Button>
              </div>
              
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
            </div>

            {/* Lesson settings */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Lesson settings</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="optional"
                  checked={isOptional}
                  onCheckedChange={(checked) => setIsOptional(checked as boolean)}
                />
                <label htmlFor="optional" className="text-sm font-medium text-foreground">
                  Mark as optional
                </label>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Questions</h3>
              
              {questions.map((question, index) => (
                <div key={question.id} className="border border-border rounded-lg">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => toggleQuestionExpansion(question.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {expandedQuestions.has(question.id) ? (
                        <ChevronDown size={16} className="text-muted-foreground" />
                      ) : (
                        <ChevronDown size={16} className="text-muted-foreground" />
                      )}
                      <span className="font-medium text-foreground">Question #{index + 1}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={question.type}
                        onChange={(e) => handleUpdateQuestion(question.id, 'type', e.target.value)}
                        className="text-sm border border-border rounded px-3 py-1 bg-background"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="single">One correct answer</option>
                        <option value="multiple">Multiple correct answers</option>
                      </select>
                    </div>
                  </div>
                  
                  {expandedQuestions.has(question.id) && (
                    <div className="p-4 border-t border-border space-y-4">
                      {/* Question Content */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Question</label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => handleUpdateQuestion(question.id, 'question', e.target.value)}
                          placeholder="Enter your question here..."
                          className="w-full min-h-[120px]"
                        />
                      </div>

                      {/* Add Option Button */}
                      <div className="flex justify-start">
                        <Button onClick={() => handleAddOption(question.id)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Plus size={16} className="mr-2" />
                          Add option
                        </Button>
                      </div>

                      {/* Options */}
                      <div className="space-y-4">
                        {question.options.map((option, optIndex) => (
                          <div key={option.id} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <GripVertical size={16} className="text-muted-foreground" />
                              <label className="text-sm font-medium text-foreground">Option {optIndex + 1}</label>
                            </div>
                            <Textarea
                              value={option.text}
                              onChange={(e) => handleUpdateOption(question.id, option.id, 'text', e.target.value)}
                              placeholder="Enter option text here..."
                              className="w-full min-h-[100px]"
                            />
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`correct-${option.id}`}
                                checked={option.isCorrect}
                                onCheckedChange={(checked) => handleUpdateOption(question.id, option.id, 'isCorrect', checked)}
                              />
                              <label htmlFor={`correct-${option.id}`} className="text-sm font-medium text-foreground">
                                This is the correct answer
                              </label>
                              {question.options.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteOption(question.id, option.id)}
                                  className="ml-auto"
                                >
                                  <Trash2 size={16} className="text-destructive" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <Button onClick={handleAddQuestion} variant="outline">
                <Plus size={16} className="mr-2" />
                Add question
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 pb-12">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSaveLesson} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save lesson
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;
