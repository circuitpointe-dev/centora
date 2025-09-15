import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Pen, Type, Upload, Calendar as CalendarIcon, User, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { FieldData, FieldType } from '../EditorNewPage';

interface SigningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: FieldData | null;
  onSave: (value: any) => void;
}

export const SigningDialog: React.FC<SigningDialogProps> = ({
  open,
  onOpenChange,
  field,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("draw");
  const [textValue, setTextValue] = useState("");
  const [dateValue, setDateValue] = useState<Date | undefined>();
  const [typedSignature, setTypedSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawingOnCanvas, setIsDrawingOnCanvas] = useState(false);

  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 400;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
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

  const startDrawing = (x: number, y: number) => {
    setIsDrawingOnCanvas(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (x: number, y: number) => {
    if (!isDrawingOnCanvas) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawingOnCanvas(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
    }
  };

  const handleSave = () => {
    if (!field) return;

    let value: any = null;

    switch (field.type) {
      case 'signature':
        if (activeTab === 'draw') {
          const canvas = canvasRef.current;
          if (canvas) {
            value = { type: 'draw', data: canvas.toDataURL() };
          }
        } else if (activeTab === 'type') {
          if (typedSignature.trim()) {
            value = { type: 'type', data: typedSignature };
          }
        } else if (activeTab === 'upload') {
          if (uploadedFile) {
            value = { type: 'upload', data: URL.createObjectURL(uploadedFile) };
          }
        }
        break;
      case 'name':
      case 'email':
      case 'text':
        value = textValue.trim();
        break;
      case 'date':
        value = dateValue;
        break;
    }

    if (value) {
      onSave(value);
      onOpenChange(false);
      toast.success(`${field.type} saved successfully`);
      // Reset form
      setTextValue("");
      setDateValue(undefined);
      setTypedSignature("");
      setUploadedFile(null);
      clearCanvas();
    } else {
      toast.error("Please provide a value");
    }
  };

  const canSave = () => {
    if (!field) return false;
    
    switch (field.type) {
      case 'signature':
        return (activeTab === 'type' && typedSignature.trim()) || 
               (activeTab === 'upload' && uploadedFile) ||
               (activeTab === 'draw');
      case 'name':
      case 'email':
      case 'text':
        return textValue.trim().length > 0;
      case 'date':
        return !!dateValue;
      default:
        return false;
    }
  };

  const getFieldIcon = () => {
    switch (field?.type) {
      case 'signature':
        return <Pen className="h-5 w-5" />;
      case 'name':
        return <User className="h-5 w-5" />;
      case 'date':
        return <CalendarIcon className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      default:
        return <Type className="h-5 w-5" />;
    }
  };

  if (!field) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border-none shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            {getFieldIcon()}
            {field.type === 'signature' ? 'Add Signature' : `Enter ${field.label}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {field.type === 'signature' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="draw" className="text-xs">Draw</TabsTrigger>
                <TabsTrigger value="type" className="text-xs">Type</TabsTrigger>
                <TabsTrigger value="upload" className="text-xs">Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="draw" className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Draw your signature</Label>
                  <div className="border rounded-sm bg-gray-50">
                    <canvas
                      ref={canvasRef}
                      className="w-full cursor-crosshair"
                      style={{ height: '150px' }}
                      onMouseDown={(e) => {
                        const pos = getMousePos(e);
                        startDrawing(pos.x, pos.y);
                      }}
                      onMouseMove={(e) => {
                        const pos = getMousePos(e);
                        draw(pos.x, pos.y);
                      }}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        const pos = getTouchPos(e);
                        startDrawing(pos.x, pos.y);
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        const pos = getTouchPos(e);
                        draw(pos.x, pos.y);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        stopDrawing();
                      }}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    Clear
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="type" className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Type your signature</Label>
                  <Input
                    placeholder="Enter your full name"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    className="font-serif text-lg"
                  />
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm">Upload signature image</Label>
                  <div className="border border-dashed rounded-sm p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="signature-upload"
                    />
                    <label
                      htmlFor="signature-upload"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-700"
                    >
                      Click to upload image
                    </label>
                    {uploadedFile && (
                      <p className="text-xs text-green-600 mt-2">{uploadedFile.name}</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : field.type === 'date' ? (
            <div className="space-y-2">
              <Label className="text-sm">Select date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateValue ? format(dateValue, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={setDateValue}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm">
                {field.type === 'name' && 'Enter your full name'}
                {field.type === 'email' && 'Enter your email address'}
                {field.type === 'text' && `Enter ${field.label}`}
              </Label>
              <Input
                type={field.type === 'email' ? 'email' : 'text'}
                placeholder={
                  field.type === 'name' ? 'John Doe' :
                  field.type === 'email' ? 'john@example.com' :
                  'Enter text'
                }
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave()}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};