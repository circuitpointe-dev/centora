import React from "react";

interface PDFControlsProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  loading: boolean;
  onPageChange: (pageNumber: number) => void;
  onScaleChange: (scale: number) => void;
}

export const PDFControls: React.FC<PDFControlsProps> = ({
  pageNumber,
  numPages,
  scale,
  loading,
  onPageChange,
  onScaleChange
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      {/* Pagination */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={pageNumber <= 1}
        >
          ◀
        </button>
        <span className="text-sm">
          {loading ? "Loading..." : `${pageNumber} / ${numPages}`}
        </span>
        <button
          onClick={() => onPageChange(Math.min(numPages, pageNumber + 1))}
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={pageNumber >= numPages || loading}
        >
          ▶
        </button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onScaleChange(Math.max(0.5, scale - 0.25))}
          className="px-2 py-1 border rounded"
          disabled={loading}
        >
          –
        </button>
        <span className="text-sm">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => onScaleChange(Math.min(3, scale + 0.25))}
          className="px-2 py-1 border rounded"
          disabled={loading}
        >
          +
        </button>
      </div>
    </div>
  );
};