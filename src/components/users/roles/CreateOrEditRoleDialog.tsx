// src/components/users/roles/CreateOrEditRoleDialog.tsx

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RoleMeta, RoleType, makeRoleId } from './types';
import { toast } from 'sonner';

interface CreateOrEditRoleDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  /** If provided, dialog works in "edit" mode for this role */
  editingRole?: RoleMeta | null;

  /** Called with the newly created role (create mode) */
  onCreate?: (role: { name: string; description: string; type: RoleType }) => void;

  /** Called with the renamed/edited role (edit mode) */
  onUpdate?: (role: { id: string; name: string; description: string; type: RoleType }) => void;

  /** Existing names for basic uniqueness check (case-insensitive) within each type */
  existingNamesByType?: Record<RoleType, string[]>;
}

export const CreateOrEditRoleDialog: React.FC<CreateOrEditRoleDialogProps> = ({
  open,
  onOpenChange,
  editingRole = null,
  onCreate,
  onUpdate,
  existingNamesByType = { system: [], client: [] },
}) => {
  const isEdit = !!editingRole;

  const [name, setName] = React.useState(editingRole?.name ?? '');
  const [desc, setDesc] = React.useState(editingRole?.description ?? '');
  const [type, setType] = React.useState<RoleType>(editingRole?.type ?? 'system');

  React.useEffect(() => {
    if (open) {
      setName(editingRole?.name ?? '');
      setDesc(editingRole?.description ?? '');
      setType(editingRole?.type ?? 'system');
    }
  }, [open, editingRole]);

  const nameTaken = React.useMemo(() => {
    const list = existingNamesByType[type] || [];
    const candidate = name.trim().toLowerCase();
    if (!candidate) return false;
    if (isEdit && editingRole && editingRole.name.toLowerCase() === candidate) return false;
    return list.map(s => s.toLowerCase()).includes(candidate);
  }, [name, type, existingNamesByType, isEdit, editingRole]);

  const canSubmit = name.trim().length >= 3 && !nameTaken;

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (isEdit && editingRole && onUpdate) {
      const updated = { 
        id: editingRole.id, 
        name: name.trim(), 
        description: desc.trim(),
        type: editingRole.type
      };
      onUpdate(updated);
      toast.success('Role updated.');
      onOpenChange(false);
      return;
    }

    if (!isEdit && onCreate) {
      const role = {
        name: name.trim(),
        description: desc.trim() || (type === 'system' ? 'Custom System Role' : 'Custom Client Role'),
        type,
      };
      onCreate(role);
      toast.success('Role created.');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Rename Role' : 'Create Role'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the display name and description of this role.'
              : 'Add a new role for System or Client scope. You can set permissions and members after creating.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isEdit && (
            <div className="space-y-2">
              <Label>Role Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(v) => setType(v as RoleType)}
                className="grid grid-cols-2 gap-2"
              >
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <RadioGroupItem value="system" id="type-system" />
                  <Label htmlFor="type-system" className="cursor-pointer">System</Label>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <RadioGroupItem value="client" id="type-client" />
                  <Label htmlFor="type-client" className="cursor-pointer">Client</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEdit ? 'Enter new role name' : 'e.g., Data Auditor'}
            />
            {nameTaken && (
              <p className="text-xs text-red-600">A role with this name already exists for the selected type.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Short description to help others understand this role"
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmit} disabled={!canSubmit}>
            {isEdit ? 'Save Changes' : 'Create Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
