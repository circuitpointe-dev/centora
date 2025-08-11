import React, { useState, useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { FileUploadArea } from "./FileUploadArea";
import { PDFViewer } from "./PDFViewer";
import { CanvasOverlay, CanvasOverlayRef } from "./CanvasOverlay";
import { PDFControls } from "./PDFControls";

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
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const canvasRef = useRef<CanvasOverlayRef>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [overlaySize, setOverlaySize] = useState<{ width: number; height: number }>({ width: 800, height: 1000 });

  const currentFileUrl = uploadedFile?.url || fileUrl;

  const handleFileUpload = useCallback((file: File) => {
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
         const containerEl = pageContainerRef.current;
         const rect = (containerEl || e.currentTarget).getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;
        console.log("Drop position:", { x, y });
        
        // Use the canvas ref to add field to canvas
        if (canvasRef.current) {
          canvasRef.current.addFieldToCanvas(fieldData.fieldData, { x, y });
        }
        onFieldAdded?.(fieldData.fieldData, { x, y });
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleCanvasReady = (canvas: FabricCanvas) => {
    setFabricCanvas(canvas);
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

  useEffect(() => {
    if (loading) return;
    const container = pageContainerRef.current;
    if (!container) return;
    const pdfCanvas = container.querySelector('canvas') as HTMLCanvasElement | null;
    if (pdfCanvas) {
      const rect = pdfCanvas.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width && height) {
        setOverlaySize({ width, height });
      }
    }
  }, [loading, scale, pageNumber, currentFileUrl]);

  // Export canvas state for external access
  const saveCanvasState = () => {
    if (!fabricCanvas) return null;
    
    const canvasObjects = fabricCanvas.getObjects().map(obj => ({
      fieldType: obj.get('fieldType'),
      fieldData: obj.get('fieldData'),
      position: { x: obj.left || 0, y: obj.top || 0 },
      dimensions: { width: obj.width || 0, height: obj.height || 0 }
    }));
    
    console.log("Canvas state saved:", canvasObjects);
    return canvasObjects;
  };

  (window as any).saveCanvasState = saveCanvasState;

  if (!currentFileUrl) {
    return (
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FileUploadArea
          uploadedFile={uploadedFile}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          error={error}
        />
      </div>
    );
  }

  if (error) {
    return (
      <FileUploadArea
        uploadedFile={uploadedFile}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        error={error}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Only show file upload if no file is provided */}
      {!currentFileUrl && (
        <FileUploadArea
          uploadedFile={uploadedFile}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          error={error}
        />
      )}

      {currentFileUrl && (
        <>
          <PDFControls
            pageNumber={pageNumber}
            numPages={numPages}
            scale={scale}
            loading={loading}
            onPageChange={setPageNumber}
            onScaleChange={setScale}
          />

          <div 
            className="relative flex-1 overflow-auto border rounded bg-gray-50 min-h-[400px]"
          >
            {loading && (
              <div className="flex items-center justify-center h-[400px]">
                <p className="text-gray-500">Loading PDF...</p>
              </div>
            )}
            
            <div className="relative" ref={pageContainerRef} onDrop={handleDrop} onDragOver={handleDragOver}>
              <PDFViewer
                fileUrl={currentFileUrl}
                pageNumber={pageNumber}
                scale={scale}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={loading}
                error={error}
              />
              
              {!loading && !error && (
                <CanvasOverlay
                  ref={canvasRef}
                  scale={scale}
                  width={overlaySize.width}
                  height={overlaySize.height}
                  onFieldAdded={onFieldAdded}
                  onCanvasReady={handleCanvasReady}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};