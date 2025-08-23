// src/components/users/DepartmentSelect.tsx

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

type Dept = { id: string; name: string };

const INITIAL_DEPTS: Dept[] = [
  { id: "finance", name: "Finance" },
  { id: "hr", name: "Human Resources" },
  { id: "ops", name: "Operations" },
];

export const DepartmentSelect: React.FC<Props> = ({ value, onChange, error }) => {
  const [open, setOpen] = React.useState(false);
  const [newDept, setNewDept] = React.useState("");
  const [options, setOptions] = React.useState<Dept[]>(INITIAL_DEPTS);

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleAdd = () => {
    const name = newDept.trim();
    if (!name) return;
    const id = slugify(name);
    if (options.some((d) => d.id === id)) {
      // If it already exists, just select it
      onChange(id);
      setNewDept("");
      setOpen(false);
      return;
    }
    // UI-only optimistic insert
    const next = [...options, { id, name }];
    setOptions(next);
    onChange(id);
    console.log("[UI-only] Added department:", { id, name });
    setNewDept("");
    setOpen(false);
  };

  return (
    <div className="col-span-1 md:col-span-2">
      <Label className="text-sm text-gray-600">Department</Label>
      <div className="mt-1 flex items-center gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full focus-visible:ring-violet-600 focus-visible:ring-offset-2">
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            {options.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="whitespace-nowrap border-violet-300 text-violet-700 hover:bg-violet-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="end">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">New Department</Label>
              <Input
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                placeholder="e.g., Grants & Compliance"
                className="focus-visible:ring-violet-600 focus-visible:ring-offset-2"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleAdd}
                  disabled={!newDept.trim()}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
