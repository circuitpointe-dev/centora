import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Canvas as FabricCanvas, Rect, Text, Group } from "fabric";
import type { FieldData, FieldType } from "../EditorNewPage";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs`;

export interface PDFStageHandle {
  updateField: (id: string, patch: Partial<FieldData>) => void;
  removeField: (id: string) => void;
  clearAll: () => void;
  getAllFields: () => FieldData[];
}

interface PDFStageProps {
  fileUrl: string;
  scale: number;
  pageNumber: number;
  onNumPages: (n: number) => void;
  activeTool: FieldType | null;
  onToolUsed: () => void;
  onFieldAdded?: (field: FieldData) => void;
  onSelectionChange?: (field: FieldData | null) => void;
}

export const PDFStage = forwardRef<PDFStageHandle, PDFStageProps>(({
  fileUrl,
  scale,
  pageNumber,
  onNumPages,
  activeTool,
  onToolUsed,
  onFieldAdded,
  onSelectionChange,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [loading, setLoading] = useState(true);

  const colors = useMemo(() => ({
    signature: { fill: "rgba(99,102,241,0.10)", stroke: "#6366f1" },
    name: { fill: "rgba(34,197,94,0.10)", stroke: "#22c55e" },
    date: { fill: "rgba(59,130,246,0.10)", stroke: "#3b82f6" },
    email: { fill: "rgba(239,68,68,0.10)", stroke: "#ef4444" },
    text: { fill: "rgba(245,158,11,0.10)", stroke: "#f59e0b" },
    default: { fill: "rgba(107,114,128,0.10)", stroke: "#6b7280" },
  }), []);

  // Init Fabric
  useEffect(() => {
    if (!overlayRef.current) return;

    const fc = new FabricCanvas(overlayRef.current, {
      width: 1,
      height: 1,
      backgroundColor: "transparent",
      selection: true,
    });

    const onSelection = () => {
      const obj = fc.getActiveObject() as any;
      const data = obj?.fieldData as FieldData | undefined;
      onSelectionChange?.(data ?? null);
    };

    fc.on("selection:created", onSelection);
    fc.on("selection:updated", onSelection);
    fc.on("selection:cleared", () => onSelectionChange?.(null));

    setFabricCanvas(fc);
    return () => {
      try { fc.dispose(); } catch {}
    };
  }, []);

  // Sync overlay to PDF canvas size and position
  const syncOverlay = () => {
    const container = containerRef.current;
    if (!container) return;
    const pdfCanvas = container.querySelector("canvas");
    if (!pdfCanvas || !overlayRef.current || !fabricCanvas) return;
    const pdfRect = pdfCanvas.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();

    const cssWidth = Math.round(pdfRect.width);
    const cssHeight = Math.round(pdfRect.height);
    const left = Math.round(pdfRect.left - contRect.left + container.scrollLeft);
    const top = Math.round(pdfRect.top - contRect.top + container.scrollTop);

    Object.assign(overlayRef.current.style, {
      width: cssWidth + "px",
      height: cssHeight + "px",
      left: left + "px",
      top: top + "px",
      position: "absolute",
      pointerEvents: "auto",
      zIndex: 10,
    });

    fabricCanvas.setDimensions({ width: cssWidth, height: cssHeight });
    fabricCanvas.setZoom(1);
    fabricCanvas.renderAll();
  };

  useEffect(() => {
    syncOverlay();
    const obs = new ResizeObserver(() => syncOverlay());
    const container = containerRef.current;
    const pdfCanvas = container?.querySelector("canvas");
    if (pdfCanvas) obs.observe(pdfCanvas);
    return () => obs.disconnect();
  }, [fabricCanvas, fileUrl, scale, pageNumber]);

  const placeFieldAt = (type: FieldType, x: number, y: number) => {
    if (!fabricCanvas) return;

    const cfg = (colors as any)[type] ?? colors.default;
    const w = type === "signature" ? 150 : type === "date" ? 110 : 140;
    const h = type === "signature" ? 48 : 32;

    // Rect and label within a group
    const rect = new Rect({ width: w, height: h, rx: 4, ry: 4, fill: cfg.fill, stroke: cfg.stroke, strokeWidth: 2, strokeDashArray: [5,5] });
    const text = new Text(type.toUpperCase(), { left: 6, top: h/2 - 8, fontSize: 12, fill: cfg.stroke, selectable: false, evented: false });

    const group = new Group([rect, text], { left: x, top: y, hasControls: true, hasBorders: true, cornerColor: cfg.stroke, cornerStyle: 'circle', cornerSize: 8, transparentCorners: false }) as any;

    const field: FieldData = { id: String(Date.now() + Math.random()), type, label: type.toUpperCase(), isConfigured: false };
    group.fieldData = field;

    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.renderAll();
    onFieldAdded?.(field);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const pdfCanvas = container.querySelector('canvas') as HTMLCanvasElement | null;
    const rect = (pdfCanvas || container).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const payload = e.dataTransfer.getData("application/json");
    try {
      const data = JSON.parse(payload);
      const type: FieldType | undefined = data?.fieldType;
      if (type) {
        placeFieldAt(type, x, y);
      }
    } catch {}
  };

  const handleClickToPlace = (e: React.MouseEvent) => {
    if (!activeTool) return;
    const container = containerRef.current;
    if (!container) return;
    const pdfCanvas = container.querySelector('canvas') as HTMLCanvasElement | null;
    const rect = (pdfCanvas || container).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    placeFieldAt(activeTool, x, y);
    onToolUsed();
  };

  useImperativeHandle(ref, () => ({
    updateField: (id, patch) => {
      if (!fabricCanvas) return;
      const obj = fabricCanvas.getObjects().find((o: any) => (o as any).fieldData?.id === id) as any;
      if (!obj) return;
      const current: FieldData = obj.fieldData;
      const next: FieldData = { ...current, ...patch };
      obj.fieldData = next;
      // Update label text (2nd object in group)
      try {
        const text = (obj as any)._objects?.[1] as any;
        if (text && patch.label) text.set({ text: String(patch.label) });
      } catch {}
      fabricCanvas.renderAll();
    },
    removeField: (id) => {
      if (!fabricCanvas) return;
      const obj = fabricCanvas.getObjects().find((o: any) => (o as any).fieldData?.id === id) as any;
      if (obj) {
        fabricCanvas.remove(obj);
        fabricCanvas.discardActiveObject();
        fabricCanvas.renderAll();
      }
    },
    clearAll: () => {
      if (!fabricCanvas) return;
      fabricCanvas.getObjects().forEach((o) => fabricCanvas.remove(o));
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    },
    getAllFields: () => {
      if (!fabricCanvas) return [];
      return fabricCanvas.getObjects()
        .map((obj: any) => obj.fieldData)
        .filter((data): data is FieldData => !!data);
    }
  }), [fabricCanvas]);

  return (
    <div className="relative" ref={containerRef} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <Document file={fileUrl} onLoadSuccess={({ numPages }) => { setLoading(false); onNumPages(numPages); }} onLoadError={() => setLoading(false)} loading={<div className="h-[400px] grid place-items-center text-muted-foreground">Loading…</div>}>
        <Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer />
      </Document>
      <canvas ref={overlayRef} onClick={handleClickToPlace} />
    </div>
  );
});

export default PDFStage;
