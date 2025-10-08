import React, { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState('Introduction to Digital Marketing Strategies');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseOverview, setCourseOverview] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('/src/assets/images/dummy image.png');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleBackToCourseList = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
  };

  const handleFileUpload = (file: File) => {
    if (file && file.size <= 25 * 1024 * 1024) { // 25MB limit
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview('/src/assets/images/dummy image.png');
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare course data for step 2
    const courseData = {
      courseName,
      courseDescription,
      courseOverview,
      coverImage,
      coverImagePreview
    };
    
    // Navigate to step 2 with course data
    navigate('/dashboard/lmsAuthor/create-course-step2', {
      state: { courseData }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToCourseList}
            className="flex items-center text-primary hover:text-primary/90 font-medium"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Course list
          </button>
          <h1 className="text-xl font-semibold text-foreground">Create course</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Column - Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">Let's set up your course (1/2)</span>
                  <span className="text-muted-foreground">50%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              {/* Course Name */}
              <div className="space-y-2">
                <label htmlFor="courseName" className="text-sm font-medium text-foreground">Name of your course?</label>
                <Input
                  id="courseName"
                  name="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter course name"
                  className="w-full"
                />
              </div>

              {/* Course Description */}
              <div className="space-y-2">
                <label htmlFor="courseDescription" className="text-sm font-medium text-foreground">Description of your course?</label>
                <Textarea
                  id="courseDescription"
                  name="courseDescription"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Enter course description"
                  className="w-full min-h-[100px]"
                />
              </div>

              {/* Course Overview - Rich Text Editor */}
              <div className="space-y-2">
                <label htmlFor="courseOverview" className="text-sm font-medium text-foreground">Course overview</label>
                <div className="border border-border rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={courseOverview}
                    onChange={setCourseOverview}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        ['link', 'image'],
                        ['clean']
                      ],
                    }}
                    formats={[
                      'header', 'bold', 'italic', 'underline', 'strike',
                      'align', 'list', 'bullet', 'indent',
                      'link', 'image'
                    ]}
                    style={{
                      height: '300px',
                      backgroundColor: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Upload a cover image</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('coverImageUpload')?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground mb-2">Choose a file or drag & drop it here</p>
                  <Button type="button" variant="outline" size="sm" className="mb-2">
                    Browse file
                  </Button>
                  <p className="text-xs text-muted-foreground">Maximum size: 25MB</p>
                </div>
                
                {/* Hidden file input */}
                <input
                  id="coverImageUpload"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                
                {coverImage && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{coverImage.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(coverImage.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={removeCoverImage}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Button type="button" variant="outline" onClick={handleBackToCourseList}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
                    src={coverImagePreview}
                    alt={courseName}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="font-semibold text-foreground text-lg">
                    {courseName || 'Course Title'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {courseDescription || 'Course description will appear here...'}
                  </p>
                  {courseOverview && (
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: courseOverview }}
                    />
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
