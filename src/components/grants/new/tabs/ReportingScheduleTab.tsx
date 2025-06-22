
import React from 'react';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ReportingScheduleTabProps {
  data: {
    frequency: string;
    periodStart: Date | undefined;
    periodEnd: Date | undefined;
    reportingPeriods: Array<{
      label: string;
      submissionType: string;
      dueDate: Date | undefined;
      assignedReviewer: string;
    }>;
  };
  onUpdate: (data: any) => void;
}

const staffMembers = [
  'Sarah Johnson',
  'Michael Chen',
  'Emily Davis',
  'David Wilson',
  'Lisa Rodriguez',
];

export const ReportingScheduleTab: React.FC<ReportingScheduleTabProps> = ({ data, onUpdate }) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const addReportingPeriod = () => {
    const newPeriod = {
      label: '',
      submissionType: '',
      dueDate: undefined,
      assignedReviewer: '',
    };
    onUpdate({
      reportingPeriods: [...data.reportingPeriods, newPeriod]
    });
  };

  const updateReportingPeriod = (index: number, field: string, value: any) => {
    const updatedPeriods = [...data.reportingPeriods];
    updatedPeriods[index] = { ...updatedPeriods[index], [field]: value };
    onUpdate({ reportingPeriods: updatedPeriods });
  };

  const removeReportingPeriod = (index: number) => {
    const updatedPeriods = data.reportingPeriods.filter((_, i) => i !== index);
    onUpdate({ reportingPeriods: updatedPeriods });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Reporting Frequency *
          </Label>
          <Select value={data.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
            <SelectTrigger className="rounded-sm">
              <Select value placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Period Start Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-sm",
                  !data.periodStart && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.periodStart ? format(data.periodStart, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.periodStart}
                onSelect={(date) => handleInputChange('periodStart', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Period End Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-sm",
                  !data.periodEnd && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.periodEnd ? format(data.periodEnd, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.periodEnd}
                onSelect={(date) => handleInputChange('periodEnd', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Reporting Periods</h3>
          <Button onClick={addReportingPeriod} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Reporting Period
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period Label</TableHead>
              <TableHead>Submission Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assigned Reviewer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.reportingPeriods.map((period, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={period.label}
                    onChange={(e) => updateReportingPeriod(index, 'label', e.target.value)}
                    placeholder="e.g. Q1 2025"
                    className="rounded-sm"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={period.submissionType} 
                    onValueChange={(value) => updateReportingPeriod(index, 'submissionType', value)}
                  >
                    <SelectTrigger className="rounded-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="narrative">Narrative</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="me">M & E</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-sm",
                          !period.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {period.dueDate ? format(period.dueDate, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={period.dueDate}
                        onSelect={(date) => updateReportingPeriod(index, 'dueDate', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Select 
                    value={period.assignedReviewer} 
                    onValueChange={(value) => updateReportingPeriod(index, 'assignedReviewer', value)}
                  >
                    <SelectTrigger className="rounded-sm">
                      <SelectValue placeholder="Select reviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReportingPeriod(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.reportingPeriods.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reporting periods added yet. Click "Add Reporting Period" to get started.
          </div>
        )}
      </div>
    </div>
  );
};
