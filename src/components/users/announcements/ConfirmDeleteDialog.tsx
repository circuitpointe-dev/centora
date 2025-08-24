// src/components/users/announcements/ConfirmDeleteDialog.tsx

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConfirmDeleteDialogProps {
  open: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({
  open,
  count,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    if (!open) setText("");
  }, [open]);

  const canDelete = text.trim() === "DELETE";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            This action <span className="font-semibold text-red-600">cannot be undone</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
            <div>
              You are about to permanently remove{" "}
              <span className="font-medium">{count}</span>{" "}
              {count === 1 ? "announcement" : "announcements"} from the logs.
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              To proceed, type <span className="font-mono">DELETE</span> below:
            </p>
            <Input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type DELETE to confirm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!canDelete}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
