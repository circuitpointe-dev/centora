
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Disbursement {
  milestone: string;
  amount: number;
  currency: string;
  disbursementDate: Date | undefined;
}

interface DisbursementScheduleTabProps {
  data: {
    disbursements: Disbursement[];
  };
  onUpdate: (data: any) => void;
}

export const DisbursementScheduleTab: React.FC<DisbursementScheduleTabProps> = ({ data, onUpdate }) => {
  const [newDisbursement, setNewDisbursement] = useState<Disbursement>({
    milestone: '',
    amount: 0,
    currency: 'USD',
    disbursementDate: undefined,
  });

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  const addDisbursement = () => {
    if (!newDisbursement.milestone || !newDisbursement.amount || !newDisbursement.disbursementDate) {
      return;
    }
    
    onUpdate({
      disbursements: [...data.disbursements, { ...newDisbursement }]
    });
    
    setNewDisbursement({
      milestone: '',
      amount: 0,
      currency: 'USD',
      disbursementDate: undefined,
    });
  };

  const removeDisbursement = (index: number) => {
    const updatedDisbursements = data.disbursements.filter((_, i) => i !== index);
    onUpdate({ disbursements: updatedDisbursements });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Disbursement Schedule</h3>
        
        {/* Form to add new disbursement */}
        <div className="border rounded-sm p-4 bg-background/50">
          <h4 className="text-sm font-medium mb-3">Add New Disbursement</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="milestone" className="text-sm">Milestone</Label>
              <Input
                id="milestone"
                placeholder="Enter milestone name"
                value={newDisbursement.milestone}
                onChange={(e) => setNewDisbursement(prev => ({ ...prev, milestone: e.target.value }))}
                className="rounded-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="amount" className="text-sm">Amount</Label>
              <div className="flex">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newDisbursement.amount || ''}
                  onChange={(e) => setNewDisbursement(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="rounded-sm rounded-r-none"
                />
                <Select 
                  value={newDisbursement.currency} 
                  onValueChange={(value) => setNewDisbursement(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="w-20 rounded-sm rounded-l-none border-l-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="date" className="text-sm">Disbursement Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-sm",
                      !newDisbursement.disbursementDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDisbursement.disbursementDate ? (
                      format(newDisbursement.disbursementDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newDisbursement.disbursementDate}
                    onSelect={(date) => setNewDisbursement(prev => ({ ...prev, disbursementDate: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={addDisbursement}
                variant="ghost"
                className="w-full bg-transparent hover:bg-accent rounded-sm"
                disabled={!newDisbursement.milestone || !newDisbursement.amount || !newDisbursement.disbursementDate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Disbursement
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Disbursements Table */}
      {data.disbursements.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Milestone</TableHead>
              <TableHead>Disbursement Amount</TableHead>
              <TableHead>Disbursement Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.disbursements.map((disbursement, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{disbursement.milestone}</TableCell>
                <TableCell>{formatCurrency(disbursement.amount, disbursement.currency)}</TableCell>
                <TableCell>
                  {disbursement.disbursementDate 
                    ? format(disbursement.disbursementDate, "PPP")
                    : "No date set"
                  }
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-transparent hover:bg-accent rounded-sm p-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDisbursement(index)}
                      className="bg-transparent hover:bg-destructive/10 hover:text-destructive rounded-sm p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {data.disbursements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No disbursements added yet. Create your first disbursement above.
        </div>
      )}
    </div>
  );
};
