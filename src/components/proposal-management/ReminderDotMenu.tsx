
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

const ReminderDotMenu: React.FC<Props> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-1 rounded hover:bg-gray-200">
          <MoreVertical size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-0 z-50" align="end">
        <div className="flex flex-col">
          <Button onClick={() => { onEdit(); setOpen(false); }} variant="ghost" className="justify-start px-4 py-2 w-full rounded-none">
            Edit
          </Button>
          <Button onClick={() => { onDelete(); setOpen(false); }} variant="ghost" className="justify-start px-4 py-2 w-full rounded-none text-red-500">
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReminderDotMenu;
