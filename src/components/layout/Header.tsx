
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import UserProfileDialog from "./UserProfileDialog";
import SettingsDialog from "./SettingsDialog";
import NotificationDropdown from "./NotificationDropdown";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header = ({ sidebarCollapsed }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [showProfileDialog, setShowProfileDialog] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);

  // Mock user data - in real app this would come from auth context
  const currentUser = {
    name: user?.name || "Chioma Ike",
    email: user?.email || "chioma.ike@ngo.org",
    phone: "+234 802 123 4567",
    avatar: ""
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userModules");

    // Call auth context logout
    logout();

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <>
      <header className={cn(
        "bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm transition-all duration-300 fixed top-0 z-20 h-16",
        // On mobile, take full width. On desktop, respect sidebar state
        "left-0 right-0 md:left-16 lg:left-64",
        sidebarCollapsed ? "md:left-16" : "md:left-16 lg:left-64"
      )}>
        {/* Welcome Message - Hidden on mobile */}
        <div className="hidden md:flex items-center">
          <h2 className="text-xs text-gray-700">
            Welcome, <span className="font-semibold text-gray-900">{currentUser.name}</span>
          </h2>
        </div>

        {/* Right Side - Notifications and User Menu */}
        <div className="flex items-center space-x-4 ml-auto md:ml-0">
          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 h-8 rounded-full hover:bg-transparent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setShowProfileDialog(true)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setShowSettingsDialog(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 hover:text-black focus:bg-red-100 focus:text-black"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You'll need to log back in to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      {/* Profile Dialog */}
      <UserProfileDialog
        isOpen={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
        user={currentUser}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
      />
    </>
  );
};

export default Header;
