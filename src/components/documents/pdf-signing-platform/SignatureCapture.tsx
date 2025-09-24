import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    PenTool,
    Type,
    Upload,
    RotateCw,
    Download,
    Save,
    X,
    Palette,
    Eraser,
    Undo,
    Redo,
    Check,
    Eye,
    EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureData {
    type: 'draw' | 'type' | 'upload';
    data: string;
    width?: number;
    height?: number;
}

interface SignatureCaptureProps {
    onSave: (signature: SignatureData) => void;
    onCancel: () => void;
    initialSignature?: SignatureData;
    fieldLabel?: string;
}

const SignatureCapture: React.FC<SignatureCaptureProps> = ({
    onSave,
    onCancel,
    initialSignature,
    fieldLabel = 'Signature'
}) => {
    const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
    const [typedSignature, setTypedSignature] = useState('');
    const [signatureFont, setSignatureFont] = useState('Dancing Script');
    const [signatureColor, setSignatureColor] = useState('#000000');
    const [signatureSize, setSignatureSize] = useState(24);
    const [isDrawing, setIsDrawing] = useState(false);
    const [strokeColor, setStrokeColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fonts = [
        'Dancing Script',
        'Great Vibes',
        'Allura',
        'Alex Brush',
        'Pacifico',
        'Satisfy',
        'Kalam',
        'Caveat',
        'Indie Flower',
        'Permanent Marker'
    ];

    const colors = [
        '#000000', '#333333', '#666666', '#999999',
        '#0000FF', '#0066CC', '#0099FF', '#00CCFF',
        '#FF0000', '#CC0000', '#FF3333', '#FF6666',
        '#00FF00', '#00CC00', '#33FF33', '#66FF66',
        '#FF00FF', '#CC00CC', '#FF33FF', '#FF66FF'
    ];

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 400;
        canvas.height = 150;

        // Set default styles
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Load initial signature if provided
        if (initialSignature && initialSignature.type === 'draw') {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = initialSignature.data;
        }
    }, [initialSignature, strokeColor, strokeWidth]);

    const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(x, y);
    }, []);

    const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(x, y);
        ctx.stroke();
    }, [isDrawing]);

    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
    }, []);

    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, []);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setUploadedImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const generateTypedSignature = useCallback(() => {
        if (!typedSignature.trim()) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        canvas.width = 400;
        canvas.height = 100;

        ctx.font = `${signatureSize}px ${signatureFont}`;
        ctx.fillStyle = signatureColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const textWidth = ctx.measureText(typedSignature).width;
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height / 2;

        ctx.fillText(typedSignature, x, y);

        return canvas.toDataURL();
    }, [typedSignature, signatureFont, signatureColor, signatureSize]);

    const getCurrentSignature = useCallback((): SignatureData | null => {
        switch (activeTab) {
            case 'draw': {
                const canvas = canvasRef.current;
                if (!canvas) return null;
                return {
                    type: 'draw',
                    data: canvas.toDataURL(),
                    width: canvas.width,
                    height: canvas.height
                };
            }
            case 'type': {
                const dataUrl = generateTypedSignature();
                if (!dataUrl) return null;
                return {
                    type: 'type',
                    data: dataUrl,
                    width: 400,
                    height: 100
                };
            }
            case 'upload': {
                if (!uploadedImage) return null;
                return {
                    type: 'upload',
                    data: uploadedImage,
                    width: 400,
                    height: 150
                };
            }
            default:
                return null;
        }
    }, [activeTab, generateTypedSignature, uploadedImage]);

    const handleSave = useCallback(() => {
        const signature = getCurrentSignature();
        if (signature) {
            onSave(signature);
        }
    }, [getCurrentSignature, onSave]);

    const currentSignature = getCurrentSignature();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Create {fieldLabel}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                        <TabsList className="grid w-full grid-cols-3 m-4">
                            <TabsTrigger value="draw" className="flex items-center space-x-2">
                                <PenTool className="w-4 h-4" />
                                <span>Draw</span>
                            </TabsTrigger>
                            <TabsTrigger value="type" className="flex items-center space-x-2">
                                <Type className="w-4 h-4" />
                                <span>Type</span>
                            </TabsTrigger>
                            <TabsTrigger value="upload" className="flex items-center space-x-2">
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="draw" className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="stroke-color">Color:</Label>
                                        <div className="flex space-x-1">
                                            {colors.slice(0, 8).map((color) => (
                                                <button
                                                    key={color}
                                                    className={cn(
                                                        "w-6 h-6 rounded border-2",
                                                        strokeColor === color ? "border-gray-800" : "border-gray-300"
                                                    )}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setStrokeColor(color)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="stroke-width">Width:</Label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={strokeWidth}
                                            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                                            className="w-20"
                                        />
                                        <span className="text-sm w-6">{strokeWidth}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={clearCanvas}>
                                        <Eraser className="w-4 h-4 mr-2" />
                                        Clear
                                    </Button>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    className="border border-gray-200 rounded cursor-crosshair bg-white"
                                    style={{ touchAction: 'none' }}
                                />
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                Draw your signature above using your mouse or touchpad
                            </div>
                        </TabsContent>

                        <TabsContent value="type" className="p-4 space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="typed-signature">Type your signature:</Label>
                                    <Input
                                        id="typed-signature"
                                        value={typedSignature}
                                        onChange={(e) => setTypedSignature(e.target.value)}
                                        placeholder="Enter your name"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="signature-font">Font:</Label>
                                        <select
                                            id="signature-font"
                                            value={signatureFont}
                                            onChange={(e) => setSignatureFont(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md mt-1"
                                        >
                                            {fonts.map((font) => (
                                                <option key={font} value={font} style={{ fontFamily: font }}>
                                                    {font}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="signature-size">Size:</Label>
                                        <input
                                            type="range"
                                            min="16"
                                            max="48"
                                            value={signatureSize}
                                            onChange={(e) => setSignatureSize(parseInt(e.target.value))}
                                            className="w-full mt-1"
                                        />
                                        <div className="text-sm text-gray-500 text-center">{signatureSize}px</div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="signature-color">Color:</Label>
                                    <div className="flex space-x-1 mt-1">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                className={cn(
                                                    "w-8 h-8 rounded border-2",
                                                    signatureColor === color ? "border-gray-800" : "border-gray-300"
                                                )}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setSignatureColor(color)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {typedSignature && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <div
                                            className="text-center"
                                            style={{
                                                fontFamily: signatureFont,
                                                fontSize: `${signatureSize}px`,
                                                color: signatureColor
                                            }}
                                        >
                                            {typedSignature}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="upload" className="p-4 space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="signature-upload">Upload signature image:</Label>
                                    <div className="mt-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Choose Image
                                        </Button>
                                    </div>
                                </div>

                                {uploadedImage && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded signature"
                                            className="max-w-full max-h-32 mx-auto"
                                        />
                                    </div>
                                )}

                                <div className="text-sm text-gray-500">
                                    Supported formats: PNG, JPG, SVG. Recommended size: 400x150px
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Preview and Actions */}
                    <div className="border-t p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPreview(!showPreview)}
                                >
                                    {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    {showPreview ? 'Hide' : 'Show'} Preview
                                </Button>
                            </div>
                        </div>

                        {showPreview && currentSignature && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm font-medium mb-2">Preview:</div>
                                <div className="border border-gray-200 rounded p-2 bg-white inline-block">
                                    <img
                                        src={currentSignature.data}
                                        alt="Signature preview"
                                        className="max-h-20"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!currentSignature}
                                className="bg-violet-600 hover:bg-violet-700"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Save Signature
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignatureCapture;
