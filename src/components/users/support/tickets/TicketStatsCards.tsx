// src/components/support/tickets/TicketStatsCards.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "./TicketTypes";
import { AlertTriangle, CircleDot, User } from "lucide-react";

export function TicketStatsCards({ tickets }: { tickets: Ticket[] }) {
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const unassigned = tickets.filter((t) => !t.assignee).length;
  const urgent = tickets.filter((t) => t.priority === "Urgent").length;

  const items = [
    { label: "Open Tickets", value: openCount, icon: CircleDot },
    { label: "Unassigned", value: unassigned, icon: User },
    { label: "Urgent", value: urgent, icon: AlertTriangle },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((it) => (
        <Card key={it.label} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">
              {it.label}
            </CardTitle>
            <it.icon className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{it.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}