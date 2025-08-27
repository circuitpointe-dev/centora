// src/components/users/clients/ClientTable.tsx

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Client, ClientFilters } from './types';
import { ClientStatusPill } from './ClientStatusPill';
import { Eye, Trash2, Power, PowerOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  clients: Client[];
  search: string;
  filters: ClientFilters;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onView: (c: Client) => void;
  onDelete: (clientId: string) => void;
  onToggleStatus: (clientId: string) => void;
}

export const ClientTable: React.FC<Props> = ({
  clients, search, filters, page, pageSize, onPageChange, onView, onDelete, onToggleStatus,
}) => {
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const filtered = useMemo(() => {
    let result = clients;
    
    // Apply search filter
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((c) =>
        [c.name, c.organizationType, c.contactName, c.contactEmail].some((f) => f?.toLowerCase().includes(q)),
      );
    }
    
    // Apply other filters
    if (filters.status !== "all") {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters.organizationType !== "all") {
      result = result.filter((c) => c.organizationType === filters.organizationType);
    }
    if (filters.pricingTier !== "all") {
      result = result.filter((c) => c.pricingTier === filters.pricingTier);
    }
    
    return result;
  }, [clients, search, filters]);

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
              <th className="text-left p-3 font-medium w-[22%]">Name</th>
              <th className="text-left p-3 font-medium w-[22%]">Modules</th>
              <th className="text-left p-3 font-medium w-[14%]">Last Active</th>
              <th className="text-left p-3 font-medium w-[10%]">Status</th>
              <th className="text-left p-3 font-medium w-[32%]">Actions</th>
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
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(c)}>
                      <Eye className="mr-2 h-4 w-4" />View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onToggleStatus(c.id)}
                      className={c.status === 'active'
                        ? 'border-rose-600 text-rose-600 hover:bg-rose-50'
                        : 'border-green-600 text-green-600 hover:bg-green-50'}
                    >
                      {c.status === 'active' ? (
                        <>
                          <PowerOff className="mr-2 h-4 w-4" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <Power className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setDeleteClient(c)}
                      className="border-rose-600 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteClient} onOpenChange={() => setDeleteClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. It will permanently remove <strong>{deleteClient?.name}</strong> and all associated records.
              Please confirm you understand the consequences.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (deleteClient) {
                  onDelete(deleteClient.id);
                  setDeleteClient(null);
                }
              }}
            >
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
