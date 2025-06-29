
import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pen, Type, Upload } from "lucide-react";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (signatureData: { type: string; data: string }) => void;
}

export const SignatureDialog = ({ open, onOpenChange, onSave }: SignatureDialogProps) => {
  const [activeTab, setActiveTab] = useState("draw");
  const [typedSignature, setTypedSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = 180;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
  }, [open]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const startDrawing = (point: { x: number; y: number }) => {
    setIsDrawing(true);
    setLastPoint(point);
  };

  const draw = (currentPoint: { x: number; y: number }) => {
    if (!isDrawing || !lastPoint || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    
    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getMousePos(e);
    startDrawing(point);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDrawing) {
      const point = getMousePos(e);
      draw(point);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getTouchPos(e);
    startDrawing(point);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDrawing) {
      const point = getTouchPos(e);
      draw(point);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setUploadedFile(file);
    }
  };

  const handleSave = () => {
    if (activeTab === "type" && typedSignature) {
      onSave({ type: "typed", data: typedSignature });
    } else if (activeTab === "draw" && canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL();
      onSave({ type: "drawn", data: dataURL });
    } else if (activeTab === "upload" && uploadedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        onSave({ type: "uploaded", data: reader.result as string });
      };
      reader.readAsDataURL(uploadedFile);
      return;
    }
    onOpenChange(false);
  };

  const canSave = () => {
    if (activeTab === "type") return typedSignature.trim() !== "";
    if (activeTab === "draw") return true; // Allow saving even empty canvas
    if (activeTab === "upload") return uploadedFile !== null;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add your signature</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto border-b border-gray-200">
            <TabsTrigger 
              value="draw" 
              className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 rounded-none bg-transparent shadow-none px-4 py-3"
            >
              <Pen className="w-4 h-4" />
              Draw
            </TabsTrigger>
            <TabsTrigger 
              value="type" 
              className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 rounded-none bg-transparent shadow-none px-4 py-3"
            >
              <Type className="w-4 h-4" />
              Type
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="flex items-center gap-2 border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 rounded-none bg-transparent shadow-none px-4 py-3"
            >
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4 mt-6">
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[200px] relative">
              <canvas
                ref={canvasRef}
                className="w-full h-[180px] bg-white border border-gray-300 rounded cursor-crosshair touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-2 right-2 h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                onClick={clearCanvas}
              >
                Clear
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="type" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="signature-text">Type your signature</Label>
              <Input
                id="signature-text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Enter your signature"
                className="text-2xl font-script"
                style={{ fontFamily: 'cursive' }}
              />
            </div>
            {typedSignature && (
              <div className="border border-gray-200 rounded p-4 bg-gray-50">
                <div className="text-2xl" style={{ fontFamily: 'cursive' }}>
                  {typedSignature}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileUpload}
                className="hidden"
                id="signature-upload"
              />
              <label htmlFor="signature-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload your signature image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </label>
            </div>
            {uploadedFile && (
              <div className="text-sm text-gray-600">
                Selected: {uploadedFile.name}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-xs text-gray-600 mt-4">
          I understand this is a legal representation of my signature.
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-violet-600 text-white hover:bg-violet-700"
            disabled={!canSave()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
