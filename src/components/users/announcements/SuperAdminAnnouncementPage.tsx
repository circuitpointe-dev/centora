// src/components/users/announcements/SuperAdminAnnouncementPage.tsx

import * as React from "react";
import { Plus, Trash2, Eye, Edit3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Announcement,
  AUDIENCE_LABEL,
  Tenant,
  formatDateTime,
} from "./types";
import { AnnouncementViewDialog } from "./AnnouncementViewDialog";
import { AnnouncementFormDialog } from "./AnnouncementFormDialog";
import { AnnouncementSuccessDialog } from "./AnnouncementSuccessDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { StatusPill } from "./StatusPill";
import { MOCK_ANNOUNCEMENTS, MOCK_TENANTS } from "./mock/data";

const PAGE_SIZE = 10;

export default function SuperAdminAnnouncementPage() {
  const [tenants] = React.useState<Tenant[]>(MOCK_TENANTS);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);

  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewing, setViewing] = React.useState<Announcement | null>(null);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editing, setEditing] = React.useState<Announcement | null>(null);

  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successType, setSuccessType] = React.useState<"sent" | "scheduled">("sent");
  const [successAnnouncement, setSuccessAnnouncement] = React.useState<Announcement | null>(null);

  const filtered = announcements
    .filter((a) => [a.title, a.subject, a.message].join(" ").toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const paged = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [q, totalPages, page]);

  const allOnPageIds = paged.map((a) => a.id);
  const allOnPageSelected = allOnPageIds.length > 0 && allOnPageIds.every((id) => selectedIds.includes(id));

  const tenantNameResolver = (ids?: string[]) => {
    if (!ids?.length) return AUDIENCE_LABEL.specific;
    const names = ids.map((id) => tenants.find((t) => t.id === id)?.name).filter(Boolean) as string[];
    return names.length ? `${names.slice(0, 2).join(", ")}${names.length > 2 ? ` +${names.length - 2}` : ""}` : AUDIENCE_LABEL.specific;
  };

  const setSelectedOnPage = (checked: boolean) => {
    if (checked) setSelectedIds(Array.from(new Set([...selectedIds, ...allOnPageIds])));
    else setSelectedIds(selectedIds.filter((id) => !allOnPageIds.includes(id)));
  };

  const toggleRow = (id: string, checked: boolean) => {
    if (checked) setSelectedIds([...new Set([...selectedIds, id])]);
    else setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  const openView = (a: Announcement) => { setViewing(a); setViewOpen(true); };
  const openEdit = (a: Announcement) => { setEditing(a); setFormMode("edit"); setFormOpen(true); };
  const openCreate = () => { setEditing(null); setFormMode("create"); setFormOpen(true); };

  const upsertAnnouncement = (a: Announcement) => {
    setAnnouncements((prev) => {
      const idx = prev.findIndex((x) => x.id === a.id);
      if (idx === -1) return [a, ...prev];
      const copy = [...prev];
      copy[idx] = a;
      return copy;
    });
  };

  const updateStatus = (id: string, next: Partial<Announcement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...next } : a)));
    if (next.status === "sent" || next.status === "scheduled") {
      const updated = announcements.find((a) => a.id === id);
      const merged: Announcement | undefined = updated ? { ...updated, ...next } as Announcement : undefined;
      if (merged) {
        setSuccessAnnouncement(merged);
        setSuccessType(next.status);
        setSuccessOpen(true);
      }
    }
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    setAnnouncements((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    setSelectedIds([]);
    setConfirmDeleteOpen(false);
  };

  const audienceTextFor = (a: Announcement) =>
    a.audienceType === "all" ? AUDIENCE_LABEL.all : tenantNameResolver(a.tenantIds);

  return (
    <div className="space-y-6">
      {/* Title + Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Announcements</h1>
        <div className="w-full sm:w-auto flex gap-2 sm:items-center">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search announcements..."
              className="pl-8"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
            <Button
              variant="outline"
              disabled={selectedIds.length === 0}
              className="border-purple-600 text-purple-600 hover:bg-purple-50 disabled:opacity-60"
              onClick={deleteSelected}
              aria-disabled={selectedIds.length === 0}
              title={selectedIds.length === 0 ? "Select one or more rows to delete" : "Delete selected"}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allOnPageSelected}
                  onCheckedChange={(v) => setSelectedOnPage(Boolean(v))}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((a) => {
              const date = a.status === "sent" ? a.sentAt : a.status === "scheduled" ? a.scheduledAt : a.createdAt;
              return (
                <TableRow key={a.id} data-rowid={a.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(a.id)}
                      onCheckedChange={(v) => toggleRow(a.id, Boolean(v))}
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <button className="hover:underline" onClick={() => openView(a)}>
                      {a.title}
                    </button>
                  </TableCell>
                  <TableCell>{formatDateTime(date)}</TableCell>
                  <TableCell>
                    {a.audienceType === "all" ? (
                      <span>{AUDIENCE_LABEL.all}</span>
                    ) : (
                      <span title={audienceTextFor(a)}>{audienceTextFor(a)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={a.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openView(a)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => openEdit(a)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No announcements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{total === 0 ? 0 : startIdx + 1}</span> to{" "}
          <span className="font-medium">{Math.min(startIdx + PAGE_SIZE, total)}</span> of{" "}
          <span className="font-medium">{total}</span> announcements
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </span>
          <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>

      {/* View Dialog */}
      <AnnouncementViewDialog
        open={viewOpen}
        announcement={viewing}
        tenantNameResolver={tenantNameResolver}
        onClose={() => setViewOpen(false)}
        onEdit={(a) => { setViewOpen(false); openEdit(a); }}
        onUpdateStatus={(id, next) => {
          updateStatus(id, next);
          if (next.status === "sent" || next.status === "scheduled") {
            const updated = announcements.find((x) => x.id === id);
            const merged = updated ? ({ ...updated, ...next } as Announcement) : null;
            setSuccessAnnouncement(merged);
            setSuccessType(next.status);
            setSuccessOpen(true);
          }
        }}
      />

      {/* Create/Edit Dialog */}
      <AnnouncementFormDialog
        open={formOpen}
        mode={formMode}
        tenants={tenants}
        initial={editing ?? undefined}
        onClose={() => setFormOpen(false)}
        onSubmitDraft={(draft) => {
          upsertAnnouncement({ ...draft, status: "draft" as const });
        }}
        onSubmitSend={(sent) => {
          const ensured: Announcement = {
            ...sent,
            status: "sent" as const,
            sentAt: sent.sentAt ?? new Date().toISOString(),
          };
          upsertAnnouncement(ensured);
          setSuccessAnnouncement(ensured);
          setSuccessType("sent");
          setSuccessOpen(true);
        }}
        onSubmitSchedule={(scheduled) => {
          const ensured: Announcement = {
            ...scheduled,
            status: "scheduled" as const,
          };
          upsertAnnouncement(ensured);
          setSuccessAnnouncement(ensured);
          setSuccessType("scheduled");
          setSuccessOpen(true);
        }}
      />

      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        count={selectedIds.length}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
      />

      <AnnouncementSuccessDialog
        open={successOpen}
        type={successType}
        announcement={successAnnouncement}
        audienceText={successAnnouncement ? audienceTextFor(successAnnouncement) : AUDIENCE_LABEL.all}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
}
