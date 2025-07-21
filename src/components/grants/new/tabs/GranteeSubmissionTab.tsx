import React, { useState } from 'react';
import { Plus, Trash2, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SubmissionType {
  id: string;
  name: string;
  enabled: boolean;
  isCustom?: boolean;
}

interface ReportEntry {
  id: string;
  submissionType: string;
  reportingPeriod: string;
  dueDate: string;
  assignedReviewer: string;
}

interface GranteeSubmissionTabProps {
  data: {
    submissionTypes: SubmissionType[];
    reportEntries: ReportEntry[];
    frequency: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  onUpdate: (data: any) => void;
}

export const GranteeSubmissionTab: React.FC<GranteeSubmissionTabProps> = ({ data, onUpdate }) => {
  const [newSubmissionTypeName, setNewSubmissionTypeName] = useState('');
  const [selectedSubmissionType, setSelectedSubmissionType] = useState<string>('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const defaultSubmissionTypes: SubmissionType[] = [
    { id: 'narrative', name: 'Narrative', enabled: true },
    { id: 'financial', name: 'Financial', enabled: true },
    { id: 'me', name: 'M & E', enabled: true },
    { id: 'other', name: 'Other', enabled: false },
  ];

  const currentSubmissionTypes = data.submissionTypes?.length ? data.submissionTypes : defaultSubmissionTypes;
  
  // Staff list for reviewer selection
  const staffMembers = [
    'John Smith',
    'Sarah Johnson', 
    'Michael Brown',
    'Emily Davis',
    'David Wilson'
  ];

  // Get configured submission types from report entries
  const configuredTypes = (data.reportEntries || []).map(entry => entry.submissionType);

  const toggleSubmissionType = (id: string) => {
    const updated = currentSubmissionTypes.map(type =>
      type.id === id ? { ...type, enabled: !type.enabled } : type
    );
    onUpdate({ submissionTypes: updated });
  };

  const addCustomSubmissionType = () => {
    if (newSubmissionTypeName.trim()) {
      const newType: SubmissionType = {
        id: `custom-${Date.now()}`,
        name: newSubmissionTypeName.trim(),
        enabled: true,
        isCustom: true,
      };
      const updated = [...currentSubmissionTypes, newType];
      onUpdate({ submissionTypes: updated });
      setNewSubmissionTypeName('');
    }
  };

  const removeCustomSubmissionType = (id: string) => {
    const updated = currentSubmissionTypes.filter(type => type.id !== id);
    onUpdate({ submissionTypes: updated });
  };

  const generateReportTimeline = () => {
    if (!selectedSubmissionType || !frequency || !startDate || !endDate) return;

    const submissionType = currentSubmissionTypes.find(type => type.id === selectedSubmissionType);
    if (!submissionType) return;

    const newEntry: ReportEntry = {
      id: `${submissionType.id}-${Date.now()}`,
      submissionType: submissionType.name,
      reportingPeriod: `${format(startDate, 'MMM yyyy')} - ${format(endDate, 'MMM yyyy')}`,
      dueDate: format(endDate, 'MMM dd, yyyy'),
      assignedReviewer: '',
    };

    const existingEntries = data.reportEntries || [];
    onUpdate({ 
      reportEntries: [...existingEntries, newEntry]
    });

    // Reset form
    setSelectedSubmissionType('');
    setFrequency('');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const updateReportEntry = (id: string, field: string, value: string) => {
    const updated = (data.reportEntries || []).map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    onUpdate({ reportEntries: updated });
  };

  const removeReportEntry = (id: string) => {
    const updated = (data.reportEntries || []).filter(entry => entry.id !== id);
    onUpdate({ reportEntries: updated });
  };

  return (
    <div className="space-y-6">
      {/* Submission Types Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Submission Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentSubmissionTypes.map((type) => {
              const isConfigured = configuredTypes.includes(type.name);
              return (
                <div key={type.id} className={cn("flex items-center space-x-2", isConfigured && "opacity-50")}>
                  <Checkbox
                    id={type.id}
                    checked={type.enabled}
                    onCheckedChange={() => toggleSubmissionType(type.id)}
                    disabled={isConfigured}
                  />
                  <label
                    htmlFor={type.id}
                    className={cn(
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1",
                      isConfigured && "line-through"
                    )}
                  >
                    {type.name}
                  </label>
                  {type.isCustom && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomSubmissionType(type.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                      disabled={isConfigured}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Input
              value={newSubmissionTypeName}
              onChange={(e) => setNewSubmissionTypeName(e.target.value)}
              placeholder="Enter new submission type name"
              className="rounded-sm"
            />
            <Button onClick={addCustomSubmissionType} variant="outline" className="flex items-center gap-2 rounded-sm">
              <Plus className="h-4 w-4" />
              Add More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reporting Setup Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Reporting Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Submission Type</label>
              <Select value={selectedSubmissionType} onValueChange={setSelectedSubmissionType}>
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select submission type" />
                </SelectTrigger>
                <SelectContent>
                  {currentSubmissionTypes
                    .filter(type => type.enabled && !configuredTypes.includes(type.name))
                    .map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="rounded-sm">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-sm",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-sm",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button 
            onClick={generateReportTimeline}
            disabled={!selectedSubmissionType || !frequency || !startDate || !endDate}
            variant="outline"
            className="flex items-center gap-2 rounded-sm"
          >
            Generate Report Timeline
          </Button>

          {data.reportEntries && data.reportEntries.length > 0 && (
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submission Type</TableHead>
                    <TableHead>Reporting Period</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assigned Reviewer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.reportEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Badge variant="outline" className="rounded-sm">
                          {entry.submissionType}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.reportingPeriod}</TableCell>
                      <TableCell>{entry.dueDate}</TableCell>
                      <TableCell>
                        <Select 
                          value={entry.assignedReviewer} 
                          onValueChange={(value) => updateReportEntry(entry.id, 'assignedReviewer', value)}
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
                          onClick={() => removeReportEntry(entry.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Templates Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2 rounded-sm">
              <Plus className="h-4 w-4" />
              Create with existing templates
            </Button>
            <Button variant="outline" className="flex items-center gap-2 rounded-sm">
              Upload template
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Template functionality will be implemented soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};