
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Check, X, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Document } from '@/hooks/useDocuments';
import { staffList } from '@/data/staffData';

interface StaffShare {
  staffId: string;
  permission: 'view' | 'edit';
}

interface StaffShareProps {
  document: Document;
}

const StaffShare = ({ document }: StaffShareProps) => {
  const [selectedStaff, setSelectedStaff] = useState<StaffShare[]>([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const availableStaff = staffList.filter(staff => 
    !selectedStaff.some(selected => selected.staffId === staff.id)
  );

  const filteredStaff = availableStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaff(prev => [...prev, { staffId, permission: 'view' }]);
    setOpen(false);
    setSearchValue('');
  };

  const handlePermissionChange = (staffId: string, permission: 'view' | 'edit') => {
    setSelectedStaff(prev => 
      prev.map(staff => 
        staff.staffId === staffId ? { ...staff, permission } : staff
      )
    );
  };

  const handleRemoveStaff = (staffId: string) => {
    setSelectedStaff(prev => prev.filter(staff => staff.staffId !== staffId));
  };

  const handleShare = async () => {
    if (selectedStaff.length === 0) {
      toast({
        title: "No staff selected",
        description: "Please select at least one staff member to share with.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    
    // Simulate API call
    setTimeout(() => {
      const staffNames = selectedStaff.map(selected => {
        const staff = staffList.find(s => s.id === selected.staffId);
        return `${staff?.name} (${selected.permission})`;
      }).join(', ');

      toast({
        title: "Document shared successfully",
        description: `${document.file_name} has been shared with ${staffNames}.`,
      });
      
      setIsSharing(false);
      setSelectedStaff([]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Share with Staff</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select staff members and set their permissions for this document.
        </p>
      </div>

      <div className="space-y-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between border-gray-300"
            >
              <span className="text-gray-600">
                {selectedStaff.length > 0 
                  ? `${selectedStaff.length} staff member(s) selected`
                  : "Search and select staff..."
                }
              </span>
              <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search staff..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>
                  <span className="text-sm text-gray-500">No staff found.</span>
                </CommandEmpty>
                <CommandGroup>
                  {filteredStaff.map((staff) => (
                    <CommandItem
                      key={staff.id}
                      onSelect={() => handleStaffSelect(staff.id)}
                      className="cursor-pointer"
                    >
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

        {selectedStaff.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Selected Staff</h4>
            {selectedStaff.map((selected) => {
              const staff = staffList.find(s => s.id === selected.staffId);
              return (
                <div
                  key={selected.staffId}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-900">
                      {staff?.name}
                    </span>
                    <span className="text-xs text-gray-500">{staff?.role}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={selected.permission}
                      onValueChange={(value: 'view' | 'edit') => 
                        handlePermissionChange(selected.staffId, value)
                      }
                    >
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStaff(selected.staffId)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Button
        onClick={handleShare}
        disabled={selectedStaff.length === 0 || isSharing}
        className="w-full bg-violet-600 hover:bg-violet-700"
      >
        {isSharing ? 'Sharing...' : 'Share with Staff'}
      </Button>
    </div>
  );
};

export default StaffShare;
