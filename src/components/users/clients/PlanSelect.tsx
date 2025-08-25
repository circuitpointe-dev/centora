// src/components/users/clients/PlanSelect.tsx

import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { PricingTier } from './types';

export const PlanSelect: React.FC<{
  value: PricingTier;
  onChange: (v: PricingTier) => void;
}> = ({ value, onChange }) => {
  const tiers: PricingTier[] = ['Tier 1', 'Tier 2', 'Tier 3'];
  return (
    <RadioGroup value={value} onValueChange={(v) => onChange(v as PricingTier)} className="space-y-3">
      {tiers.map((t) => (
        <div key={t} className="flex items-center gap-3 rounded-lg border p-3">
          <RadioGroupItem id={t} value={t} />
          <Label htmlFor={t} className="font-medium">{t}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};
