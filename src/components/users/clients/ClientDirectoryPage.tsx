// src/components/users/clients/ClientDirectoryPage.tsx

import React from 'react';
import { ClientTableToolbar } from './ClientTableToolbar';
import { ClientTable } from './ClientTable';
import { AddClientDialog } from './AddClientDialog';
import { ClientDetailsDialog } from './ClientDetailsDialog';
import { ClientActivityLogDialog } from './ClientActivityLogDialog';
import { MOCK_CLIENTS, MOCK_ACTIVITIES } from './mock/clients';
import type { Client } from './types';

export default function ClientDirectoryPage() {
  const [clients, setClients] = React.useState<Client[]>(MOCK_CLIENTS);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const [addOpen, setAddOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [activityOpen, setActivityOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Client | null>(null);

  const openView = (c: Client) => {
    setSelected(c);
    setDetailsOpen(true);
  };

  const handleCreate = (c: Client) => setClients((prev) => [c, ...prev]);
  const handleUpdate = (c: Client) => setClients((prev) => prev.map((x) => (x.id === c.id ? c : x)));
  const handleDelete = (id: string) => setClients((prev) => prev.filter((x) => x.id !== id));
  const handleToggleStatus = (id: string) =>
    setClients((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: x.status === 'active' ? 'suspended' : 'active' } : x)),
    );

  return (
    <div className="p-6 space-y-6">
      <ClientTableToolbar
        search={search}
        setSearch={setSearch}
        onOpenAdd={() => setAddOpen(true)}
        onOpenFilter={() => alert('Filter drawer TBD')}
      />

      <ClientTable
        clients={clients}
        search={search}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onView={openView}
      />

      {/* Add Dialog */}
      <AddClientDialog open={addOpen} onOpenChange={setAddOpen} onCreate={handleCreate} />

      {/* Details Dialog */}
      <ClientDetailsDialog
        open={detailsOpen}
        client={selected}
        onOpenChange={setDetailsOpen}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onOpenActivity={(c) => {
          setSelected(c);
          setActivityOpen(true);
        }}
      />

      {/* Activity Log Dialog */}
      <ClientActivityLogDialog
        open={activityOpen}
        onOpenChange={setActivityOpen}
        client={selected}
        activities={MOCK_ACTIVITIES}
      />
    </div>
  );
}
