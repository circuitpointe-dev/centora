// src/components/support/tickets/TicketStatusPill.tsx

import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "./TicketTypes";

const statusColors: Record<TicketStatus, string> = {
  Open: "bg-amber-100 text-amber-800 border-amber-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Closed: "bg-zinc-100 text-zinc-800 border-zinc-200",
};

export function TicketStatusPill({ status }: { status: TicketStatus }) {
  return (
    <Badge variant="outline" className={statusColors[status] + " font-medium"}>
      {status}
    </Badge>
  );
}