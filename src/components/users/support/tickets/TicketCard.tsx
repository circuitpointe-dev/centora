// src/components/support/tickets/TicketCard.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Ticket } from "./TicketTypes";
import { TicketStatusPill } from "./TicketStatusPill";
import { Clock, Flag, MessageSquare, User } from "lucide-react";

function relativeFrom(iso: string) {
  try {
    const minsAgo = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    return minsAgo < 60 ? rtf.format(-minsAgo, "minute") : rtf.format(-Math.round(minsAgo / 60), "hour");
  } catch {
    return new Date(iso).toLocaleString();
  }
}

export function TicketCard({ ticket, onOpen }: { ticket: Ticket; onOpen: (t: Ticket) => void }) {
  const rel = relativeFrom(ticket.createdAt);

  return (
    <Card className="hover:shadow-sm transition cursor-pointer" onClick={() => onOpen(ticket)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-base font-semibold">{ticket.subject}</div>
            <div className="text-xs text-zinc-500">{ticket.tenantName} • #{ticket.id}</div>
          </div>
          <div className="flex items-center gap-2">
            <TicketStatusPill status={ticket.status} />
            <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-white">
              <Flag className="h-3.5 w-3.5 mr-1" /> {ticket.priority}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-zinc-600 space-y-3">
        <p className="line-clamp-2">{ticket.description}</p>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center"><User className="h-3.5 w-3.5 mr-1" />{ticket.assignee?.name ?? "Unassigned"}</span>
            <span className="inline-flex items-center"><MessageSquare className="h-3.5 w-3.5 mr-1" />{ticket.comments.length} comments</span>
          </div>
          <span className="inline-flex items-center"><Clock className="h-3.5 w-3.5 mr-1" />{rel}</span>
        </div>
      </CardContent>
    </Card>
  );
}