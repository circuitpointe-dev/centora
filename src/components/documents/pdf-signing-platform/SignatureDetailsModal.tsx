import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenTool, Type, Building, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (signatureData: any) => void;
  initialData?: {
    fullName?: string;
    initials?: string;
  };
}

const SignatureDetailsModal: React.FC<SignatureDetailsModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialData
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [initials, setInitials] = useState(initialData?.initials || '');
  const [activeTab, setActiveTab] = useState('signature');
  const [selectedSignatureStyle, setSelectedSignatureStyle] = useState(0);
  const [selectedInitialStyle, setSelectedInitialStyle] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [drawnInitials, setDrawnInitials] = useState<string | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [uploadedStamp, setUploadedStamp] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  // Signature styles based on name
  const generateSignatureStyles = (name: string) => {
    if (!name) return [];
    return [
      { style: 'cursive', text: name, font: 'Brush Script MT, cursive' },
      { style: 'elegant', text: name, font: 'Dancing Script, cursive' },
      { style: 'modern', text: name, font: 'Caveat, cursive' },
      { style: 'classic', text: name, font: 'Great Vibes, cursive' }
    ];
  };

  // Initial styles based on initials
  const generateInitialStyles = (initials: string) => {
    if (!initials) return [];
    return [
      { style: 'cursive', text: initials, font: 'Brush Script MT, cursive' },
      { style: 'elegant', text: initials, font: 'Dancing Script, cursive' },
      { style: 'modern', text: initials, font: 'Caveat, cursive' },
      { style: 'block', text: initials, font: 'Arial Black, sans-serif' }
    ];
  };

  const signatureStyles = generateSignatureStyles(fullName);
  const initialStyles = generateInitialStyles(initials);

  // Canvas drawing functionality
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    if (activeTab === 'signature') {
      setDrawnSignature(dataURL);
    } else if (activeTab === 'initials') {
      setDrawnInitials(dataURL);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (activeTab === 'signature') {
      setDrawnSignature(null);
    } else if (activeTab === 'initials') {
      setDrawnInitials(null);
    }
  };

  // File upload handlers
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedSignature(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedStamp(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    const signatureData = {
      fullName,
      initials,
      selectedSignature: activeTab === 'signature' 
        ? (drawnSignature || (signatureStyles[selectedSignatureStyle] ? {
            text: fullName,
            font: signatureStyles[selectedSignatureStyle].font,
            style: signatureStyles[selectedSignatureStyle].style
          } : null) || uploadedSignature)
        : null,
      selectedInitials: activeTab === 'initials'
        ? (drawnInitials || (initialStyles[selectedInitialStyle] ? {
            text: initials,
            font: initialStyles[selectedInitialStyle].font,
            style: initialStyles[selectedInitialStyle].style
          } : null))
        : null,
      companyStamp: activeTab === 'company-stamp' ? uploadedStamp : null
    };
    
    onApply(signatureData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="px-4 py-3 border-b sm:px-6 sm:py-4">
          <DialogTitle className="text-lg font-semibold sm:text-xl">Set your signature details</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full max-h-[calc(85vh-120px)]">
          {/* Name and Initials Inputs */}
          <div className="px-4 py-3 border-b bg-gray-50 sm:px-6 sm:py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                  Full name: <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="initials" className="text-sm font-medium mb-2 block">
                  Initials:
                </Label>
                <Input
                  id="initials"
                  value={initials}
                  onChange={(e) => setInitials(e.target.value)}
                  placeholder="Enter your initials"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Tools - Hidden on mobile */}
            <div className="hidden sm:flex w-14 border-r bg-gray-50 flex-col items-center py-4 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 w-8 h-8"
                title="Text"
              >
                <Type className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 w-8 h-8"
                onClick={() => setIsDrawing(true)}
                title="Draw"
              >
                <PenTool className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 w-8 h-8"
                onClick={() => {
                  if (activeTab === 'signature') {
                    fileInputRef.current?.click();
                  } else if (activeTab === 'company-stamp') {
                    stampInputRef.current?.click();
                  }
                }}
                title="Upload"
              >
                <Upload className="w-3 h-3" />
              </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="border-b rounded-none w-full justify-start bg-transparent p-0 overflow-x-auto">
                  <TabsTrigger 
                    value="signature" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm whitespace-nowrap"
                  >
                    <PenTool className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
                    Signature
                  </TabsTrigger>
                  <TabsTrigger 
                    value="initials"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm whitespace-nowrap"
                  >
                    <Type className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
                    Initials
                  </TabsTrigger>
                  <TabsTrigger 
                    value="company-stamp"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm whitespace-nowrap"
                  >
                    <Building className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
                    Company Stamp
                  </TabsTrigger>
                </TabsList>

                <div className="p-3 sm:p-6 h-full overflow-y-auto">
                  <TabsContent value="signature" className="mt-0 h-full">
                    {fullName ? (
                      <div className="space-y-4">
                        {/* Signature Styles */}
                        <div className="space-y-3">
                          {signatureStyles.map((style, index) => (
                            <div
                              key={index}
                              className={cn(
                                "border rounded-lg p-4 cursor-pointer transition-all",
                                selectedSignatureStyle === index
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                              onClick={() => setSelectedSignatureStyle(index)}
                            >
                              <div className="flex items-center">
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2 mr-3",
                                  selectedSignatureStyle === index
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300"
                                )}>
                                  {selectedSignatureStyle === index && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                                <div
                                  className="text-2xl"
                                  style={{ fontFamily: style.font }}
                                >
                                  {style.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Drawing Area */}
                        <div className="border rounded-lg p-4">
                          <div className="text-center text-gray-500 mb-2">Draw your signature here</div>
                          <canvas
                            ref={canvasRef}
                            width={300}
                            height={120}
                            className="border border-gray-300 w-full max-w-sm cursor-crosshair mx-auto"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                          />
                          <div className="flex justify-between mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearCanvas}
                            >
                              Clear
                            </Button>
                            <a
                              href="#"
                              className="text-red-500 text-sm hover:underline"
                            >
                              Draw from your mobile device
                            </a>
                          </div>
                        </div>

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="mb-2"
                          >
                            Upload signature
                          </Button>
                          <p className="text-gray-500 text-sm">or drop file here</p>
                          <p className="text-xs text-gray-400 mt-1">Accepted formats: PNG, JPG and SVG</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 mt-20">
                        Please enter your full name to see signature options
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="initials" className="mt-0 h-full">
                    {initials ? (
                      <div className="space-y-4">
                        {/* Initial Styles */}
                        <div className="space-y-3">
                          {initialStyles.map((style, index) => (
                            <div
                              key={index}
                              className={cn(
                                "border rounded-lg p-4 cursor-pointer transition-all",
                                selectedInitialStyle === index
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
                              )}
                              onClick={() => setSelectedInitialStyle(index)}
                            >
                              <div className="flex items-center">
                                <div className={cn(
                                  "w-4 h-4 rounded-full border-2 mr-3",
                                  selectedInitialStyle === index
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300"
                                )}>
                                  {selectedInitialStyle === index && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                                <div
                                  className="text-2xl"
                                  style={{ fontFamily: style.font }}
                                >
                                  {style.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Drawing Area for Initials */}
                        <div className="border rounded-lg p-4">
                          <div className="text-center text-gray-500 mb-2">Draw your initials here</div>
                          <canvas
                            ref={canvasRef}
                            width={300}
                            height={120}
                            className="border border-gray-300 w-full max-w-sm cursor-crosshair mx-auto"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                          />
                          <div className="flex justify-between mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearCanvas}
                            >
                              Clear
                            </Button>
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <div className="w-6 h-6 bg-gray-800 rounded-full cursor-pointer"></div>
                            <div className="w-6 h-6 bg-red-500 rounded-full cursor-pointer"></div>
                            <div className="w-6 h-6 bg-blue-500 rounded-full cursor-pointer"></div>
                            <div className="w-6 h-6 bg-green-500 rounded-full cursor-pointer"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 mt-20">
                        Please enter your initials to see initial options
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="company-stamp" className="mt-0 h-full">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Button
                        variant="outline"
                        onClick={() => stampInputRef.current?.click()}
                        className="mb-2"
                      >
                        Upload company stamp
                      </Button>
                      <p className="text-gray-500 text-sm">or drop file here</p>
                      <p className="text-xs text-gray-400 mt-1">Accepted formats: PNG, JPG and SVG</p>
                      
                      {uploadedStamp && (
                        <div className="mt-4">
                          <img src={uploadedStamp} alt="Company Stamp" className="max-h-32 mx-auto" />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="px-4 py-3 border-t bg-gray-50 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-3 sm:px-6 sm:py-4">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={handleSignatureUpload}
          className="hidden"
        />
        <input
          ref={stampInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={handleStampUpload}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDetailsModal;