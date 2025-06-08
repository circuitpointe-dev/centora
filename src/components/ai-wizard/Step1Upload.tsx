
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText } from "lucide-react";

interface Step1UploadProps {
  uploadedFile: File | null;
  pastedContent: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPastedContentChange: (content: string) => void;
}

const Step1Upload: React.FC<Step1UploadProps> = ({
  uploadedFile,
  pastedContent,
  onFileUpload,
  onPastedContentChange
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-medium text-violet-600 mb-2">Start Your Proposal</h3>
        <p className="text-gray-500">Upload your donor call document or paste the content to begin</p>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg space-y-6">
        {/* Upload Document Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-violet-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">Upload Document</h4>
              <p className="text-sm text-gray-500">Supported formats: PDF, DOCS, TXT</p>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={onFileUpload}
            />
            <div className="flex items-center justify-center gap-8">
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Browse Files
              </Button>
              <span className="text-gray-500">or drag and drop here</span>
            </div>
            {uploadedFile && (
              <p className="mt-2 text-sm text-green-600">File uploaded: {uploadedFile.name}</p>
            )}
          </div>
        </div>

        <div className="text-center text-violet-600 font-medium text-xl">- OR -</div>

        {/* Paste Content Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-violet-600" />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-800">Paste Content</h4>
              <p className="text-sm text-gray-500">Copy and paste your donor call content</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Paste your donor call content here..."
              value={pastedContent}
              onChange={(e) => onPastedContentChange(e.target.value)}
              className="min-h-[176px] resize-none"
              maxLength={5000}
            />
            <div className="text-right text-xs text-gray-500">
              {pastedContent.length}/5000 Characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Upload;
