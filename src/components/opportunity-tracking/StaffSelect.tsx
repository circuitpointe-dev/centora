
import React from "react";
import { staffData } from "./staffData";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface StaffSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

const StaffSelect: React.FC<StaffSelectProps> = ({
  value,
  onChange,
  placeholder = "Select staff member",
  id = "staff-select",
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger id={id}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {staffData.map((staff) => (
        <SelectItem key={staff.name} value={staff.name}>
          {staff.name} ({staff.title})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default StaffSelect;
