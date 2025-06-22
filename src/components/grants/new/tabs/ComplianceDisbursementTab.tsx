
import React from 'react';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ComplianceDisbursementTabProps {
  data: {
    complianceRequirements: Array<{
      name: string;
      dueDate: Date | undefined;
      status: string;
    }>;
    disbursements: Array<{
      amount: number;
      disbursementDate: Date | undefined;
    }>;
  };
  onUpdate: (data: any) => void;
}

export const ComplianceDisbursementTab: React.FC<ComplianceDisbursementTabProps> = ({ data, onUpdate }) => {
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

  const addDisbursement = () => {
    const newDisbursement = {
      amount: 0,
      disbursementDate: undefined,
    };
    onUpdate({
      disbursements: [...data.disbursements, newDisbursement]
    });
  };

  const updateDisbursement = (index: number, field: string, value: any) => {
    const updatedDisbursements = [...data.disbursements];
    updatedDisbursements[index] = { ...updatedDisbursements[index], [field]: value };
    onUpdate({ disbursements: updatedDisbursements });
  };

  const removeDisbursement = (index: number) => {
    const updatedDisbursements = data.disbursements.filter((_, i) => i !== index);
    onUpdate({ disbursements: updatedDisbursements });
  };

  return (
    <div className="space-y-8">
      {/* Compliance Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Compliance Requirements</h3>
          <Button onClick={addComplianceRequirement} className="flex items-center gap-2">
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

      {/* Disbursement Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Disbursement Schedule</h3>
          <Button onClick={addDisbursement} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Disbursement
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Disbursement Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.disbursements.map((disbursement, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      value={disbursement.amount || ''}
                      onChange={(e) => updateDisbursement(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="pl-8 rounded-sm"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-sm",
                          !disbursement.disbursementDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {disbursement.disbursementDate ? format(disbursement.disbursementDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={disbursement.disbursementDate}
                        onSelect={(date) => updateDisbursement(index, 'disbursementDate', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDisbursement(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.disbursements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No disbursements added yet. Click "Create Disbursement" to get started.
          </div>
        )}
      </div>
    </div>
  );
};
