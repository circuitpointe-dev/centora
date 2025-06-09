
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Settings, LogOut, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import NotificationDropdown from './NotificationDropdown';
import SettingsDialog from './SettingsDialog';
import UserProfileDialog from './UserProfileDialog';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  onMobileSidebarToggle?: () => void;
}

const Header = ({ sidebarCollapsed = false, onMobileSidebarToggle }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutConfirmOpen(false);
  };

  // Get user initials from name
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className={`flex items-center space-x-4 transition-all duration-300 ${
          // Mobile: no left margin, Desktop: responsive to sidebar state
          'ml-0 md:ml-16'
        } ${!sidebarCollapsed ? 'lg:ml-64' : ''}`}>
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileSidebarToggle}
            className="h-8 w-8 p-0 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Welcome message - hidden on small screens */}
          {user?.name && (
            <div className="hidden sm:block">
              <span className="text-gray-600">Welcome, </span>
              <span className="font-semibold">{user.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationDropdown />
          
          {/* Settings */}
          <Button 
            variant="ghost" 
            className="h-8 w-8 rounded-full"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dialogs */}
      <SettingsDialog 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
      
      {user && (
        <UserProfileDialog 
          isOpen={profileOpen} 
          onClose={() => setProfileOpen(false)}
          user={{
            name: user.name,
            email: user.email,
            phone: '', // Default empty phone
            avatar: '' // Default empty avatar
          }}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title="Confirm Logout"
        description="Are you sure you want to log out? You will need to sign in again to access your account."
        onConfirm={confirmLogout}
        confirmText="Log out"
        cancelText="Cancel"
      />
    </>
  );
};

export default Header;
