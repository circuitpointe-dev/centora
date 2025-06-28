
import React from 'react';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DisbursementScheduleTabProps {
  data: {
    disbursements: Array<{
      amount: number;
      disbursementDate: Date | undefined;
    }>;
  };
  onUpdate: (data: any) => void;
}

export const DisbursementScheduleTab: React.FC<DisbursementScheduleTabProps> = ({ data, onUpdate }) => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Disbursement Schedule</h3>
        <Button onClick={addDisbursement} className="flex items-center gap-2 rounded-sm">
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
  );
};
