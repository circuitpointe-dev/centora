
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lock, Users, UserCheck, Eye, Edit, Trash2 } from 'lucide-react';
import { Document } from './data';
import { useToast } from '@/components/ui/use-toast';

interface Permission {
  group: string;
  permission: string;
  icon: React.ReactNode;
  isDefault?: boolean;
}

interface EditPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
  initialPermissions: Permission[];
  onSave: (permissions: Permission[]) => void;
}

const permissionOptions = [
  { value: 'view', label: 'View Only', icon: <Eye className="w-4 h-4" /> },
  { value: 'edit', label: 'Edit', icon: <Edit className="w-4 h-4" /> },
  { value: 'admin', label: 'Admin', icon: <UserCheck className="w-4 h-4" /> },
];

const EditPermissionsDialog = ({ 
  open, 
  onOpenChange, 
  document, 
  initialPermissions, 
  onSave 
}: EditPermissionsDialogProps) => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const { toast } = useToast();

  const handlePermissionChange = (groupIndex: number, newPermission: string) => {
    const updatedPermissions = permissions.map((perm, index) => {
      if (index === groupIndex) {
        return {
          ...perm,
          permission: permissionOptions.find(opt => opt.value === newPermission)?.label || newPermission
        };
      }
      return perm;
    });
    setPermissions(updatedPermissions);
  };

  const handleRemovePermission = (groupIndex: number) => {
    const updatedPermissions = permissions.filter((_, index) => index !== groupIndex);
    setPermissions(updatedPermissions);
  };

  const handleAddGroup = () => {
    const newPermission: Permission = {
      group: 'External Users',
      permission: 'View Only',
      icon: <Users className="w-5 h-5 text-gray-500" />
    };
    setPermissions([...permissions, newPermission]);
  };

  const handleSave = () => {
    onSave(permissions);
    toast({
      title: "Permissions Updated",
      description: `Permissions for "${document.fileName}" have been updated successfully.`,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setPermissions(initialPermissions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white border border-gray-200">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Edit Permissions
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Manage access permissions for "{document.fileName}"
          </p>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {permissions.map((perm, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {perm.icon}
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {perm.group}
                  </div>
                  {perm.isDefault && (
                    <div className="text-xs text-gray-500">
                      Default department access
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select
                  value={permissionOptions.find(opt => opt.label === perm.permission)?.value || 'view'}
                  onValueChange={(value) => handlePermissionChange(index, value)}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {permissionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span className="hover:text-gray-900">{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {!perm.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemovePermission(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleAddGroup}
            className="border-gray-300 text-gray-700"
          >
            Add Group
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPermissionsDialog;
