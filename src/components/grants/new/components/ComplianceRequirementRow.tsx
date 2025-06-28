
import React from 'react';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ComplianceRequirement {
  name: string;
  dueDate: Date | undefined;
  status: string;
}

interface ComplianceRequirementRowProps {
  requirement: ComplianceRequirement;
  index: number;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}

export const ComplianceRequirementRow: React.FC<ComplianceRequirementRowProps> = ({
  requirement,
  index,
  onUpdate,
  onRemove,
}) => {
  return (
    <TableRow>
      <TableCell>
        <Input
          value={requirement.name}
          onChange={(e) => onUpdate(index, 'name', e.target.value)}
          placeholder="Enter requirement name"
          className="rounded-sm"
        />
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal rounded-sm",
                !requirement.dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {requirement.dueDate ? format(requirement.dueDate, "PPP") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={requirement.dueDate}
              onSelect={(date) => onUpdate(index, 'dueDate', date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell>
        <Select 
          value={requirement.status} 
          onValueChange={(value) => onUpdate(index, 'status', value)}
        >
          <SelectTrigger className="rounded-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
