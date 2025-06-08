import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Filter, Plus, Download, MoreVertical, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { staffData } from "@/components/opportunity-tracking/staffData";
import AddReminderDialog from "./AddReminderDialog";
import ReminderDotMenu from "./ReminderDotMenu";
import MonthButton from "./MonthButton";
import { format } from "date-fns";

interface Reminder {
  id: string;
  title: string;
  date: Date;
  type: string;
  assignedTo: string;
  completed: boolean;
}

// Sample colored reminders for calendar
const calendarReminders: Array<{date: Date; label: string; color: string}> = [
  {date: new Date(2025, 4, 1), label: "Project Alpha Submission", color: "#B8D0FF"},   // blue
  {date: new Date(2025, 4, 3), label: "Grant Deadline", color: "#D1FFD8"},           // green
  {date: new Date(2025, 4, 6), label: "Grant Deadline", color: "#F5E2FF"},           // purple
  {date: new Date(2025, 4, 6), label: "UNICEF Proposal Submission", color: "#F5E2FF"},
  {date: new Date(2025, 4, 14), label: "Clean Water for All Initiative", color: "#B8D0FF"}, 
  {date: new Date(2025, 4, 19), label: "Agricultural Innovation Grant", color: "#D1FFD8"},
  {date: new Date(2025, 4, 29), label: "Nutrition Support Program", color: "#F5E2FF"},
];

const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "Submit Final Draft",
    date: new Date(),
    type: "General",
    assignedTo: staffData[0].name,
    completed: false,
  },
  {
    id: "2",
    title: "Grant Application Due",
    date: new Date(),
    type: "Deadline",
    assignedTo: staffData[1].name,
    completed: true,
  },
  {
    id: "3",
    title: "Submit Final Draft",
    date: new Date(),
    type: "General",
    assignedTo: staffData[1].name,
    completed: false,
  },
  {
    id: "4",
    title: "Submit Final Draft",
    date: new Date(),
    type: "General",
    assignedTo: staffData[3].name,
    completed: false,
  },
  {
    id: "5",
    title: "Submit Final Draft",
    date: new Date(),
    type: "General",
    assignedTo: staffData[0].name,
    completed: false,
  },
];

function getCalendarDays(centerDate: Date) {
  const year = centerDate.getFullYear();
  const month = centerDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const days: Date[] = [];

  // Fill in until first day
  let dayOfGrid = new Date(year, month, 1 - startDay);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(dayOfGrid));
    dayOfGrid.setDate(dayOfGrid.getDate() + 1);
  }
  return days;
}

const reminderTypes = [
  "General",
  "Deadline",
  "Submission",
  "Meeting"
];

const ProposalCalendarTab: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 4)); // May 2025
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filtering (not functional, demo UI only)
  const [selectedType, setSelectedType] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  function handleChangeMonth(offset: number) {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  function handleAddReminder(data: Omit<Reminder, "id" | "completed">) {
    setReminders([
      ...reminders,
      {
        ...data,
        id: Date.now().toString(),
        completed: false
      }
    ]);
    setAddDialogOpen(false);
  }

  function handleEditReminder(id: string, update: Partial<Reminder>) {
    setReminders(reminders.map(r => r.id === id ? {...r, ...update} : r));
  }

  function handleDeleteReminder(id: string) {
    setReminders(reminders.filter(r => r.id !== id));
  }

  function handleToggleReminder(id: string) {
    setReminders(reminders.map(r => r.id === id ? {...r, completed: !r.completed} : r));
  }

  function handleExport() {
    // Demo: logic would trigger download of reminders as CSV for instance
    alert("Exported reminders! (Demo logic)");
  }

  // Calendar grid populated with all reminders for that date
  const gridDays = getCalendarDays(selectedDate);
  const remindersByDateMap: {[key:string]: Reminder[]} = {};
  for (const reminder of reminders) {
    const key = reminder.date.toDateString();
    if (!remindersByDateMap[key]) remindersByDateMap[key] = [];
    remindersByDateMap[key].push(reminder);
  }

  // Calendar sidebar reminders, sorted by date, most recent first
  const sortedReminders = reminders.slice().sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="flex w-full gap-6 pt-4">
      {/* Main Calendar area */}
      <div className="flex-1 max-w-4xl bg-white rounded-2xl shadow p-6">
        {/* Top controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleChangeMonth(-1)}>
              <ArrowLeft size={18} />
            </Button>
            <span className="font-semibold text-base mx-2">
              {format(selectedDate, "MMMM yyyy")}
            </span>
            <Button variant="ghost" size="icon" onClick={() => handleChangeMonth(1)}>
              <ArrowRight size={18} />
            </Button>
            <span className="mx-4 text-gray-400 hidden md:inline">|</span>
            {/* MONTH BUTTON with magnifying glass */}
            <MonthButton />
          </div>
          {/* Right-side action buttons */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-60">
                <div className="mb-2 text-sm font-semibold">Filter Reminders</div>
                <div className="mb-2">
                  <div className="text-xs mb-1">Reminder Type</div>
                  <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-xs bg-background">
                    <option value="">All</option>
                    {reminderTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-xs mb-1">Assigned To</div>
                  <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-xs bg-background">
                    <option value="">All</option>
                    {staffData.map(staff =>
                      <option key={staff.name} value={staff.name}>{staff.name}</option>
                    )}
                  </select>
                </div>
              </PopoverContent>
            </Popover>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setAddDialogOpen(true)}>
              <Plus size={16} /> Add Reminder
            </Button>
            {/* Removed Sync button as discussed */}
            <Button size="sm" variant="outline" className="gap-2" onClick={handleExport}>
              <Download size={16} /> Export
            </Button>
          </div>
        </div>

        {/* Day name header row */}
        <div className="grid grid-cols-7 mb-2 pt-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-xs font-medium text-gray-400 pb-1 text-center">
              {day}
            </div>
          ))}
        </div>
        {/* Main grid */}
        <div className="grid grid-cols-7 gap-2">
          {gridDays.map((date, idx) => {
            const isOtherMonth = date.getMonth() !== selectedDate.getMonth();
            const isToday = date.toDateString() === (new Date()).toDateString();
            const calReminders = calendarReminders.filter(r => r.date.toDateString() === date.toDateString());
            const userReminders = (remindersByDateMap[date.toDateString()] || []);
            return (
              <div key={idx}
                className={`rounded-md p-1.5 min-h-[68px] flex flex-col gap-1 cursor-pointer border border-transparent ${isToday ? "bg-violet-50" : ""} ${isOtherMonth ? "bg-[#fafbfc] text-gray-300" : "bg-white text-gray-900"} hover:bg-violet-50 transition`}
              >
                <div className="text-[13px] text-right text-gray-500">{date.getDate()}</div>
                <div className="flex flex-col gap-0.5">
                  {/* Calendar sample reminders */}
                  {calReminders.map((rem, i) => (
                    <span 
                      key={i}
                      className="block text-xs px-1 py-0.5 rounded mb-0.5 truncate"
                      style={{background: rem.color}}
                    >{rem.label}</span>
                  ))}
                  {/* User added reminders */}
                  {userReminders.map((r, i) => (
                    <span key={i} className="block text-xs px-1 rounded mb-0.5 truncate bg-violet-100">
                      {r.title}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* My Reminders sidebar */}
      <aside className="w-80 max-w-full bg-white rounded-2xl shadow p-6 flex flex-col">
        <div className="font-semibold text-base mb-4">My Reminders</div>
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {sortedReminders.map(rem => (
            <div key={rem.id} className="flex items-center gap-2 group rounded-md px-2 py-2 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={rem.completed}
                onChange={() => handleToggleReminder(rem.id)}
                className="accent-violet-600 h-4 w-4 cursor-pointer"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className={`text-[15px] font-medium truncate ${rem.completed ? "line-through text-gray-400" : ""}`}>{rem.title}</span>
                <span className="text-xs text-gray-400">{rem.type}</span>
                <span className="text-xs text-gray-400">{format(rem.date, "PPPP p")}</span>
              </div>
              <ReminderDotMenu
                onEdit={() => {
                  // For demo: open edit with same dialog
                  setAddDialogOpen(true);
                }}
                onDelete={() => handleDeleteReminder(rem.id)}
              />
            </div>
          ))}
        </div>
      </aside>

      <AddReminderDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddReminder}
        staffData={staffData}
      />
    </div>
  );
};

export default ProposalCalendarTab;
