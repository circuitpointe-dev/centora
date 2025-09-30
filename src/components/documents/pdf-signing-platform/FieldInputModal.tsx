// src/components/esignature/FieldInputModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: 'name' | 'date' | 'text';
  initial?: string;
  onApply: (v: string) => void;
}

export default function FieldInputModal({ open, onOpenChange, type, initial, onApply }: Props) {
  const [value, setValue] = useState(initial || '');
  useEffect(() => { if (open) setValue(initial || ''); }, [open, initial]);

  const label = type === 'name' ? 'Name' : type === 'date' ? 'Date' : 'Text';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {label}</DialogTitle>
          <DialogDescription>Provide the value for this field.</DialogDescription>
        </DialogHeader>

        {type === 'text'
          ? <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4} />
          : <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={label} />}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onApply(value); onOpenChange(false); }}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
