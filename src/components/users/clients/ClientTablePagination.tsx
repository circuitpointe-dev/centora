// src/components/users/clients/ClientTablePagination.tsx

import React from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const ClientTablePagination: React.FC<Props> = ({ page, pageSize, total, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = Math.min(total, (page - 1) * pageSize + 1);
  const to = Math.min(total, page * pageSize);

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
        <span className="font-medium">{total}</span> clients
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="outline" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};
