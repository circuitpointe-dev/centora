
import React, { useState } from "react";
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
import { Pen, Type, Upload, X } from "lucide-react";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (signatureData: { type: string; data: string }) => void;
}

export const SignatureDialog = ({ open, onOpenChange, onSave }: SignatureDialogProps) => {
  const [activeTab, setActiveTab] = useState("draw");
  const [typedSignature, setTypedSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  const handleSave = () => {
    if (activeTab === "type" && typedSignature) {
      onSave({ type: "typed", data: typedSignature });
    } else if (activeTab === "draw") {
      onSave({ type: "drawn", data: "signature_drawn" });
    } else if (activeTab === "upload") {
      onSave({ type: "uploaded", data: "signature_uploaded" });
    }
    onOpenChange(false);
  };

  const handleCanvasMouseDown = () => {
    setIsDrawing(true);
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add your signature</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="draw" className="flex items-center gap-2">
              <Pen className="w-4 h-4" />
              Draw
            </TabsTrigger>
            <TabsTrigger value="type" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Type
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Signature
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-gray-500">
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[200px] relative">
              <canvas
                className="w-full h-[180px] bg-white border border-gray-300 rounded cursor-crosshair"
                onMouseDown={handleCanvasMouseDown}
                onMouseUp={handleCanvasMouseUp}
              />
              <div className="absolute bottom-2 left-2 text-xs text-gray-500">
                X
              </div>
            </div>
          </TabsContent>

          <TabsContent value="type" className="space-y-4">
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

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop your signature image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG up to 10MB
              </p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              No saved signatures
            </div>
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
            className="bg-gray-600 text-white hover:bg-gray-700"
            disabled={activeTab === "type" && !typedSignature}
          >
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
