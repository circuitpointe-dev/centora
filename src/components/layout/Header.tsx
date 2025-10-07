
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/contexts/ThemeContext";
import { Checkbox } from "@/components/ui/checkbox";
import UserProfileDialog from "./UserProfileDialog";
import SettingsDialog from "./SettingsDialog";
import NotificationDropdown from "./NotificationDropdown";
import AnnouncementDropdown from "./AnnouncementDropdown";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header = ({ sidebarCollapsed }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { profile } = useProfile();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [showProfileDialog, setShowProfileDialog] = React.useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = React.useState(false);
  const [isFontSizeOpen, setIsFontSizeOpen] = React.useState(false);

  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    alwaysShowCaptions,
    setAlwaysShowCaptions,
    useDyslexiaFriendlyFont,
    setUseDyslexiaFriendlyFont,
  } = useTheme();

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ] as const;

  // User data from profile hook or auth context fallback
  const currentUser = {
    name: profile?.full_name || user?.name || "User",
    email: profile?.email || user?.email || "user@example.com", 
    phone: profile?.phone || "+234 802 123 4567",
    avatar: profile?.avatar_url || "",
  };

  const handleLogout = () => {
    // Call auth context logout which handles localStorage cleanup
    logout();

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    // Navigate to login page
    navigate("/login", { replace: true });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode.`,
    });
  };

  const handleFontSizeChange = (newSize: 'small' | 'medium' | 'large') => {
    setFontSize(newSize);
    setIsFontSizeOpen(false);
    toast({
      title: "Font Size Updated",
      description: `Font size changed to ${newSize}.`,
    });
  };

  const handleAccessibilityChange = (setting: string, value: boolean) => {
    if (setting === 'captions') {
      setAlwaysShowCaptions(value);
    } else if (setting === 'dyslexia') {
      setUseDyslexiaFriendlyFont(value);
    }
    
    toast({
      title: "Accessibility Setting Updated",
      description: `${setting === 'captions' ? 'Captions' : 'Dyslexia-friendly font'} ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <>
      <header
        className={cn(
          "bg-background border-b border-border px-6 py-3 flex items-center justify-between shadow-sm transition-all duration-300 fixed top-0 z-20 h-16",
          // Responsive positioning: full width on mobile, respect sidebar on desktop
          "left-0 right-0",
          "md:left-16",
          !sidebarCollapsed && "lg:left-64"
        )}
      >
        {/* Welcome Message - Hidden on mobile */}
        <div className="hidden md:flex items-center">
          <h3 className="text-md text-muted-foreground">
            Welcome,{" "}
            <span className="text-md text-muted-foreground">
              {currentUser.name} of {" "}
            </span>
            <span className="font-semibold text-foreground">
              {user?.organization || "Your Organization"}
            </span>
          </h3>
        </div>

        {/* Right Side - Announcements, Notifications and User Menu */}
        <div className="flex items-center space-x-4 ml-auto md:ml-0">
          {/* Announcements */}
          <AnnouncementDropdown />
          
          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 h-8 rounded-full hover:bg-transparent"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={currentUser.avatar ? `${currentUser.avatar}?t=${Date.now()}` : undefined} 
                    alt={currentUser.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 bg-white dark:bg-gray-800"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.name}
                  </p>
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
              
              {/* Theme Toggle */}
              <div className="px-2 py-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mode</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${theme === 'light' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                      Light
                    </span>
                    <button
                      onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${
                          theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                      Dark
                    </span>
                  </div>
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="px-2 py-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Font size</span>
                  <div className="relative">
                    <button
                      onClick={() => setIsFontSizeOpen(!isFontSizeOpen)}
                      className="flex items-center space-x-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <span className="text-xs">
                        {fontSizes.find(f => f.value === fontSize)?.label}
                      </span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>
                    
                    {isFontSizeOpen && (
                      <div className="absolute z-10 right-0 mt-1 w-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
                        {fontSizes.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => handleFontSizeChange(size.value)}
                            className="w-full px-2 py-1 text-left hover:bg-gray-50 dark:hover:bg-gray-600 focus:bg-gray-50 dark:focus:bg-gray-600 focus:outline-none text-xs"
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Accessibility Options */}
              <div className="px-2 py-1.5 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="captions"
                    checked={alwaysShowCaptions}
                    onCheckedChange={(checked) => handleAccessibilityChange('captions', checked as boolean)}
                    className="h-3 w-3"
                  />
                  <label htmlFor="captions" className="text-xs cursor-pointer">
                    Always show captions
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dyslexia"
                    checked={useDyslexiaFriendlyFont}
                    onCheckedChange={(checked) => handleAccessibilityChange('dyslexia', checked as boolean)}
                    className="h-3 w-3"
                  />
                  <label htmlFor="dyslexia" className="text-xs cursor-pointer">
                    Use dyslexia-friendly font
                  </label>
                </div>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 focus:bg-red-100 dark:focus:bg-red-900/30 focus:text-red-700 dark:focus:text-red-300"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
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
