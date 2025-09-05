// src/components/support/tickets/TicketToolbar.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search } from "lucide-react";
import { TicketPriority, TicketStatus } from "./TicketTypes";
import { TicketFilters } from "./TicketFilters";
import { useState } from "react";

export type FilterState = {
  status: TicketStatus[];
  priority: TicketPriority[];
  category: string | "All";
  assignee: string | "All" | "Unassigned";
  tenant: string | "All";
};

export function TicketToolbar({
  onSearch,
  onAdd,
  filters,
  onChangeFilters,
}: {
  onSearch: (q: string) => void;
  onAdd: () => void;
  filters: FilterState;
  onChangeFilters: (fs: FilterState) => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 w-full max-w-md">
        <span className="text-sm text-zinc-500">Tickets</span>
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by subject, tenant or requester..."
            className="pl-8"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              onSearch(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-purple-600 text-purple-600 hover:bg-purple-50"
          onClick={() => setOpen(true)}
        >
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
        <Button
          className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Ticket
        </Button>
      </div>
      <TicketFilters open={open} onOpenChange={setOpen} value={filters} onChange={onChangeFilters} />
    </div>
  );
}