// src/components/support/tickets/SupportTicketsPage.tsx

import React, { useMemo, useState } from "react";
import { Ticket } from "./TicketTypes";
import { mockTickets } from "./mock/tickets";
import { TicketStatsCards } from "./TicketStatsCards";
import { TicketToolbar, FilterState } from "./TicketToolbar";
import { TicketList } from "./TicketList";
import { AddTicketDialog } from "./AddTicketDialog";
import { TicketDetailsDialog } from "./TicketDetailsDialog";

const defaultFilters: FilterState = {
  status: ["Open", "In Progress"],
  priority: [],
  category: "All",
  assignee: "All",
  tenant: "All",
};

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showAdd, setShowAdd] = useState(false);
  const [current, setCurrent] = useState<Ticket | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matches = (t: Ticket) => {
      const byQ = !q || [t.subject, t.tenantName, t.requester.name, t.requester.email].some((v) => v.toLowerCase().includes(q));
      const byStatus = filters.status.length === 0 || filters.status.includes(t.status);
      const byPriority = filters.priority.length === 0 || filters.priority.includes(t.priority);
      const byCategory = filters.category === "All" || t.category === filters.category;
      const byAssignee =
        filters.assignee === "All" ||
        (filters.assignee === "Unassigned" && !t.assignee) ||
        (t.assignee && t.assignee.name === filters.assignee);
      const byTenant = filters.tenant === "All" || t.tenantName === filters.tenant;
      return byQ && byStatus && byPriority && byCategory && byAssignee && byTenant;
    };

    // Filters apply before pagination
    return tickets.filter(matches);
  }, [tickets, query, filters]);

  const openDetails = (t: Ticket) => { setCurrent(t); setDetailsOpen(true); };

  const updateTicket = (updated: Ticket) => {
    setTickets((arr) => arr.map((t) => (t.id === updated.id ? updated : t)));
    setCurrent(updated);
  };

  const createTicket = (t: Ticket) => {
    setTickets((arr) => [t, ...arr]);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-lg font-semibold tracking-tight">Support Tickets</h1>

      <TicketStatsCards tickets={tickets} />

      <div className="flex items-center">
        <div className="flex-1">
          <TicketToolbar onSearch={setQuery} onAdd={() => setShowAdd(true)} filters={filters} onChangeFilters={setFilters} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <TicketList tickets={filtered} onOpen={openDetails} />
        </div>
      </div>

      <AddTicketDialog open={showAdd} onOpenChange={setShowAdd} onCreate={createTicket} />

      <TicketDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} ticket={current} onUpdate={updateTicket} />
    </div>
  );
}