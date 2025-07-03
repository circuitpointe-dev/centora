import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Rect, Text } from "fabric";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set the worker source to match the installed version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;

interface FieldData {
  id: string;
  type: "signature" | "name" | "date" | "email" | "text";
  label: string;
  value?: any;
  isConfigured: boolean;
}

interface DocumentCanvasProps {
  fileUrl?: string;
  onFieldAdded?: (field: FieldData, position: { x: number; y: number }) => void;
}

interface UploadedFile {
  file: File;
  url: string;
  name: string;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({ fileUrl, onFieldAdded }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [droppedFields, setDroppedFields] = useState<Array<{ field: FieldData; position: { x: number; y: number } }>>([]);

  // Use uploaded file URL if available, otherwise use the passed fileUrl
  const currentFileUrl = uploadedFile?.url || fileUrl;

  const validatePDFFile = (file: File): string | null => {
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

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 1000,
      backgroundColor: "transparent",
      selection: true,
    });

    console.log("Fabric canvas initialized:", canvas);
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    
    setUploadedFile({
      file,
      url: blobUrl,
      name: file.name
    });
    setError(null);
    setLoading(true);
    setPageNumber(1);
    
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("Drop event triggered");
    
    try {
      const fieldData = JSON.parse(e.dataTransfer.getData("application/json"));
      console.log("Dropped field data:", fieldData);
      if (fieldData.fieldType && fieldData.fieldData) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          console.log("Drop position:", { x, y });
          
          addFieldToCanvas(fieldData.fieldData, { x, y });
          onFieldAdded?.(fieldData.fieldData, { x, y });
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const addFieldToCanvas = (field: FieldData, position: { x: number; y: number }) => {
    console.log("Adding field to canvas:", field, position);
    if (!fabricCanvas) {
      console.log("No fabric canvas available");
      return;
    }

    let fieldObject: any = null;

    const getFieldColor = (type: string) => {
      switch (type) {
        case "signature": return { fill: "rgba(139, 92, 246, 0.1)", stroke: "#8b5cf6" };
        case "name": return { fill: "rgba(34, 197, 94, 0.1)", stroke: "#22c55e" };
        case "email": return { fill: "rgba(239, 68, 68, 0.1)", stroke: "#ef4444" };
        case "date": return { fill: "rgba(59, 130, 246, 0.1)", stroke: "#3b82f6" };
        case "text": return { fill: "rgba(245, 158, 11, 0.1)", stroke: "#f59e0b" };
        default: return { fill: "rgba(107, 114, 128, 0.1)", stroke: "#6b7280" };
      }
    };

    const colors = getFieldColor(field.type);
    const width = field.type === "signature" ? 150 : field.type === "date" ? 100 : 120;
    const height = field.type === "signature" ? 50 : 30;

    console.log("Creating rect with dimensions:", { width, height, colors });

    fieldObject = new Rect({
      left: position.x,
      top: position.y,
      width: width,
      height: height,
      fill: colors.fill,
      stroke: colors.stroke,
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      hasControls: true,
      hasBorders: true,
      cornerColor: colors.stroke,
      cornerStyle: 'circle',
      cornerSize: 8,
      transparentCorners: false,
    });

    // Add label text
    const label = new Text(field.label, {
      left: position.x + 5,
      top: position.y + (height / 2) - 8,
      fontSize: 12,
      fill: colors.stroke,
      selectable: false,
      evented: false,
      pointerEvents: "none",
    });

    if (fieldObject) {
      // Add field type as custom property
      fieldObject.set('fieldType', field.type);
      fieldObject.set('fieldData', field);
      
      console.log("Adding objects to canvas");
      fabricCanvas.add(fieldObject);
      fabricCanvas.add(label);
      fabricCanvas.renderAll();
      console.log("Canvas rendered, objects count:", fabricCanvas.getObjects().length);
      
      // Update state
      setDroppedFields(prev => [...prev, { field, position }]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const saveCanvasState = () => {
    if (!fabricCanvas) return;
    
    const canvasObjects = fabricCanvas.getObjects().map(obj => ({
      fieldType: obj.get('fieldType'),
      fieldData: obj.get('fieldData'),
      position: { x: obj.left || 0, y: obj.top || 0 },
      dimensions: { width: obj.width || 0, height: obj.height || 0 }
    }));
    
    console.log("Canvas state saved:", canvasObjects);
    return canvasObjects;
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    
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
  useEffect(() => {
    return () => {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
    };
  }, [uploadedFile]);

  if (!currentFileUrl) {
    return (
      <div 
        className="flex flex-col items-center justify-center h-[400px] border rounded bg-gray-50 border-dashed"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center gap-4 p-6">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload PDF Document</h3>
            <p className="text-gray-500 text-sm mb-4">
              Select a PDF file to review and add signature fields, or drag fields here
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
    <div className="flex flex-col h-full">
      {/* File Info and Upload Controls */}
      {uploadedFile && (
        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">{uploadedFile.name}</span>
            <span className="text-xs text-green-600">• PDF loaded successfully</span>
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

      {/* PDF with Canvas Overlay */}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-auto border rounded bg-gray-50 min-h-[400px]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {loading && (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500">Loading PDF...</p>
          </div>
        )}
        
        {/* PDF Document */}
        <div className="relative">
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
          
          {/* Interactive Canvas Overlay */}
          {!loading && !error && (
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 pointer-events-auto"
              style={{ 
                width: `${800 * scale}px`, 
                height: `${1000 * scale}px`,
                zIndex: 10 
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};