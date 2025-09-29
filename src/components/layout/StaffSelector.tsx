
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check } from 'lucide-react';
import { useOrgUsers } from '@/hooks/useOrgUsers';

interface StaffSelectorProps {
  sendToAll: boolean;
  selectedRecipients: string[];
  onSendToAllChange: (checked: boolean) => void;
  onRecipientSelect: (staffId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StaffSelector = ({
  sendToAll,
  selectedRecipients,
  onSendToAllChange,
  onRecipientSelect,
  open,
  onOpenChange
}: StaffSelectorProps) => {
  const { data: staffList = [], isLoading } = useOrgUsers();

  const getSelectedStaffNames = () => {
    if (sendToAll) return 'All Staff';
    if (selectedRecipients.length === 0) return 'Select recipients...';

    const names = selectedRecipients.map(id =>
      staffList.find(staff => staff.id === id)?.full_name
    ).filter(Boolean);

    if (names.length > 2) {
      return `${names.slice(0, 2).join(', ')} +${names.length - 2} more`;
    }
    return names.join(', ');
  };

  return (
    <div>
      <Label htmlFor="notif-to">To</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="send-to-all"
            checked={sendToAll}
            onCheckedChange={onSendToAllChange}
          />
          <Label htmlFor="send-to-all" className="text-sm">Send to all staff</Label>
        </div>

        {!sendToAll && (
          <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {getSelectedStaffNames()}
                <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search staff..." />
                <CommandList>
                  <CommandEmpty>No staff found.</CommandEmpty>
                  <CommandGroup>
                    {isLoading ? (
                      <CommandItem disabled>Loading staff...</CommandItem>
                    ) : (
                      staffList.map((staff) => (
                        <CommandItem
                          key={staff.id}
                          onSelect={() => onRecipientSelect(staff.id)}
                        >
                          <Checkbox
                            checked={selectedRecipients.includes(staff.id)}
                            onChange={() => onRecipientSelect(staff.id)}
                            className="mr-2"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{staff.full_name}</span>
                            <span className="text-xs text-gray-500">{staff.email}</span>
                          </div>
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default StaffSelector;
