
import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; date: Date; type: string; assignedTo: string }) => void;
  staffData: Array<{ name: string; title: string }>;
}

const reminderTypes = [
  "General",
  "Deadline",
  "Submission",
  "Meeting"
];

const AddReminderDialog: React.FC<Props> = ({ open, onOpenChange, onSubmit, staffData }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [type, setType] = useState(reminderTypes[0]);
  const [assignedTo, setAssignedTo] = useState<string>(staffData.length ? staffData[0].name : "");

  function handleAdd() {
    if (title && date) {
      onSubmit({ title, date, type, assignedTo });
      setTitle(""); setDate(undefined);
      setType(reminderTypes[0]); setAssignedTo(staffData.length ? staffData[0].name : "");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white text-black relative">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Add Reminder</div>
          <DialogClose aria-label="Close" className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="flex flex-col gap-4 mt-2 mb-1">
          {/* Title */}
          <div>
            <label className="block mb-1.5 text-[15px] font-medium">Reminder Title</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={50}
            />
          </div>
          {/* Date & Type */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1.5 text-[15px] font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      "w-full justify-start text-left font-normal" +
                      (!date ? " text-muted-foreground" : "")
                    }
                  >
                    <CalendarIcon size={16} className="mr-2 opacity-60" />
                    {date ? (
                      date.toLocaleDateString("en-GB")
                    ) : (
                      <span>dd/mm/yyyy</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="block mb-1.5 text-[15px] font-medium">Reminder Type</label>
              <select className="w-full border rounded px-3 py-2 text-sm"
                value={type} onChange={e => setType(e.target.value)}>
                {reminderTypes.map((t) =>
                  <option key={t}>{t}</option>
                )}
              </select>
            </div>
          </div>
          {/* Assigned To */}
          <div>
            <label className="block mb-1.5 text-[15px] font-medium">Assigned To</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
            >
              {staffData.map(staff =>
                <option key={staff.name} value={staff.name}>
                  {staff.name} ({staff.title})
                </option>
              )}
            </select>
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-4">
          <Button onClick={handleAdd} className="px-8">Add Reminder</Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddReminderDialog;
