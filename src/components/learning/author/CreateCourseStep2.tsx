import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';

interface CourseData {
  courseName: string;
  courseDescription: string;
  courseOverview: string;
  coverImage: File | null;
  coverImagePreview: string;
}

const CreateCourseStep2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [courseUrl, setCourseUrl] = useState('');
  
  // Get course data from location state
  const courseData: CourseData = location.state?.courseData || {
    courseName: 'Introduction to Digital Marketing Strategies',
    courseDescription: 'Understand the key concepts to create designs that adapt to various screen sizes.',
    courseOverview: '',
    coverImage: null,
    coverImagePreview: '/src/assets/images/dummy image.png'
  };

  // Generate URL slug from course name
  const generateUrlSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Auto-generate URL when component mounts or course name changes
  useEffect(() => {
    if (courseData.courseName) {
      const generatedUrl = generateUrlSlug(courseData.courseName);
      setCourseUrl(generatedUrl);
    }
  }, [courseData.courseName]);

  const handleBackToStep1 = () => {
    navigate('/dashboard/lmsAuthor/create-course', { 
      state: { courseData } 
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow URL-friendly characters
    const sanitizedValue = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // Only allow letters, numbers, and hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    setCourseUrl(sanitizedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseUrl.trim()) {
      alert('Please enter a course URL');
      return;
    }

    // Prepare course data for submission
    const finalCourseData = {
      ...courseData,
      courseUrl: courseUrl.trim(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      id: Date.now().toString() // Generate a temporary ID
    };

    console.log('Course data prepared:', finalCourseData);
    
    // Navigate to Course Editor Choice page
    const targetUrl = `/dashboard/lmsAuthor/course-editor-choice`;
    console.log('Navigating to:', targetUrl);
    navigate(targetUrl, {
      state: { courseData: finalCourseData }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToStep1}
            className="flex items-center text-primary hover:text-primary/90 font-medium"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </button>
          <h1 className="text-xl font-semibold text-foreground">Create course</h1>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Column - Form */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">Create your course URL (2/2)</span>
                <span className="text-muted-foreground">100%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* Course URL Input */}
            <div className="space-y-2">
              <label htmlFor="courseUrl" className="text-sm font-medium text-foreground">Name of course URL</label>
              <Input
                id="courseUrl"
                name="courseUrl"
                value={courseUrl}
                onChange={handleUrlChange}
                placeholder="Enter course URL"
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground">
                This will be your course URL: /course/{courseUrl || 'your-course-url'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSubmit}
                disabled={!courseUrl.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="w-96 bg-muted/30 p-6 overflow-y-auto">
          <div className="sticky top-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={courseData.coverImagePreview}
                  alt={courseData.courseName}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <h4 className="font-semibold text-foreground text-lg">
                  {courseData.courseName || 'Course Title'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {courseData.courseDescription || 'Course description will appear here...'}
                </p>
                {courseData.courseOverview && (
                  <div 
                    className="text-sm text-muted-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: courseData.courseOverview }}
                  />
                )}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <strong>Course URL:</strong> /course/{courseUrl || 'your-course-url'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseStep2;
