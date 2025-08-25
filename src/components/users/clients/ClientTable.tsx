// src/components/users/clients/ClientTable.tsx

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Client } from './types';
import { ClientStatusPill } from './ClientStatusPill';
import { Eye } from 'lucide-react';

interface Props {
  clients: Client[];
  search: string;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onView: (c: Client) => void;
}

export const ClientTable: React.FC<Props> = ({
  clients, search, page, pageSize, onPageChange, onView,
}) => {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.name, c.organizationType, c.contactName, c.contactEmail].some((f) => f?.toLowerCase().includes(q)),
    );
  }, [clients, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => {
    if (page > totalPages) onPageChange(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead>
            <tr className="bg-muted/40">
              <th className="text-left p-3 font-medium w-[28%]">Name</th>
              <th className="text-left p-3 font-medium w-[28%]">Modules</th>
              <th className="text-left p-3 font-medium w-[16%]">Last Active</th>
              <th className="text-left p-3 font-medium w-[12%]">Status</th>
              <th className="text-left p-3 font-medium w-[16%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.organizationType} • {c.primaryCurrency}</div>
                </td>
                <td className="p-3">
                  <div className="line-clamp-2">{c.modules.join(', ')}</div>
                </td>
                <td className="p-3">{new Date(c.lastActiveAt).toLocaleString()}</td>
                <td className="p-3"><ClientStatusPill status={c.status} /></td>
                <td className="p-3">
                  <Button size="sm" variant="outline" onClick={() => onView(c)}><Eye className="mr-2 h-4 w-4" />View</Button>
                </td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr>
                <td className="p-4 text-muted-foreground" colSpan={5}>No clients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inline pagination footer */}
      <div className="border-t px-3 py-2 text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Showing <span className="font-medium">
            {Math.min(total, (page - 1) * pageSize + 1)}
          </span> to <span className="font-medium">
            {Math.min(total, page * pageSize)}
          </span> of <span className="font-medium">{total}</span> clients
        </span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
          <Button variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
};
