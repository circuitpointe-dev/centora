// src/components/users/clients/ModuleSelectGrid.tsx

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ALL_MODULES } from './types';

interface Props {
  value: string[];
  onChange: (mods: string[]) => void;
  required?: string[]; // ['User Management']
}

export const ModuleSelectGrid: React.FC<Props> = ({ value, onChange, required = ['User Management'] }) => {
  const toggle = (m: string, v: boolean) => {
    const base = new Set(value);
    if (v) base.add(m);
    else base.delete(m);
    // enforce required modules
    required.forEach((r) => base.add(r));
    onChange([...base]);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {ALL_MODULES.map((m) => {
        const isRequired = required.includes(m);
        const checked = value.includes(m);
        return (
          <div key={m} className="flex items-center justify-between rounded-lg border p-3">
            <Label className="font-medium">{m}</Label>
            <div className="flex items-center gap-2">
              {isRequired && <span className="text-xs text-purple-600 border border-purple-600 px-2 py-0.5 rounded-full">Required</span>}
              <Switch checked={checked} onCheckedChange={(v) => !isRequired && toggle(m, Boolean(v))} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
