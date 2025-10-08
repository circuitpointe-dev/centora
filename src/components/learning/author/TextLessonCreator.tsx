import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { 
  ArrowLeft, 
  Eye,
  FileText
} from 'lucide-react';

const TextLessonCreator: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const [lessonTitle, setLessonTitle] = useState('Heading 1');
  const [content, setContent] = useState(`
    <h1>Heading1</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <img src="https://via.placeholder.com/800x400/ff6b6b/ffffff?text=Sample+Image" alt="Sample content" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />
  `);
  const [isOptional, setIsOptional] = useState(false);

  const handleBackToCourseList = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
  };

  const handleSaveLesson = () => {
    console.log('Saving text lesson:', {
      title: lessonTitle,
      content,
      isOptional
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
        <div className="space-y-6">
          {/* Lesson Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Lesson title</label>
            <Input
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Enter lesson title"
              className="w-full"
            />
          </div>

          {/* Rich Text Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Content</label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start typing your lesson content..."
              className="min-h-[500px]"
            />
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

export default TextLessonCreator;
