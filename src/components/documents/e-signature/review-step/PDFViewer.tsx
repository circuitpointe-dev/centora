import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set the worker source to match the installed version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  pageNumber: number;
  scale: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  loading: boolean;
  error: string | null;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUrl,
  pageNumber,
  scale,
  onLoadSuccess,
  onLoadError,
  loading,
  error
}) => {
  return (
    <Document 
      file={fileUrl} 
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
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
  );
};