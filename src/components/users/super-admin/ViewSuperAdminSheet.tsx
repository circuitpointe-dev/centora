// src/components/users/super-admin/ViewSuperAdminSheet.tsx
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import type { SuperAdminUser } from "./types";
import { UserStatusPill } from "./UserStatusPill";

export function ViewSuperAdminSheet({
  user,
  open,
  onOpenChange,
}: {
  user: SuperAdminUser | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[460px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            View Super Admin
          </SheetTitle>
        </SheetHeader>
        {!user ? (
          <div className="mt-6 text-sm text-muted-foreground">No User Selected.</div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Full Name</div>
              <div className="text-sm">{user.fullName}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Email</div>
              <div className="text-sm">{user.email}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Role</div>
                <div className="text-sm">{user.role}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Status</div>
                <div className="mt-1"><UserStatusPill status={user.status} /></div>
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-xs uppercase text-muted-foreground">Last Login</div>
              <div className="text-sm">
                {new Date(user.lastLoginAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
