import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GrantDisbursement } from "@/types/grants";

interface DisbursementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disbursement?: GrantDisbursement | null;
  onSave: (disbursement: Omit<GrantDisbursement, 'id' | 'grant_id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
}

export const DisbursementDialog: React.FC<DisbursementDialogProps> = ({
  open,
  onOpenChange,
  disbursement,
  onSave,
}) => {
  const [milestone, setMilestone] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [disbursedOn, setDisbursedOn] = useState<Date>();
  const [isReleased, setIsReleased] = useState(false);

  const isEditing = !!disbursement;

  useEffect(() => {
    if (disbursement) {
      setMilestone(disbursement.milestone);
      setAmount(disbursement.amount.toString());
      setDueDate(new Date(disbursement.due_date));
      setDisbursedOn(disbursement.disbursed_on ? new Date(disbursement.disbursed_on) : undefined);
      setIsReleased(disbursement.status === 'released');
    } else {
      setMilestone("");
      setAmount("");
      setDueDate(undefined);
      setDisbursedOn(undefined);
      setIsReleased(false);
    }
  }, [disbursement, open]);

  const handleSave = () => {
    if (!milestone || !amount || !dueDate) return;

    onSave({
      milestone,
      amount: parseFloat(amount),
      currency: 'USD',
      due_date: format(dueDate, "yyyy-MM-dd"),
      disbursed_on: disbursedOn ? format(disbursedOn, "yyyy-MM-dd") : undefined,
      status: isReleased ? 'released' : 'pending',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {isEditing ? "Edit Disbursement Milestone" : "Add New Disbursement Milestone"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="milestone" className="text-gray-700">
              Milestone
            </Label>
            <Input
              id="milestone"
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              placeholder="Enter milestone name"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700">
              Amount to be Disbursed
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
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

          {isReleased && (
            <div className="space-y-2">
              <Label className="text-gray-700">Disbursed On</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300",
                      !disbursedOn && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {disbursedOn ? format(disbursedOn, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={disbursedOn}
                    onSelect={setDisbursedOn}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="released"
              checked={isReleased}
              onCheckedChange={(checked) => setIsReleased(checked as boolean)}
            />
            <Label htmlFor="released" className="text-gray-700">
              Mark as Released
            </Label>
          </div>
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
            disabled={!milestone || !amount || !dueDate || (isReleased && !disbursedOn)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Save Milestone
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};