// src/components/users/super-admin/ResetPasswordDialog.tsx
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { SuperAdminUser } from "./types";

const BRAND_PURPLE = "bg-purple-600 hover:bg-purple-700 active:bg-purple-800";

export function ResetPasswordDialog({
  user,
  open,
  onOpenChange,
}: {
  user: SuperAdminUser | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!open) setSuccess(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Send A Password Reset Link To This Super Admin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">Recipient</div>
              <div className="rounded border bg-muted/30 px-3 py-2">
                {user?.email ?? "No User"}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                className={BRAND_PURPLE}
                onClick={() => {
                  // simulate sending
                  setTimeout(() => setSuccess(true), 400);
                }}
              >
                Send Reset Link
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center py-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <div className="mt-3 text-lg font-semibold">Reset Email Sent</div>
              <div className="mt-1 text-center text-sm text-muted-foreground">
                A Password Reset Link Has Been Sent To <b>{user?.email}</b>.
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className={BRAND_PURPLE}>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
