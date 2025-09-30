// src/components/esignature/SignatureDetailsModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from "@/components/ui/slider";
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApply: (payload: string | { text?: string; font?: string; style?: string }) => void;
  target: 'signature' | 'initials';
}

export default function SignatureDetailsModal({ open, onOpenChange, onApply, target }: Props) {
  const [tab, setTab] = useState<'draw' | 'type'>('draw');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(2);
  const [typed, setTyped] = useState('');
  const [font, setFont] = useState('Caveat, ui-sans-serif');
  const [style, setStyle] = useState('bold');

  useEffect(() => {
    if (!open) return;
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    c.width = 600 * dpr;
    c.height = 240 * dpr;
    c.style.width = '600px';
    c.style.height = '240px';
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 240);
  }, [open, lineWidth]);

  const getPos = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX ?? (e.touches?.[0]?.clientX || 0)) - rect.left;
    const y = (e.clientY ?? (e.touches?.[0]?.clientY || 0)) - rect.top;
    return { x, y };
  };

  const start = (e: any) => {
    e.preventDefault?.();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
  };
  const move = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault?.();
    const { x, y } = getPos(e);
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
  };
  const end = (e?: any) => {
    if (!isDrawing) return;
    e?.preventDefault?.();
    setIsDrawing(false);
  };

  const clear = () => {
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 240);
  };

  const handleApply = () => {
    if (tab === 'draw') {
      const data = canvasRef.current?.toDataURL('image/png');
      if (!data) { toast.error('Please draw your ' + target); return; }
      onApply(data);
      onOpenChange(false);
    } else {
      if (!typed.trim()) { toast.error('Type your ' + target); return; }
      onApply({ text: typed.trim(), font, style });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>{target === 'signature' ? 'Add Signature' : 'Add Initials'}</DialogTitle>
          <DialogDescription>Draw or type. You can reuse this for other fields in this document.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
          <TabsList>
            <TabsTrigger value="draw">Draw</TabsTrigger>
            <TabsTrigger value="type">Type</TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-3">
            <div className="border rounded-xl overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                className="w-full h-[240px] touch-none cursor-crosshair"
                onMouseDown={start}
                onMouseMove={move}
                onMouseUp={end}
                onMouseLeave={end}
                onTouchStart={start}
                onTouchMove={move}
                onTouchEnd={end}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-[80px]">Thickness</span>
                <Slider value={[lineWidth]} min={1} max={6} step={1} onValueChange={(v) => setLineWidth(v[0])} className="w-56" />
              </div>
              <Button variant="outline" onClick={clear}>Clear</Button>
            </div>
          </TabsContent>

          <TabsContent value="type" className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={target === 'signature' ? 'Type your full name' : 'Type your initials'} />
                <div className="mt-3 border rounded-xl p-6 text-4xl font-semibold" style={{ fontFamily: font }}>
                  {typed || 'Preview'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase text-gray-500">Font</label>
                <select className="w-full border rounded-md p-2" value={font} onChange={(e) => setFont(e.target.value)}>
                  <option value="Caveat, ui-sans-serif">Caveat</option>
                  <option value="Great Vibes, ui-sans-serif">Great Vibes</option>
                  <option value="Pacifico, ui-sans-serif">Pacifico</option>
                  <option value="ui-serif">Serif</option>
                  <option value="ui-sans-serif">Sans</option>
                </select>

                <label className="text-xs uppercase text-gray-500">Style</label>
                <select className="w-full border rounded-md p-2" value={style} onChange={(e) => setStyle(e.target.value)}>
                  <option value="bold">Bold</option>
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
