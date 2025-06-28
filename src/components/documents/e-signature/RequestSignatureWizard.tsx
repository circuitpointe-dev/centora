
import React from 'react';
import { FileText, Upload, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ProgressIndicator } from './ProgressIndicator';

export const RequestSignatureWizard = () => {
  const progressSteps = [
    { id: 1, label: "Select Document", active: true },
    { id: 2, label: "Assign Recipient & Order", active: false },
    { id: 3, label: "Review & Send", active: false },
  ];

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
                <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-md px-4 py-2">
                  Select Document
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upload Document Card */}
          <Card className="h-[280px] bg-white rounded-lg shadow-md border">
            <CardContent className="flex flex-col items-center justify-center gap-6 h-full p-6">
              <Upload className="w-10 h-10 text-gray-600" />
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="text-center space-y-2">
                  <p className="text-gray-500 text-sm">
                    Drag & Drop your document here
                  </p>
                  <p className="text-gray-500 text-sm">or</p>
                </div>

                <div className="flex flex-col items-center gap-3 w-full">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Browse Files
                  </Button>
                  <p className="text-gray-400 text-xs text-center">
                    Supported format: PDF (Max 25MB)
                  </p>
                </div>
              </div>
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
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-md px-6 py-3 h-auto">
          Proceed to Recipients
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
