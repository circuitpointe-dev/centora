
import React from 'react';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ComplianceChecklistTabProps {
  data: {
    complianceRequirements: Array<{
      name: string;
      dueDate: Date | undefined;
      status: string;
    }>;
  };
  onUpdate: (data: any) => void;
}

export const ComplianceChecklistTab: React.FC<ComplianceChecklistTabProps> = ({ data, onUpdate }) => {
  const addComplianceRequirement = () => {
    const newRequirement = {
      name: '',
      dueDate: undefined,
      status: 'Pending',
    };
    onUpdate({
      complianceRequirements: [...data.complianceRequirements, newRequirement]
    });
  };

  const updateComplianceRequirement = (index: number, field: string, value: any) => {
    const updatedRequirements = [...data.complianceRequirements];
    updatedRequirements[index] = { ...updatedRequirements[index], [field]: value };
    onUpdate({ complianceRequirements: updatedRequirements });
  };

  const removeComplianceRequirement = (index: number) => {
    const updatedRequirements = data.complianceRequirements.filter((_, i) => i !== index);
    onUpdate({ complianceRequirements: updatedRequirements });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Compliance Requirements</h3>
        <Button onClick={addComplianceRequirement} className="flex items-center gap-2 rounded-sm">
          <Plus className="h-4 w-4" />
          Add Requirement
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requirement Name</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.complianceRequirements.map((requirement, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  value={requirement.name}
                  onChange={(e) => updateComplianceRequirement(index, 'name', e.target.value)}
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
                      onSelect={(date) => updateComplianceRequirement(index, 'dueDate', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Select 
                  value={requirement.status} 
                  onValueChange={(value) => updateComplianceRequirement(index, 'status', value)}
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
                  onClick={() => removeComplianceRequirement(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.complianceRequirements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No compliance requirements added yet. Click "Add Requirement" to get started.
        </div>
      )}
    </div>
  );
};
