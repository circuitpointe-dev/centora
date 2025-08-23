// src/components/users/UserActionMenu.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Eye, Edit, UserCheck, UserX } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle } from "@/components/ui/side-dialog";
import { UserProfilePanel } from "./UserProfilePanel";
import { useMockUsers } from "@/components/users/users/mock/MockUsersProvider";

interface User {
  id: string;
  full_name: string;
  email: string;
  status: "active" | "inactive" | "deactivated";
  department: string;
  modules: string[];
  roles: string[];
}

interface UserActionMenuProps {
  user: User;
}

export const UserActionMenu: React.FC<UserActionMenuProps> = ({ user }) => {
  const { updateUser } = useMockUsers();

  const [openSheet, setOpenSheet] = React.useState<false | "view" | "edit">(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const isActive = user.status === "active";
  const ToggleIcon = isActive ? UserX : UserCheck;
  const toggleLabel = isActive ? "Deactivate" : "Activate";

  const handleToggleStatus = () => setOpenConfirm(true);

  const applyToggle = () => {
    const nextStatus: User["status"] = isActive ? "deactivated" : "active";
    updateUser({ ...user, status: nextStatus });
    setOpenConfirm(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setOpenSheet("view")}>
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenSheet("edit")}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            <ToggleIcon className="mr-2 h-4 w-4" />
            {toggleLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Side panel for View/Edit */}
      <SideDialog open={Boolean(openSheet)} onOpenChange={(o) => setOpenSheet(o ? openSheet : false)}>
        <SideDialogContent className="w-full sm:w-[720px]" aria-describedby="user-profile-panel-desc">
          <p id="user-profile-panel-desc" className="sr-only">
            View and edit the user profile information and access settings.
          </p>
          <SideDialogHeader>
            <SideDialogTitle>{openSheet === "edit" ? "Edit User" : "User Profile"}</SideDialogTitle>
          </SideDialogHeader>

          {openSheet && (
            <UserProfilePanel
              mode={openSheet}
              user={user}
              onClose={() => setOpenSheet(false)}
            />
          )}
        </SideDialogContent>
      </SideDialog>

      {/* Confirm Activate/Deactivate */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{toggleLabel} user?</AlertDialogTitle>
            <AlertDialogDescription>
              {isActive
                ? "This will deactivate the user. They will lose access immediately."
                : "This will activate the user and restore access."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={isActive ? "bg-red-600 hover:bg-red-700 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}
              onClick={applyToggle}
            >
              {toggleLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
