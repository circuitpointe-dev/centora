// src/components/users/roles/RolePermissionsDialog.tsx

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { MODULES, PermissionMatrix, Crud } from './mock/roles';

interface RolePermissionsDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  roleId: string | null;
  roleName: string | null;
}

const DEFAULT_CRUD: Record<Crud, boolean> = { create: false, read: true, update: false, delete: false };

export const RolePermissionsDialog: React.FC<RolePermissionsDialogProps> = ({ open, onOpenChange, roleId, roleName }) => {
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>({});
  const [matrix, setMatrix] = React.useState<PermissionMatrix>({});

  React.useEffect(() => {
    if (open) {
      // seed mock state per open
      const initEnabled: Record<string, boolean> = {};
      const initMatrix: PermissionMatrix = {};
      MODULES.forEach(m => {
        initEnabled[m.key] = m.key === 'users' || m.key === 'reports'; // just a mock default
        initMatrix[m.key] = { ...DEFAULT_CRUD, read: true };
      });
      setEnabled(initEnabled);
      setMatrix(initMatrix);
    }
  }, [open]);

  const toggleModule = (key: string, next: boolean) => {
    setEnabled(prev => ({ ...prev, [key]: next }));
  };

  const toggleCrud = (key: string, c: Crud, next: boolean) => {
    setMatrix(prev => ({ ...prev, [key]: { ...prev[key], [c]: next } }));
  };

  const handleSave = () => {
    // mock persist
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Set Permissions</DialogTitle>
          <DialogDescription>Configure module access and CRUD for <span className="font-medium">{roleName}</span>.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-12 gap-3 text-sm font-medium text-muted-foreground mb-2">
            <div className="col-span-5">Module</div>
            <div className="col-span-2 text-center">Enabled</div>
            <div className="col-span-5 grid grid-cols-4 text-center gap-2">
              <div>Create</div><div>Read</div><div>Update</div><div>Delete</div>
            </div>
          </div>
          <div className="space-y-2">
            {MODULES.map(m => (
              <div key={m.key} className="grid grid-cols-12 items-center gap-3 rounded-lg border px-3 py-2">
                <div className="col-span-5">
                  <div className="font-medium">{m.label}</div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <Switch checked={!!enabled[m.key]} onCheckedChange={(v) => toggleModule(m.key, Boolean(v))} className="data-[state=checked]:bg-purple-600" />
                </div>
                <div className="col-span-5 grid grid-cols-4 gap-2">
                  {(['create','read','update','delete'] as Crud[]).map(c => (
                    <div key={c} className="flex items-center justify-center gap-2">
                      <Checkbox
                        checked={!!matrix[m.key]?.[c]}
                        onCheckedChange={(v) => toggleCrud(m.key, c, Boolean(v))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
