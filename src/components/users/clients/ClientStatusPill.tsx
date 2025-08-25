// src/components/users/clients/ClientStatusPill.tsx

import React from 'react';
import { cn } from '@/lib/utils';

export const ClientStatusPill: React.FC<{ status: 'active' | 'onboarding' | 'suspended' }> = ({ status }) => {
  const map: Record<typeof status, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    onboarding: 'bg-amber-100 text-amber-700 border-amber-200',
    suspended: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', map[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
