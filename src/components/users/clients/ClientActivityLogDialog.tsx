// src/components/users/clients/ClientActivityLogDialog.tsx

import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
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
      <DialogContent className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-0 sm:max-w-[90vw] md:max-w-4xl">
        {/* Close button */}
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            className="absolute -right-2 -top-2 z-50 h-8 w-8 rounded-full bg-background border shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        <div className="flex max-h-[85vh] flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background border-b">
            <DialogHeader className="p-4">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Activity Logs — {client?.name ?? ''}
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden p-4">
            <div className="space-y-4 h-full flex flex-col">
              {/* Filters */}
              <div className="flex-shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  <div>
                    <Label className="text-sm">Search</Label>
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search activities"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Module</Label>
                    <Select value={moduleFilter} onValueChange={setModuleFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="All Modules" />
                      </SelectTrigger>
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

              <Separator className="flex-shrink-0" />

              {/* Table */}
              <div className="flex-1 rounded-lg border overflow-hidden flex flex-col min-h-0">
                <div className="flex-shrink-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/40 border-b">
                        <th className="text-left p-3 font-medium w-[25%]">Timestamp</th>
                        <th className="text-left p-3 font-medium w-[20%]">User</th>
                        <th className="text-left p-3 font-medium w-[35%]">Report</th>
                        <th className="text-left p-3 font-medium w-[20%]">Module</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                
                <ScrollArea className="flex-1">
                  <table className="w-full text-sm">
                    <tbody>
                      {slice.map((a) => (
                        <tr key={a.id} className="border-t">
                          <td className="p-3 w-[25%]">{new Date(a.timestamp).toLocaleString()}</td>
                          <td className="p-3 w-[20%]">{a.user}</td>
                          <td className="p-3 w-[35%]">{a.report}</td>
                          <td className="p-3 w-[20%]">{a.module}</td>
                        </tr>
                      ))}
                      {slice.length === 0 && (
                        <tr>
                          <td className="p-8 text-muted-foreground text-center" colSpan={4}>
                            No activity found for the current filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </ScrollArea>

                {/* Pagination */}
                <div className="flex-shrink-0 border-t p-3">
                  <ClientTablePagination
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
