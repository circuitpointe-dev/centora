import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { 
  ArrowLeft, 
  Upload, 
  Eye,
  FileText,
  MoreHorizontal,
  X
} from 'lucide-react';

const AssignmentCreator: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const [assignmentTitle, setAssignmentTitle] = useState('Assignment: Case study on digital tools');
  const [instructions, setInstructions] = useState('Please write a 15000 word case study in pdf, describing how NGOs can leverage digital collaboration tools to improve operational efficiency.');
  const [isOptional, setIsOptional] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleBackToCourseList = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }
    
    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSaveLesson = () => {
    console.log('Saving assignment:', {
      title: assignmentTitle,
      instructions,
      isOptional,
      uploadedFile
    });
    // Navigate back or show success message
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          {/* Assignment Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Assignment title</label>
            <Input
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              placeholder="Enter assignment title"
              className="w-full"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Instructions</label>
            <RichTextEditor
              content={instructions}
              onChange={setInstructions}
              placeholder="Enter assignment instructions..."
              className="min-h-[200px]"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Upload resources (optional)</label>
            
            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Choose a file or drag & drop it here
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="mb-2"
                >
                  Browse file
                </Button>
                <p className="text-sm text-muted-foreground mb-4">
                  Maximum size: 25MB
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-muted-foreground">OR</span>
                </div>
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  Select from media library
                </button>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                />
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText size={24} className="text-primary" />
                    <div>
                      <p className="font-medium text-card-foreground">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            )}
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

export default AssignmentCreator;
