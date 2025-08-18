import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { ChevronDown, Check, Plus, Loader2 } from "lucide-react";
import { useRoles, useCreateRole } from "@/hooks/useRoles";

interface RoleMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export const RoleMultiSelect: React.FC<RoleMultiSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const [newRole, setNewRole] = useState("");
  const { data: roles = [], isLoading } = useRoles();
  const createRole = useCreateRole();

  const selectedRoles = useMemo(() => 
    roles.filter((role) => value.includes(role.id)), 
    [roles, value]
  );

  const handleToggleRole = (roleId: string) => {
    const isSelected = value.includes(roleId);
    const newValue = isSelected 
      ? value.filter(id => id !== roleId)
      : [...value, roleId];
    onChange(newValue);
  };

  const handleAddRole = async () => {
    const name = newRole.trim();
    if (!name) return;
    
    try {
      const newId = await createRole.mutateAsync({ name });
      onChange([...value, newId]);
      setNewRole("");
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  return (
    <div>
      <Label className="text-sm text-gray-600">Role(s)</Label>
      <div className="mt-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              role="combobox" 
              className="w-full justify-between"
              disabled={isLoading}
            >
              <div className="truncate text-left">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading roles...
                  </span>
                ) : selectedRoles.length ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedRoles.map((role) => (
                      <Badge key={role.id} variant="secondary" className="font-normal">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select role(s)</span>
                )}
              </div>
              <ChevronDown className="ml-2 h-4 w-4 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[320px]">
            <Command>
              <CommandInput placeholder="Search roles..." />
              <CommandEmpty>
                {roles.length === 0 ? "No roles found." : "No matching roles."}
              </CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {roles.map((role) => {
                    const isSelected = value.includes(role.id);
                    return (
                      <CommandItem
                        key={role.id}
                        onSelect={() => handleToggleRole(role.id)}
                        className="flex items-center justify-between"
                      >
                        <span>{role.name}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      
      <div className="flex mt-2 gap-2">
        <Input 
          value={newRole} 
          onChange={(e) => setNewRole(e.target.value)} 
          placeholder="New role name" 
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddRole}
          disabled={!newRole.trim() || createRole.isPending}
        >
          {createRole.isPending ? (
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