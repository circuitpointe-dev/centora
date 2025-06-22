
import React from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface OverviewTabProps {
  data: {
    grantName: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    grantManagers: string[];
    fiduciaryOfficer: string;
    grantAdministrator: string;
  };
  onUpdate: (data: any) => void;
}

// Mock data for staff members
const staffMembers = [
  { id: '1', name: 'Sarah Johnson', role: 'Senior Grant Manager' },
  { id: '2', name: 'Michael Chen', role: 'Grant Manager' },
  { id: '3', name: 'Emily Davis', role: 'Program Officer' },
  { id: '4', name: 'David Wilson', role: 'Financial Officer' },
  { id: '5', name: 'Lisa Rodriguez', role: 'Grant Administrator' },
  { id: '6', name: 'James Thompson', role: 'Compliance Officer' },
  { id: '7', name: 'Maria Garcia', role: 'Program Director' },
];

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, onUpdate }) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const addGrantManager = (managerId: string) => {
    const manager = staffMembers.find(s => s.id === managerId);
    if (manager && !data.grantManagers.includes(manager.name)) {
      handleInputChange('grantManagers', [...data.grantManagers, manager.name]);
    }
  };

  const removeGrantManager = (managerName: string) => {
    handleInputChange('grantManagers', data.grantManagers.filter(name => name !== managerName));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="grantName" className="text-sm font-medium">
            Grant Name *
          </Label>
          <Input
            id="grantName"
            value={data.grantName}
            onChange={(e) => handleInputChange('grantName', e.target.value)}
            placeholder="Enter grant name"
            className="rounded-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Start Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-sm",
                  !data.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(data.startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => handleInputChange('startDate', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            End Date *
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-sm",
                  !data.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.endDate ? format(data.endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.endDate}
                onSelect={(date) => handleInputChange('endDate', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Grant Manager(s) *
          </Label>
          <Select onValueChange={addGrantManager}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="Add grant manager" />
            </SelectTrigger>
            <SelectContent>
              {staffMembers
                .filter(member => !data.grantManagers.includes(member.name))
                .map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          {data.grantManagers.length > 0 && (
            <div className="space-y-2 mt-2">
              {data.grantManagers.map((manager, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-sm">
                  <span className="text-sm flex-1">{manager}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGrantManager(manager)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Fiduciary Officer *
          </Label>
          <Select value={data.fiduciaryOfficer} onValueChange={(value) => handleInputChange('fiduciaryOfficer', value)}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="Select fiduciary officer" />
            </SelectTrigger>
            <SelectContent>
              {staffMembers.map((member) => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name} - {member.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Grant Administrator *
          </Label>
          <Select value={data.grantAdministrator} onValueChange={(value) => handleInputChange('grantAdministrator', value)}>
            <SelectTrigger className="rounded-sm">
              <SelectValue placeholder="Select grant administrator" />
            </SelectTrigger>
            <SelectContent>
              {staffMembers.map((member) => (
                <SelectItem key={member.id} value={member.name}>
                  {member.name} - {member.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
