import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Canvas as FabricCanvas, Rect, Text } from "fabric";

interface FieldData {
  id: string;
  type: "signature" | "name" | "date" | "email" | "text";
  label: string;
  value?: any;
  isConfigured: boolean;
}

interface CanvasOverlayProps {
  scale: number;
  width: number;
  height: number;
  onFieldAdded?: (field: FieldData, position: { x: number; y: number }) => void;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  offsetLeft?: number;
  offsetTop?: number;
}

export interface CanvasOverlayRef {
  addFieldToCanvas: (field: FieldData, position: { x: number; y: number }) => void;
}

export const CanvasOverlay = forwardRef<CanvasOverlayRef, CanvasOverlayProps>(({ 
  scale,
  width,
  height,
  onFieldAdded,
  onCanvasReady,
  offsetLeft = 0,
  offsetTop = 0
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const onCanvasReadyRef = useRef(onCanvasReady);
  useEffect(() => {
    onCanvasReadyRef.current = onCanvasReady;
  }, [onCanvasReady]);

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: 1,
        height: 1,
        backgroundColor: "transparent",
        selection: true,
      });

      console.log("Fabric canvas initialized:", canvas);
      setFabricCanvas(canvas);
      onCanvasReadyRef.current?.(canvas);

      return () => {
        try {
          canvas.dispose();
        } catch (error) {
          console.warn("Error disposing canvas:", error);
        }
      };
    } catch (error) {
      console.error("Error initializing Fabric canvas:", error);
    }
  }, []);

  // Update canvas dimensions and zoom when size or scale changes
  useEffect(() => {
    if (!fabricCanvas) return;

    try {
      const baseWidth = Math.max(1, Math.floor(width / Math.max(scale, 0.0001)));
      const baseHeight = Math.max(1, Math.floor(height / Math.max(scale, 0.0001)));
      fabricCanvas.setDimensions({ width: baseWidth, height: baseHeight });
      fabricCanvas.setZoom(scale);
      fabricCanvas.renderAll();
    } catch (error) {
      console.warn("Error updating canvas dimensions/scale:", error);
    }
  }, [fabricCanvas, width, height, scale]);

  const addFieldToCanvas = (field: FieldData, position: { x: number; y: number }) => {
    console.log("Adding field to canvas:", field, position);
    
    if (!fabricCanvas) {
      console.log("Canvas not ready, retrying in 100ms...");
      setTimeout(() => addFieldToCanvas(field, position), 100);
      return;
    }

    try {
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

      const adjustedPosition = {
        x: position.x / scale,
        y: position.y / scale
      };

      console.log("Creating rect with dimensions:", { width, height, colors, adjustedPosition });

      const fieldObject = new Rect({
        left: adjustedPosition.x,
        top: adjustedPosition.y,
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

      const label = new Text(field.label, {
        left: adjustedPosition.x + 5,
        top: adjustedPosition.y + (height / 2) - 8,
        fontSize: 12,
        fill: colors.stroke,
        selectable: false,
        evented: false,
      });

      fieldObject.set('fieldType', field.type);
      fieldObject.set('fieldData', field);
      
      console.log("Adding objects to canvas");
      fabricCanvas.add(fieldObject);
      fabricCanvas.add(label);
      fabricCanvas.renderAll();
      console.log("Canvas rendered, objects count:", fabricCanvas.getObjects().length);
      
      onFieldAdded?.(field, adjustedPosition);
    } catch (error) {
      console.error("Error adding field to canvas:", error);
    }
  };

  // Expose addFieldToCanvas method
  useImperativeHandle(ref, () => ({
    addFieldToCanvas
  }));

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-auto"
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        left: `${offsetLeft}px`,
        top: `${offsetTop}px`,
        zIndex: 10 
      }}
    />
  );
});