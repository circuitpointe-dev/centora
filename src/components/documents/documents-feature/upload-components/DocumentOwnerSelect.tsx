
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
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
import { Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { staffList, Staff } from '@/data/staffData';

interface DocumentOwnerSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const DocumentOwnerSelect = ({ value, onChange }: DocumentOwnerSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const selectedOwner = staffList.find(staff => staff.id === value);

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (staffId: string) => {
    onChange(staffId);
    setOpen(false);
    setSearchValue('');
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <Label className="text-[#383838e6] text-sm font-medium">
        Document Owner
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
              selectedOwner ? "text-[#383838]" : "text-[#38383880]"
            )}>
              {selectedOwner ? selectedOwner.name : "Search people..."}
            </span>
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search people..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <span className="text-sm text-gray-500">No people found.</span>
              </CommandEmpty>
              <CommandGroup>
                {filteredStaff.map((staff) => (
                  <CommandItem
                    key={staff.id}
                    onSelect={() => handleSelect(staff.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === staff.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{staff.name}</span>
                      <span className="text-xs text-gray-500">{staff.role}</span>
                    </div>
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

export default DocumentOwnerSelect;
