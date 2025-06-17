
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Building2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { departmentList, Department } from '@/data/departmentData';

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const DepartmentSelect = ({ value, onChange }: DepartmentSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const selectedDepartment = departmentList.find(dept => dept.id === value);

  const filteredDepartments = departmentList.filter(dept =>
    dept.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (deptId: string) => {
    onChange(deptId);
    setOpen(false);
    setSearchValue('');
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <Label className="font-medium text-[#383838e6] text-sm">
        Department
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-4 py-3 rounded-[5px] border border-[#d9d9d9] bg-white hover:bg-gray-50"
          >
            <span className={cn(
              "text-sm",
              selectedDepartment ? "text-[#383838]" : "text-[#38383880]"
            )}>
              {selectedDepartment ? selectedDepartment.name : "Search department..."}
            </span>
            <Building2 className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search department..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <span className="text-sm text-gray-500">No departments found.</span>
              </CommandEmpty>
              <CommandGroup>
                {filteredDepartments.map((dept) => (
                  <CommandItem
                    key={dept.id}
                    onSelect={() => handleSelect(dept.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === dept.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-medium text-sm">{dept.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DepartmentSelect;
