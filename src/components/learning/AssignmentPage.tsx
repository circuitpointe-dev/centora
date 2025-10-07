import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, FileText, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssignmentPageProps {
  assignmentId?: string;
  courseId?: string;
}

const AssignmentPage: React.FC<AssignmentPageProps> = ({ assignmentId, courseId }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      alert('File size must be less than 25MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Please select a file to submit');
      return;
    }
    
    // Here you would typically upload the file to a server
    console.log('Submitting file:', selectedFile.name);
    alert('Assignment submitted successfully!');
    
    // Navigate to next lesson or back to course
    navigate(`/dashboard/learning/enrolled-course-${courseId}`);
  };

  const handleLessonNavigation = (direction: 'previous' | 'next') => {
    if (direction === 'previous') {
      console.log('Navigate to previous lesson');
    } else {
      console.log('Navigate to next lesson');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/dashboard/learning/enrolled-course-${courseId}`)}
                className="flex items-center text-muted-foreground hover:text-card-foreground"
              >
                <ArrowLeft size={20} className="mr-2" />
                <span className="text-sm font-medium">Back to Course workspace</span>
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-card-foreground">Module 2: Advanced features of digital tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Assignment Card */}
          <div className="bg-card rounded-xl shadow-sm border p-8">
            {/* Assignment Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-card-foreground mb-2">
                Assignment: Case study on digital tools
              </h1>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar size={16} />
                <span className="text-sm">Due: Aug 15, 2025</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Instructions</h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-card-foreground leading-relaxed">
                  Please write a 15000 word case study in pdf, describing how NGOs can leverage digital collaboration tools to improve operational efficiency.
                </p>
              </div>
            </div>

            {/* File Upload Area */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">Submit Your Assignment</h3>
              
              {selectedFile ? (
                /* Uploaded File Display */
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-border'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <Upload size={48} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-card-foreground mb-2">
                          Choose a file or drag & drop it here
                        </p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Browse file
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Uploaded File Display */}
                  <div className="bg-muted rounded-lg p-4 border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <FileText size={24} className="text-muted-foreground" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-sm transform rotate-45"></div>
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-1 hover:bg-accent rounded-full transition-colors"
                      >
                        <X size={20} className="text-muted-foreground hover:text-card-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Upload Area */
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-border'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload size={48} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-card-foreground mb-2">
                        Choose a file or drag & drop it here
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Browse file
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Maximum size: 25MB
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!selectedFile}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  selectedFile
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Submit assignment
              </button>
            </div>
          </div>

          {/* Lesson Navigation */}
          <div className="flex justify-between items-center bg-card rounded-lg shadow-sm border p-6">
            <button
              onClick={() => handleLessonNavigation('previous')}
              className="px-6 py-2 border border-border bg-background text-foreground rounded-lg hover:bg-accent font-medium transition-colors"
            >
              Previous lesson
            </button>
            <button
              onClick={() => handleLessonNavigation('next')}
              className="px-6 py-2 border border-border bg-background text-foreground rounded-lg hover:bg-accent font-medium transition-colors"
            >
              Next lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
