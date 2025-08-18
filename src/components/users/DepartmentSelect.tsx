// src/components/users/DepartmentSelect.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, Plus, Loader2 } from "lucide-react";
import { useDepartments, useCreateDepartment } from "@/hooks/useDepartments";

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const DepartmentSelect: React.FC<DepartmentSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const [newDept, setNewDept] = useState("");
  const { data: departments = [], isLoading } = useDepartments();
  const createDepartment = useCreateDepartment();

  const selectedDepartment = departments.find(d => d.id === value);

  const handleAddDepartment = async () => {
    const name = newDept.trim();
    if (!name) return;
    
    try {
      const newId = await createDepartment.mutateAsync({ name });
      onChange(newId);
      setNewDept("");
    } catch (error) {
      console.error('Failed to create department:', error);
    }
  };

  return (
    <div>
      <Label className="text-sm text-gray-600">Department</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full justify-between mt-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading departments...
              </span>
            ) : selectedDepartment ? (
              selectedDepartment.name
            ) : (
              <span className="text-muted-foreground">Select department</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <Command>
            <CommandInput placeholder="Search departments..." />
            <CommandEmpty>
              {departments.length === 0 ? "No departments found." : "No matching departments."}
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {departments.map((dept) => (
                  <CommandItem key={dept.id} onSelect={() => onChange(dept.id)}>
                    {dept.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      
      <div className="flex mt-2 gap-2">
        <Input 
          value={newDept} 
          onChange={(e) => setNewDept(e.target.value)} 
          placeholder="New department name" 
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddDepartment}
          disabled={!newDept.trim() || createDepartment.isPending}
        >
          {createDepartment.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Plus className="h-4 w-4 mr-1" />
          )}
          Add
        </Button>
      </div>
    </div>
  );
};