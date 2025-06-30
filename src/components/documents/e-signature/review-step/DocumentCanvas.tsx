
import React, { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Multiple worker fallback options for better reliability
try {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
} catch (e) {
  // Fallback to CDN worker
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

interface DocumentCanvasProps {
  fileUrl?: string;
}

interface UploadedFile {
  file: File;
  url: string;
  name: string;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  // Use uploaded file URL if available, otherwise use the passed fileUrl
  const currentFileUrl = uploadedFile?.url || fileUrl;

  const validatePDFFile = (file: File): string | null => {
    console.log("Validating file:", { name: file.name, type: file.type, size: file.size });
    
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return "Please select a valid PDF file.";
    }
    
    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      return "File size must be less than 25MB.";
    }
    
    if (file.size === 0) {
      return "The selected file appears to be empty.";
    }
    
    return null;
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file);
    
    const validationError = validatePDFFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Clean up previous blob URL
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }

    const blobUrl = URL.createObjectURL(file);
    console.log("Created blob URL:", blobUrl);
    
    setUploadedFile({
      file,
      url: blobUrl,
      name: file.name
    });
    setError(null);
    setLoading(true);
    
    // Reset the file input
    event.target.value = '';
  }, [uploadedFile]);

  const handleRemoveFile = useCallback(() => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    setError(null);
    setLoading(true);
  }, [uploadedFile]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log("PDF loaded successfully with", numPages, "pages");
    console.log("File URL used:", currentFileUrl);
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    console.error("File URL that failed:", currentFileUrl);
    console.error("Error details:", error.message, error.stack);
    
    let errorMessage = "Failed to load PDF file.";
    
    if (error.message.includes('InvalidPDFException')) {
      errorMessage = "The file appears to be corrupted or not a valid PDF.";
    } else if (error.message.includes('MissingPDFException')) {
      errorMessage = "No PDF file was provided or the file is empty.";
    } else if (error.message.includes('UnexpectedResponseException')) {
      errorMessage = "Unable to load the PDF file. Please try a different file.";
    }
    
    setError(errorMessage);
    setLoading(false);
  }

  // Clean up blob URLs on unmount
  React.useEffect(() => {
    return () => {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
    };
  }, [uploadedFile]);

  if (!currentFileUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border rounded bg-gray-50">
        <div className="flex flex-col items-center gap-4 p-6">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload PDF Document</h3>
            <p className="text-gray-500 text-sm mb-4">
              Select a PDF file to review and add signature fields
            </p>
          </div>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-[5px]">
              <Upload className="w-4 h-4 mr-2" />
              Select PDF File
            </Button>
          </div>
          <p className="text-xs text-gray-400">Max file size: 25MB</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border rounded bg-gray-50">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="text-red-500 text-center mb-4">
            <p className="font-medium">{error}</p>
          </div>
          {uploadedFile && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{uploadedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="h-6 w-6 text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="rounded-[5px]">
                Try Different File
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* File Info and Upload Controls */}
      {uploadedFile && (
        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">{uploadedFile.name}</span>
            <span className="text-xs text-green-600">• Loaded successfully</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="ghost" size="sm" className="text-xs">
                Replace
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="h-6 w-6 text-red-500 hover:text-red-700"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-2">
        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
            disabled={pageNumber <= 1}
          >
            ◀
          </button>
          <span className="text-sm">
            {loading ? "Loading..." : `${pageNumber} / ${numPages}`}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
            disabled={pageNumber >= numPages || loading}
          >
            ▶
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            className="px-2 py-1 border rounded"
            disabled={loading}
          >
            –
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
            className="px-2 py-1 border rounded"
            disabled={loading}
          >
            +
          </button>
        </div>
      </div>

      {/* PDF Render */}
      <div className="overflow-auto border rounded flex justify-center bg-gray-50 min-h-[400px]">
        {loading && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500">Loading PDF...</p>
          </div>
        )}
        <Document 
          file={currentFileUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-gray-500">Loading PDF...</p>
            </div>
          }
        >
          {!loading && !error && (
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          )}
        </Document>
      </div>
    </div>
  );
};
