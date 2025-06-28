import React, { useState, useRef, useCallback } from 'react';
import { FileText, Upload, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ProgressIndicator } from './ProgressIndicator';

export const RequestSignatureWizard: React.FC = () => {
  const progressSteps = [
    { id: 1, label: 'Select Document', active: true },
    { id: 2, label: 'Assign Recipient & Order', active: false },
    { id: 3, label: 'Review & Send', active: false },
  ];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('File must be ≤ 25 MB.');
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <div className="flex justify-center">
        <ProgressIndicator steps={progressSteps} />
      </div>

      {/* Document Selection Cards */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Select Document Card */}
          <Card className="h-[280px] bg-white rounded-lg shadow-md border">
            <CardContent className="flex flex-col items-center justify-center gap-6 h-full p-6">
              <FileText className="w-10 h-10 text-gray-600" />
              <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-gray-500 text-sm text-center">
                  Select a document from Document Folder
                </p>
                <Button
                  onClick={() => {
                    /* your logic to open folder picker */
                  }}
                  className="bg-violet-600 hover:bg-violet-700 text-white rounded-md px-4 py-2"
                >
                  Select Document
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Document Card */}
          <Card
            className="h-[280px] bg-white rounded-lg shadow-md border"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <CardContent className="flex flex-col items-center justify-center gap-4 h-full p-6">
              <Upload className="w-10 h-10 text-gray-600" />

              {selectedFile ? (
                <div className="text-center">
                  <p className="text-gray-700 font-medium">{selectedFile.name}</p>
                  <p className="text-gray-500 text-xs">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 text-sm text-center">
                    Drag & Drop your PDF here
                  </p>
                  <p className="text-gray-500 text-sm">or</p>
                  <Button
                    variant="outline"
                    onClick={handleBrowseClick}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Browse Files
                  </Button>
                  <p className="text-gray-400 text-xs text-center">
                    Supported format: PDF (Max 25 MB)
                  </p>
                </>
              )}

              {error && (
                <p className="text-red-600 text-xs mt-2">{error}</p>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInputChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Message to Recipients */}
        <div className="space-y-3">
          <label className="font-medium text-gray-900 text-sm">
            Message to Recipients
          </label>
          <Textarea
            className="min-h-[100px] bg-white rounded-md shadow-sm border resize-none"
            placeholder="Add a message for your recipients..."
          />
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-center">
        <Button
          disabled={!selectedFile}
          className={`rounded-md px-6 py-3 h-auto ${
            selectedFile
              ? 'bg-violet-600 hover:bg-violet-700 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Proceed to Recipients
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
