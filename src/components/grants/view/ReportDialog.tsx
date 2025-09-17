import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GrantReport } from "@/types/grants";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report?: GrantReport | null;
  onSave: (report: Omit<GrantReport, 'id' | 'grant_id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  report,
  onSave,
}) => {
  const [reportType, setReportType] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [status, setStatus] = useState<'upcoming' | 'in_progress' | 'submitted' | 'overdue'>('upcoming');
  const [submitted, setSubmitted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState<Date>();

  const isEditing = !!report;

  useEffect(() => {
    if (report) {
      setReportType(report.report_type);
      setDueDate(new Date(report.due_date));
      setStatus(report.status);
      setSubmitted(report.submitted || false);
      setSubmittedDate(report.submitted_date ? new Date(report.submitted_date) : undefined);
    } else {
      setReportType("");
      setDueDate(undefined);
      setStatus('upcoming');
      setSubmitted(false);
      setSubmittedDate(undefined);
    }
  }, [report, open]);

  const handleSave = () => {
    if (!reportType || !dueDate) return;

    onSave({
      report_type: reportType,
      due_date: format(dueDate, "yyyy-MM-dd"),
      status,
      submitted,
      submitted_date: submittedDate ? format(submittedDate, "yyyy-MM-dd") : undefined,
      file_name: undefined,
      file_path: undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {isEditing ? "Edit Report" : "Add New Report"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reportType" className="text-gray-700">
              Report Type
            </Label>
            <Input
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              placeholder="Enter report type (e.g., Quarterly, Annual)"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-300",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Status</Label>
            <Select value={status} onValueChange={(value: 'upcoming' | 'in_progress' | 'submitted' | 'overdue') => setStatus(value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === 'submitted' && (
            <div className="space-y-2">
              <Label className="text-gray-700">Submitted Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300",
                      !submittedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {submittedDate ? format(submittedDate, "PPP") : <span>Pick submitted date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={submittedDate}
                    onSelect={setSubmittedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!reportType || !dueDate || (status === 'submitted' && !submittedDate)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isEditing ? "Update Report" : "Add Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};