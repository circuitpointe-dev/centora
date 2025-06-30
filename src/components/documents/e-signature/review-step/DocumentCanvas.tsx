
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use local worker instead of CDN
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface DocumentCanvasProps {
  fileUrl: string;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log("PDF loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    setError("Failed to load PDF file. Please ensure it's a valid PDF.");
    setLoading(false);
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] border rounded">
        <p className="text-red-500 text-center mb-4">{error}</p>
        <p className="text-gray-500 text-sm">Please try uploading a different PDF file.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
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
          file={fileUrl} 
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
