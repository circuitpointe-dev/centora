
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const StaffSelect: React.FC<StaffSelectProps> = ({ value, onChange, id }) => {
  const staffMembers = [
    { id: "john-smith", name: "John Smith" },
    { id: "sarah-johnson", name: "Sarah Johnson" },
    { id: "mike-davis", name: "Mike Davis" },
    { id: "emma-wilson", name: "Emma Wilson" },
    { id: "david-brown", name: "David Brown" },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Select staff member" />
      </SelectTrigger>
      <SelectContent>
        {staffMembers.map((staff) => (
          <SelectItem key={staff.id} value={staff.name}>
            {staff.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StaffSelect;
