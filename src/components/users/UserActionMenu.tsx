import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Edit, UserCheck, UserX } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  modules: string[];
  roles: string[];
  status: 'active' | 'inactive' | 'deactivated';
  lastActive: string;
  joinedDate: string;
}

interface UserActionMenuProps {
  user: User;
}

export const UserActionMenu: React.FC<UserActionMenuProps> = ({ user }) => {
  const handleViewUser = () => {
    console.log('View user:', user.id);
  };

  const handleEditUser = () => {
    console.log('Edit user:', user.id);
  };

  const handleToggleStatus = () => {
    console.log('Toggle status for user:', user.id);
  };

  const getToggleAction = () => {
    if (user.status === 'active') {
      return {
        icon: UserX,
        label: 'Deactivate',
      };
    } else {
      return {
        icon: UserCheck,
        label: 'Activate',
      };
    }
  };

  const toggleAction = getToggleAction();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleViewUser}>
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditUser}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleStatus}>
          <toggleAction.icon className="mr-2 h-4 w-4" />
          {toggleAction.label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};