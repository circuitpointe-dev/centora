import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Blocks, Presentation } from 'lucide-react';

const CourseEditorChoice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const courseData = location.state?.courseData;

  const handleBackToStep2 = () => {
    navigate('/dashboard/lmsAuthor/create-course-step2', {
      state: { courseData: courseData }
    });
  };

  const handleChooseBlockEditor = () => {
    navigate('/dashboard/lmsAuthor/courses', {
      state: { courseData: courseData }
    });
  };

  const handleChooseSlideEditor = () => {
    navigate('/dashboard/lmsAuthor/slide-editor', {
      state: { courseData: courseData }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToStep2}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Step 3 of 3</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Choose your course editor
            </h1>
            <p className="text-lg text-muted-foreground">
              Select the editor that best fits your course creation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Block Editor Option */}
            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleChooseBlockEditor}>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Blocks size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Block Editor</h3>
                <p className="text-muted-foreground mb-6">
                  Create structured courses with organized sections and lessons. Perfect for comprehensive learning paths with videos, text, quizzes, and assignments.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Organized sections and lessons
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Multiple content types
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Interactive quizzes and assignments
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Choose Block Editor
                </Button>
              </div>
            </Card>

            {/* Slide Editor Option */}
            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleChooseSlideEditor}>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors">
                  <Presentation size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Slide Editor</h3>
                <p className="text-muted-foreground mb-6">
                  Create engaging presentations with slides, animations, and interactive elements. Ideal for visual learning and presentations.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Slide-based presentations
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Animations and transitions
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Visual learning focus
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleChooseSlideEditor}
                >
                  Choose Slide Editor
                </Button>
              </div>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              You can always switch between editors later in your course settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditorChoice;
