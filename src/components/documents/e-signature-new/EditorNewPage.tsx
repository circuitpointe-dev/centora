import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FieldPalette } from "./components/FieldPalette";
import { PDFStage, PDFStageHandle } from "./components/PDFStage";
import { PropertiesPanel } from "./components/PropertiesPanel";

export type FieldType = "signature" | "name" | "date" | "email" | "text";

export interface FieldData {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  value?: any;
  isConfigured: boolean;
}

export const EditorNewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const stageRef = useRef<PDFStageHandle>(null);

  const [activeTool, setActiveTool] = useState<FieldType | null>(null);
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [scale, setScale] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);

  // Derive file URL from wizard state
  const fileUrl = useMemo(() => {
    const state = location?.state || {};
    if (state.selectedFiles && state.selectedFiles.length > 0) {
      const file = state.selectedFiles[0] as File;
      return URL.createObjectURL(file);
    }
    if (state.selectedDoc?.url) return state.selectedDoc.url as string;
    return "";
  }, [location?.state]);

  useEffect(() => {
    document.title = "E‑Signature Editor | Documents";
  }, []);

  const handleAddFieldClick = (type: FieldType) => {
    setActiveTool(type);
    toast("Click anywhere on the page to place the field");
  };

  const handleFieldAdded = (field: FieldData) => {
    setSelectedField(field);
  };

  const handleSelectionChange = (field: FieldData | null) => {
    setSelectedField(field);
  };

  const handleUpdateSelected = (patch: Partial<FieldData>) => {
    if (!selectedField) return;
    stageRef.current?.updateField(selectedField.id, patch);
  };

  const handleRemoveSelected = () => {
    if (!selectedField) return;
    stageRef.current?.removeField(selectedField.id);
    setSelectedField(null);
  };

  const handleClearAll = () => {
    stageRef.current?.clearAll();
    setSelectedField(null);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">E‑Signature Editor</h1>
            <Separator orientation="vertical" className="h-5" />
            <p className="text-sm text-muted-foreground">Place fields on your PDF</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
            <Button variant="outline" onClick={handleClearAll}>Clear</Button>
            <Button onClick={() => toast("Preview coming soon")}>Preview</Button>
            <Button onClick={() => toast("Saved draft")} variant="default">Save draft</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-4 grid grid-cols-12 gap-4">
        {/* Left: Palette */}
        <aside className="col-span-2">
          <Card className="p-3 rounded-sm">
            <FieldPalette onPick={handleAddFieldClick} />
          </Card>
        </aside>

        {/* Center: PDF Stage */}
        <section className="col-span-7">
          <Card className="p-3 rounded-sm">
            <PDFStage
              ref={stageRef}
              fileUrl={fileUrl}
              scale={scale}
              pageNumber={pageNumber}
              onNumPages={setNumPages}
              activeTool={activeTool}
              onToolUsed={() => setActiveTool(null)}
              onFieldAdded={handleFieldAdded}
              onSelectionChange={handleSelectionChange}
            />

            {/* Controls */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setScale((s) => Math.max(0.5, Number((s - 0.1).toFixed(2))))}>-</Button>
                <span className="text-sm w-16 text-center">{Math.round(scale * 100)}%</span>
                <Button variant="outline" size="sm" onClick={() => setScale((s) => Math.min(2, Number((s + 0.1).toFixed(2))))}>+</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={pageNumber <= 1} onClick={() => setPageNumber((p) => Math.max(1, p - 1))}>Prev</Button>
                <span className="text-sm">Page {pageNumber} / {numPages}</span>
                <Button variant="outline" size="sm" disabled={pageNumber >= numPages} onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}>Next</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Right: Properties */}
        <aside className="col-span-3">
          <Card className="p-3 rounded-sm sticky top-20">
            <PropertiesPanel
              field={selectedField}
              onChange={handleUpdateSelected}
              onRemove={handleRemoveSelected}
            />
          </Card>
        </aside>
      </main>
    </div>
  );
};

export default EditorNewPage;
