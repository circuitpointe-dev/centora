import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// PDF.js worker (adjust path as needed)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface DocumentCanvasProps {
  fileUrl: string; // a blob URL or remote URL
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="flex flex-col">
      {/* — Toolbar */}
      <div className="flex justify-between items-center mb-2">
        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            className="px-2 py-1 border rounded"
            disabled={pageNumber <= 1}
          >
            ◀
          </button>
          <span className="text-sm">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            className="px-2 py-1 border rounded"
            disabled={pageNumber >= numPages}
          >
            ▶
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            className="px-2 py-1 border rounded"
          >
            –
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => s + 0.25)}
            className="px-2 py-1 border rounded"
          >
            +
          </button>
        </div>
      </div>

      {/* — PDF Render */}
      <div className="overflow-auto border rounded flex justify-center">
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>
    </div>
  );
};
