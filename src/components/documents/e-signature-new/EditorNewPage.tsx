import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FieldPalette } from "./components/FieldPalette";
import { PDFStage, PDFStageHandle } from "./components/PDFStage";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { PreviewDialog } from "./components/PreviewDialog";
import { SigningDialog } from "./components/SigningDialog";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [signingField, setSigningField] = useState<FieldData | null>(null);

  // Derive file URL from wizard state or backend
  const fileUrl = useMemo(() => {
    const state = location?.state || {};
    if (state.selectedFiles && state.selectedFiles.length > 0) {
      const file = state.selectedFiles[0] as File;
      return URL.createObjectURL(file);
    }
    if (state.selectedDoc && state.selectedDoc.file_path) {
      // Use Supabase storage URL for documents
      return `https://kspzfifdwfpirgqstzhz.supabase.co/storage/v1/object/public/documents/${state.selectedDoc.file_path}`;
    }
    // Fallback to a sample PDF for demo
    return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  }, [location?.state]);

  useEffect(() => {
    document.title = "E‑Signature Editor | Documents";
  }, []);

  const handleAddFieldClick = (type: FieldType) => {
    setActiveTool(type);
    toast.info(`Click anywhere on the document to place the ${type} field`);
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
    setActiveTool(null);
  };

  const handleSignField = (field: FieldData) => {
    setSigningField(field);
  };

  const handleSigningSave = (value: any) => {
    if (!signingField) return;
    
    stageRef.current?.updateField(signingField.id, { 
      value, 
      isConfigured: true 
    });
    
    // Update selected field if it's the same
    if (selectedField?.id === signingField.id) {
      setSelectedField({ ...signingField, value, isConfigured: true });
    }
    
    setSigningField(null);
    toast.success("Field filled successfully");
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
            <Button onClick={() => {
              const fields = stageRef.current?.getAllFields();
              if (fields && fields.length > 0) {
                setIsPreviewOpen(true);
              } else {
                toast.error("Add some fields first to preview");
              }
            }}>Preview</Button>
            <Button onClick={() => {
              const fields = stageRef.current?.getAllFields();
              if (fields && fields.length > 0) {
                toast.success(`Draft saved with ${fields.length} fields`);
                // TODO: Save to backend
              } else {
                toast.error("No fields to save");
              }
            }} variant="default">Save draft</Button>
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
              onSign={handleSignField}
            />
          </Card>
        </aside>
      </main>

      {/* Preview Dialog */}
      <PreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        fields={stageRef.current?.getAllFields() || []}
        documentTitle={location?.state?.selectedDoc?.title || 'Document'}
      />

      {/* Signing Dialog */}
      <SigningDialog
        open={!!signingField}
        onOpenChange={(open) => !open && setSigningField(null)}
        field={signingField}
        onSave={handleSigningSave}
      />
    </div>
  );
};

export default EditorNewPage;
