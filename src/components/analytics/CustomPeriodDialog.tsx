
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface CustomPeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onApply: () => Promise<void>;
}

export const CustomPeriodDialog: React.FC<CustomPeriodDialogProps> = ({
  open,
  onOpenChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Select Custom Period</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Start Date
            </label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              className="rounded-md border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              End Date
            </label>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              className="rounded-md border"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onApply}
            disabled={!startDate || !endDate}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
