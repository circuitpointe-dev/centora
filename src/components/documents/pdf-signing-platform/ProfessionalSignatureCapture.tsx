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
    EyeOff,
    Sparkles,
    Zap,
    Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureData {
    type: 'draw' | 'type' | 'upload';
    data: string;
    width?: number;
    height?: number;
    font?: string;
    color?: string;
    size?: number;
}

interface ProfessionalSignatureCaptureProps {
    onSave: (signature: SignatureData) => void;
    onCancel: () => void;
    initialSignature?: SignatureData;
    fieldLabel?: string;
}

const ProfessionalSignatureCapture: React.FC<ProfessionalSignatureCaptureProps> = ({
    onSave,
    onCancel,
    initialSignature,
    fieldLabel = 'Signature'
}) => {
    const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
    const [typedSignature, setTypedSignature] = useState('');
    const [signatureFont, setSignatureFont] = useState('Dancing Script');
    const [signatureColor, setSignatureColor] = useState('#000000');
    const [signatureSize, setSignatureSize] = useState(32);
    const [isDrawing, setIsDrawing] = useState(false);
    const [strokeColor, setStrokeColor] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [signatureStyle, setSignatureStyle] = useState<'elegant' | 'modern' | 'classic' | 'casual'>('elegant');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Professional signature fonts
    const professionalFonts = [
        { name: 'Dancing Script', category: 'Elegant', premium: false },
        { name: 'Great Vibes', category: 'Elegant', premium: false },
        { name: 'Allura', category: 'Elegant', premium: true },
        { name: 'Alex Brush', category: 'Elegant', premium: false },
        { name: 'Pacifico', category: 'Modern', premium: false },
        { name: 'Satisfy', category: 'Casual', premium: false },
        { name: 'Kalam', category: 'Modern', premium: false },
        { name: 'Caveat', category: 'Classic', premium: false },
        { name: 'Indie Flower', category: 'Casual', premium: false },
        { name: 'Permanent Marker', category: 'Modern', premium: false },
        { name: 'Amatic SC', category: 'Classic', premium: true },
        { name: 'Cedarville Cursive', category: 'Elegant', premium: true },
        { name: 'Kaushan Script', category: 'Modern', premium: true },
        { name: 'Lobster', category: 'Elegant', premium: true },
        { name: 'Righteous', category: 'Modern', premium: true }
    ];

    const signatureStyles = {
        elegant: { color: '#2D3748', size: 36, font: 'Great Vibes' },
        modern: { color: '#1A365D', size: 32, font: 'Pacifico' },
        classic: { color: '#4A5568', size: 30, font: 'Caveat' },
        casual: { color: '#2B6CB0', size: 28, font: 'Kalam' }
    };

    const colors = [
        '#000000', '#1A365D', '#2D3748', '#4A5568', '#718096',
        '#E53E3E', '#C53030', '#9C4221', '#DD6B20', '#D69E2E',
        '#38A169', '#2F855A', '#276749', '#319795', '#2C7A7B',
        '#3182CE', '#2B6CB0', '#2A69AC', '#553C9A', '#805AD5',
        '#D53F8C', '#B83280', '#97266D', '#702459', '#553C9A'
    ];

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 500;
        canvas.height = 200;

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

        canvas.width = 500;
        canvas.height = 150;

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

    const applySignatureStyle = (style: keyof typeof signatureStyles) => {
        const styleConfig = signatureStyles[style];
        setSignatureFont(styleConfig.font);
        setSignatureColor(styleConfig.color);
        setSignatureSize(styleConfig.size);
        setSignatureStyle(style);
    };

    const getCurrentSignature = useCallback((): SignatureData | null => {
        switch (activeTab) {
            case 'draw': {
                const canvas = canvasRef.current;
                if (!canvas) return null;
                return {
                    type: 'draw',
                    data: canvas.toDataURL(),
                    width: canvas.width,
                    height: canvas.height,
                    color: strokeColor
                };
            }
            case 'type': {
                const dataUrl = generateTypedSignature();
                if (!dataUrl) return null;
                return {
                    type: 'type',
                    data: dataUrl,
                    width: 500,
                    height: 150,
                    font: signatureFont,
                    color: signatureColor,
                    size: signatureSize
                };
            }
            case 'upload': {
                if (!uploadedImage) return null;
                return {
                    type: 'upload',
                    data: uploadedImage,
                    width: 500,
                    height: 200
                };
            }
            default:
                return null;
        }
    }, [activeTab, generateTypedSignature, uploadedImage, strokeColor, signatureFont, signatureColor, signatureSize]);

    const handleSave = useCallback(() => {
        const signature = getCurrentSignature();
        if (signature) {
            onSave(signature);
        }
    }, [getCurrentSignature, onSave]);

    const currentSignature = getCurrentSignature();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div>
                        <CardTitle className="text-xl">Professional Signature Creator</CardTitle>
                        <p className="text-blue-100 text-sm mt-1">Create a signature that reflects your professional style</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/20">
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                        <TabsList className="grid w-full grid-cols-3 m-6">
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

                        <TabsContent value="draw" className="p-6 space-y-6">
                            {/* Signature Styles */}
                            <div>
                                <Label className="text-sm font-medium mb-3 block">Signature Style</Label>
                                <div className="grid grid-cols-4 gap-3">
                                    {Object.entries(signatureStyles).map(([style, config]) => (
                                        <button
                                            key={style}
                                            onClick={() => applySignatureStyle(style as keyof typeof signatureStyles)}
                                            className={cn(
                                                "p-3 rounded-lg border-2 text-left transition-all",
                                                signatureStyle === style
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <div className="text-sm font-medium capitalize">{style}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {config.font} • {config.size}px
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Drawing Tools */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="stroke-color">Color:</Label>
                                        <div className="flex space-x-1">
                                            {colors.slice(0, 12).map((color) => (
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
                                            max="15"
                                            value={strokeWidth}
                                            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                                            className="w-24"
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

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <canvas
                                    ref={canvasRef}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    className="border border-gray-200 rounded cursor-crosshair bg-white w-full"
                                    style={{ touchAction: 'none', height: '200px' }}
                                />
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                Draw your signature above using your mouse or touchpad
                            </div>
                        </TabsContent>

                        <TabsContent value="type" className="p-6 space-y-6">
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="typed-signature">Type your signature:</Label>
                                    <Input
                                        id="typed-signature"
                                        value={typedSignature}
                                        onChange={(e) => setTypedSignature(e.target.value)}
                                        placeholder="Enter your name"
                                        className="mt-1 text-lg"
                                    />
                                </div>

                                {/* Professional Font Selection */}
                                <div>
                                    <Label className="text-sm font-medium mb-3 block">Professional Fonts</Label>
                                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                                        {professionalFonts.map((font) => (
                                            <button
                                                key={font.name}
                                                onClick={() => setSignatureFont(font.name)}
                                                className={cn(
                                                    "p-3 rounded-lg border text-left transition-all",
                                                    signatureFont === font.name
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-sm" style={{ fontFamily: font.name }}>
                                                            {font.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{font.category}</div>
                                                    </div>
                                                    {font.premium && (
                                                        <Star className="w-4 h-4 text-yellow-500" />
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="signature-size">Size: {signatureSize}px</Label>
                                        <input
                                            type="range"
                                            min="16"
                                            max="64"
                                            value={signatureSize}
                                            onChange={(e) => setSignatureSize(parseInt(e.target.value))}
                                            className="w-full mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Color</Label>
                                        <div className="flex space-x-1 flex-wrap">
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
                                </div>

                                {typedSignature && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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

                        <TabsContent value="upload" className="p-6 space-y-6">
                            <div className="space-y-6">
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
                                            className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400"
                                        >
                                            <div className="text-center">
                                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                <div className="text-sm font-medium">Choose Image</div>
                                                <div className="text-xs text-gray-500">PNG, JPG, SVG supported</div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                {uploadedImage && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded signature"
                                            className="max-w-full max-h-40 mx-auto"
                                        />
                                    </div>
                                )}

                                <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                                    <strong>Pro Tip:</strong> For best results, use a high-resolution image (400x150px or larger) with a transparent background.
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Preview and Actions */}
                    <div className="border-t p-6 bg-gray-50">
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
                            <div className="mb-4 p-4 bg-white rounded-lg border">
                                <div className="text-sm font-medium mb-2">Professional Preview:</div>
                                <div className="border border-gray-200 rounded p-4 bg-white inline-block">
                                    <img
                                        src={currentSignature.data}
                                        alt="Signature preview"
                                        className="max-h-20"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!currentSignature}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Save Professional Signature
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfessionalSignatureCapture;
