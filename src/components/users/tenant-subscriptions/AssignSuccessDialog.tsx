// src/components/users/tenants-subscriptions/AssignSuccessDialog.tsx

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AssignSuccessDialog({
  open,
  onOpenChange,
  message,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  message: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-4">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-base">Plan Assigned</DialogTitle>
        </DialogHeader>
        <div className="text-sm">{message}</div>
        <div className="flex justify-end">
          <Button className="h-8 bg-purple-600 hover:bg-purple-700 active:bg-purple-800" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
