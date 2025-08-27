// src/components/users/clients/ThemeColorPicker.tsx

import React from 'react';

const PRESETS = ['#6D28D9', '#7C3AED', '#9333EA', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#111827'];

export default function ThemeColorPicker({
  value,
  disabled,
  onChange,
}: {
  value?: string;
  disabled?: boolean;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((hex) => {
        const selected = value?.toLowerCase() === hex.toLowerCase();
        return (
          <button
            type="button"
            key={hex}
            disabled={disabled}
            onClick={() => onChange(hex)}
            className={[
              'h-8 w-8 rounded-full border transition',
              selected ? 'ring-2 ring-offset-2' : 'ring-0',
            ].join(' ')}
            style={{ backgroundColor: hex, borderColor: selected ? hex : 'rgba(0,0,0,0.1)' }}
            aria-label={`Select ${hex}`}
            title={hex}
          />
        );
      })}
      {/* Fallback: custom input */}
      <input
        type="color"
        value={value || '#6D28D9'}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border"
        aria-label="Pick custom color"
        title="Custom color"
      />
    </div>
  );
}
