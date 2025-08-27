// src/components/users/roles/RoleMembersDialog.tsx

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ROLE_MEMBERS, Member } from './mock/members';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

interface RoleMembersDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roleId: string | null;
  roleName: string | null;
}

export const RoleMembersDialog: React.FC<RoleMembersDialogProps> = ({ open, onOpenChange, roleId, roleName }) => {
  const [query, setQuery] = React.useState('');
  const [rows, setRows] = React.useState<Member[]>([]);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [newName, setNewName] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');

  React.useEffect(() => {
    if (open && roleId) {
      const data = ROLE_MEMBERS[roleId] ? [...ROLE_MEMBERS[roleId]] : [];
      setRows(data);
      setSelected({});
      setQuery('');
      setNewName('');
      setNewEmail('');
    }
  }, [open, roleId]);

  const filtered = rows.filter(r =>
    r.fullName.toLowerCase().includes(query.toLowerCase()) ||
    r.email.toLowerCase().includes(query.toLowerCase()) ||
    r.status.toLowerCase().includes(query.toLowerCase())
  );

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    filtered.forEach(r => { next[r.id] = checked; });
    setSelected(next);
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelected(prev => ({ ...prev, [id]: checked }));
  };

  const handleRemoveSelected = () => {
    const ids = Object.keys(selected).filter(k => selected[k]);
    if (!ids.length) return;
    setRows(prev => prev.filter(r => !ids.includes(r.id)));
    setSelected({});
    toast.success(`Removed ${ids.length} member(s) from ${roleName}.`);
  };

  const handleRemoveSingle = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
    setSelected(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    toast.success(`Removed member from ${roleName}.`);
  };

  const updateStatus = (id: string, status: Member['status']) => {
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    toast.message(`Status set to ${status}.`);
  };

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const newRow: Member = {
      id: `tmp-${Math.random().toString(36).slice(2,8)}`,
      fullName: newName.trim(),
      email: newEmail.trim(),
      status: 'Active',
    };
    setRows(prev => [newRow, ...prev]);
    setNewName('');
    setNewEmail('');
    toast.success(`Added ${newRow.fullName} to ${roleName}.`);
  };

  const handleSave = () => {
    // mock persist
    onOpenChange(false);
  };

  const StatusBadge: React.FC<{ value: Member['status'] }> = ({ value }) => (
    <Badge variant={value === 'Active' ? 'default' : 'secondary'}>{value}</Badge>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Members In {roleName}</DialogTitle>
          <DialogDescription>View and edit the users assigned to this role group.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input placeholder="Search members..." value={query} onChange={e => setQuery(e.target.value)} />
            {/* Delete button in red fonts */}
            <Button
              variant="ghost"
              onClick={handleRemoveSelected}
              disabled={!Object.values(selected).some(Boolean)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:text-red-300"
            >
              Delete Selected
            </Button>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={filtered.length > 0 && filtered.every(r => selected[r.id])}
                      onCheckedChange={v => toggleAll(Boolean(v))}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[170px]">Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Checkbox
                        checked={!!selected[r.id]}
                        onCheckedChange={v => toggleOne(r.id, Boolean(v))}
                        aria-label={`Select ${r.fullName}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{r.fullName}</TableCell>
                    <TableCell>{r.email}</TableCell>

                    {/* Inline status change */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <StatusBadge value={r.status} />
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {r.status !== 'Active' && (
                            <DropdownMenuItem onClick={() => updateStatus(r.id, 'Active')}>Activate</DropdownMenuItem>
                          )}
                          {r.status !== 'Suspended' && (
                            <DropdownMenuItem onClick={() => updateStatus(r.id, 'Suspended')}>Suspend</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    {/* Row actions incl. red Delete */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSingle(r.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      No members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="border rounded-lg p-3 grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} />
            <Input placeholder="Email Address" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">Add Member</Button>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
