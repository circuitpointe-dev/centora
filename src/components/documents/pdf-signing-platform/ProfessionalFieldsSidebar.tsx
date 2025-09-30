// src/components/esignature/ProfessionalFieldsSidebar.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BadgeCheck, Hand, MousePointerClick, ScanLine, Type, Calendar, Signature, User, CheckSquare, Upload, AlignLeft, Stamp } from "lucide-react";

export type FieldType = 'signature' | 'initials' | 'name' | 'date' | 'text' | 'checkbox' | 'stamp';

export interface SidebarField {
  type: FieldType;
  label: string;
  hint?: string;
}

interface ProfessionalFieldsSidebarProps {
  mode: 'edit' | 'sign';
  selectedTool: FieldType | null;
  onPickTool: (type: FieldType) => void;
  canSend: boolean;
  canSaveSigned: boolean;
  onSendForSigning: () => void;
  onSaveSigned: () => void;
  onClearAll: () => void;
}

const FIELDS: SidebarField[] = [
  { type: 'signature', label: 'Signature', hint: 'Draw or Type' },
  { type: 'initials', label: 'Initials' },
  { type: 'name', label: 'Name' },
  { type: 'date', label: 'Date' },
  { type: 'text', label: 'Text' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'stamp', label: 'Stamp' },
];

const iconFor = (t: FieldType) => {
  switch (t) {
    case 'signature': return <Signature className="h-4 w-4" />;
    case 'initials': return <Hand className="h-4 w-4" />;
    case 'name': return <User className="h-4 w-4" />;
    case 'date': return <Calendar className="h-4 w-4" />;
    case 'text': return <AlignLeft className="h-4 w-4" />;
    case 'checkbox': return <CheckSquare className="h-4 w-4" />;
    case 'stamp': return <Stamp className="h-4 w-4" />;
  }
};

export default function ProfessionalFieldsSidebar(props: ProfessionalFieldsSidebarProps) {
  const { mode, selectedTool, onPickTool, canSend, canSaveSigned, onSendForSigning, onClearAll, onSaveSigned } = props;

  return (
    <aside className="h-full w-[320px] shrink-0 border-r bg-white/70 backdrop-blur p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-500">Workflow</h2>
          <div className="text-base font-semibold">Add Fields &raquo; Sign</div>
        </div>
        <BadgeCheck className="h-5 w-5 text-purple-600" />
      </div>

      <Card className="shadow-none border-purple-100">
        <CardContent className="p-3 space-y-2">
          <div className="text-xs uppercase text-gray-500">Mode</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={mode === 'edit' ? 'default' : 'outline'}
              className={mode === 'edit' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              onClick={() => window.dispatchEvent(new CustomEvent('esign:set-mode', { detail: 'edit' }))}
            >
              <MousePointerClick className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              variant={mode === 'sign' ? 'default' : 'outline'}
              className={mode === 'sign' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              onClick={() => window.dispatchEvent(new CustomEvent('esign:set-mode', { detail: 'sign' }))}
            >
              <ScanLine className="h-4 w-4 mr-2" /> Sign
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="text-xs uppercase text-gray-500">Fields</div>
        <ScrollArea className="h-[280px] rounded border">
          <div className="p-2 grid grid-cols-2 gap-2">
            {FIELDS.map((f) => (
              <Button
                key={f.type}
                variant={selectedTool === f.type ? 'default' : 'outline'}
                className={selectedTool === f.type ? 'bg-purple-600 hover:bg-purple-700' : ''}
                onClick={() => onPickTool(f.type)}
              >
                {iconFor(f.type)} <span className="ml-2">{f.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
        <Button variant="outline" onClick={onClearAll}>Clear All</Button>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="text-xs uppercase text-gray-500">Actions</div>
        <div className="grid grid-cols-1 gap-2">
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!canSend}
            onClick={onSendForSigning}
          >
            <Upload className="h-4 w-4 mr-2" /> Send For Signing
          </Button>
          <Button
            variant="outline"
            disabled={!canSaveSigned}
            onClick={onSaveSigned}
          >
            Save Signed PDF
          </Button>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="justify-start w-full">Tips & Shortcuts</Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px]">
          <SheetHeader>
            <SheetTitle>Tips & Shortcuts</SheetTitle>
          </SheetHeader>
          <div className="pt-4 text-sm space-y-2">
            <p><strong>Pick a Field</strong> from the palette, then click on the PDF to place it. Drag to move; use handles to resize.</p>
            <p><strong>Double-click</strong> a placed field to edit its value.</p>
            <p><strong>Sign Mode</strong> lets you quickly fill all required fields and save.</p>
          </div>
        </SheetContent>
      </Sheet>
    </aside>
  );
}
