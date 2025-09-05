// src/components/support/tickets/TicketList.tsx

import { useMemo, useState } from "react";
import { Ticket } from "./TicketTypes";
import { TicketCard } from "./TicketCard";

export function TicketList({
  tickets,
  onOpen,
  pageSize = 9,
}: {
  tickets: Ticket[];
  onOpen: (t: Ticket) => void;
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const total = tickets.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = Math.min(total, start + pageSize);
  const slice = useMemo(() => tickets.slice(start, end), [tickets, start, end]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {slice.map((t) => (
          <TicketCard key={t.id} ticket={t} onOpen={onOpen} />
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <div>Showing {total === 0 ? 0 : start + 1} to {end} of {total} tickets</div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-md border disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="px-3 py-1.5 rounded-md border disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}