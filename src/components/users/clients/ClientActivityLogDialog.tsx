// src/components/users/clients/ClientActivityLogDialog.tsx

import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Client, ClientActivity } from './types';
import { ClientTablePagination } from './ClientTablePagination';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  client: Client | null;
  activities: ClientActivity[];
}

export const ClientActivityLogDialog: React.FC<Props> = ({ open, onOpenChange, client, activities }) => {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const list = useMemo(() => {
    const forClient = activities.filter((a) => a.clientId === client?.id);
    const withModule = moduleFilter === 'all' ? forClient : forClient.filter((a) => a.module === moduleFilter);
    const q = search.trim().toLowerCase();
    if (!q) return withModule;
    return withModule.filter(
      (a) =>
        a.user.toLowerCase().includes(q) ||
        a.report.toLowerCase().includes(q) ||
        a.module.toLowerCase().includes(q),
    );
  }, [activities, client?.id, moduleFilter, search]);

  const total = list.length;
  const slice = list.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => setPage(1), [search, moduleFilter, client?.id]);

  const moduleOptions = Array.from(new Set(activities.filter(a => a.clientId === client?.id).map((a) => a.module)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Activity Logs — {client?.name ?? ''}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:max-w-xl">
              <div>
                <Label>Search</Label>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by user, report, or module"
                />
              </div>
              <div>
                <Label>Module</Label>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger><SelectValue placeholder="All Modules" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {moduleOptions.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[820px] w-full text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="text-left p-3 font-medium">Timestamp</th>
                    <th className="text-left p-3 font-medium">User</th>
                    <th className="text-left p-3 font-medium">Report</th>
                    <th className="text-left p-3 font-medium">Module</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="p-3">{new Date(a.timestamp).toLocaleString()}</td>
                      <td className="p-3">{a.user}</td>
                      <td className="p-3">{a.report}</td>
                      <td className="p-3">{a.module}</td>
                    </tr>
                  ))}
                  {slice.length === 0 && (
                    <tr>
                      <td className="p-4 text-muted-foreground" colSpan={4}>
                        No activity found for the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-3">
              <ClientTablePagination
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
