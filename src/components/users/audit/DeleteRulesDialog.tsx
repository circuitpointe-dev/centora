// src/components/users/audit/DeleteRulesDialog.tsx

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  count: number;
  onConfirm: () => void;
  onOpenChange: (v: boolean) => void;
};

export const DeleteRulesDialog: React.FC<Props> = ({ open, count, onConfirm, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Delete {count} Rule{count !== 1 ? "s" : ""}?</DialogTitle>
          <DialogDescription>
            This is permanent and cannot be undone. Affected alerts will stop immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
