
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Hardcoded sample staff for development (match the card)
const devStaffMetric = [
  {
    name: "Amina Yusuf",
    completed: 2,
    total: 4,
  },
  {
    name: "Fatima Bello",
    completed: 1,
    total: 3,
  },
  {
    name: "Emeka Nwankwo",
    completed: 3,
    total: 3,
  },
];

interface OpportunitiesByStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  setMonth: (n: number) => void;
  setYear: (n: number) => void;
  month: number;
  year: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const OpportunitiesByStaffDialog: React.FC<OpportunitiesByStaffDialogProps> = ({
  isOpen,
  onClose,
  month,
  year,
  setMonth,
  setYear,
}) => {
  const handleMonthChange = (inc: number) => {
    let m = month + inc;
    let y = year;
    if (m > 11) { m = 0; y++; }
    else if (m < 0) { m = 11; y--; }
    setMonth(m);
    setYear(y);
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Opportunities by Staff</DialogTitle>
        </DialogHeader>
        {/* Buttons only, no 'Month/Year:' label */}
        <div className="mb-3 flex gap-2 items-center">
          <button onClick={() => handleMonthChange(-1)} className="hover:bg-accent p-1 rounded">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="bg-gray-100 rounded px-2 py-1 text-xs">
            {MONTHS[month]} {year}
          </span>
          <button onClick={() => handleMonthChange(1)} className="hover:bg-accent p-1 rounded">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-5 max-h-72 overflow-y-auto">
          {devStaffMetric.map((s) => (
            <div key={s.name} className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">{s.name}</span>
                <span className="text-sm text-gray-500">{s.completed}/{s.total} completed opportunities</span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2 overflow-hidden">
                <div
                  className="bg-violet-500 h-2 rounded"
                  style={{
                    width: s.total > 0 ? `${Math.round((s.completed / s.total) * 100)}%` : "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-end">
          <Button
            variant="default"
            onClick={() => {
              alert("Download not implemented in demo");
            }}
            className="mt-2"
          >
            Download Report (PDF)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunitiesByStaffDialog;
