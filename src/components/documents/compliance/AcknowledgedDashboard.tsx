import React, { useState } from 'react';
import { Search, Download, Filter, MoreHorizontal, Bell, UserX, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  policyAssigned: string;
  acknowledgementDate: string | null;
  status: 'Acknowledged' | 'Pending' | 'Expired' | 'Exempt';
}

const acknowledgedData: Employee[] = [
  {
    id: '1',
    name: 'Millicent ERP',
    policyAssigned: 'Code of Conduct',
    acknowledgementDate: '2025-02-18',
    status: 'Acknowledged'
  },
  {
    id: '2',
    name: 'Winifred Taghbenu',
    policyAssigned: 'Data Privacy',
    acknowledgementDate: null,
    status: 'Expired'
  },
  {
    id: '3',
    name: 'Chioma Ike',
    policyAssigned: 'Code of Conduct',
    acknowledgementDate: '2025-02-18',
    status: 'Acknowledged'
  },
  {
    id: '4',
    name: 'Wesfu Baanu',
    policyAssigned: 'Code of Conduct',
    acknowledgementDate: null,
    status: 'Pending'
  },
  {
    id: '5',
    name: 'John Doe',
    policyAssigned: 'Code of Conduct',
    acknowledgementDate: '2025-02-18',
    status: 'Acknowledged'
  },
  {
    id: '6',
    name: 'Richard Nwamadi',
    policyAssigned: 'Code of Conduct',
    acknowledgementDate: null,
    status: 'Expired'
  },
  {
    id: '7',
    name: 'Somachi ERP',
    policyAssigned: 'Code of Conduct',
    acknowledgementDate: null,
    status: 'Pending'
  }
];

const statisticsData = [
  {
    title: 'Total Employees',
    value: '245',
    icon: '👥',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    title: 'Acknowledged',
    value: '180',
    icon: '✓',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  },
  {
    title: 'Pending',
    value: '45',
    icon: '⏳',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  },
  {
    title: 'Exempt',
    value: '6',
    icon: '⊘',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600'
  }
];

export const AcknowledgedDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [employees, setEmployees] = useState(acknowledgedData);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [bulkReminderOpen, setBulkReminderOpen] = useState(false);
  const [bulkReminderMessage, setBulkReminderMessage] = useState('');
  const [reminderSuccessOpen, setReminderSuccessOpen] = useState(false);
  const { toast } = useToast();

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.policyAssigned.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (employeeId: string) => {
    console.log('Send reminder to employee:', employeeId);
    // Implement send reminder logic
  };

  const handleMarkAsExempt = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, status: 'Exempt' as const }
        : emp
    ));
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const eligibleEmployees = filteredEmployees
        .filter(emp => emp.status === 'Pending' || emp.status === 'Expired')
        .map(emp => emp.id);
      setSelectedEmployees(eligibleEmployees);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSendBulkReminder = () => {
    setBulkReminderMessage(`Hello,

This is a reminder to review and acknowledge your assigned policy document.

Acknowledging this policy confirms that you have read, understood, and agreed to comply with its contents. This step is required to meet organizational compliance standards.

Thank you`);
    setBulkReminderOpen(true);
  };

  const handleConfirmBulkReminder = () => {
    console.log('Sending bulk reminder to employees:', selectedEmployees);
    setBulkReminderOpen(false);
    setReminderSuccessOpen(true);
    setSelectedEmployees([]);
  };

  const eligibleEmployees = filteredEmployees.filter(emp => emp.status === 'Pending' || emp.status === 'Expired');
  const allEligibleSelected = eligibleEmployees.length > 0 && eligibleEmployees.every(emp => selectedEmployees.includes(emp.id));

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Acknowledged':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Exempt':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticsData.map((stat, index) => (
          <Card key={index} className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4', stat.bgColor)}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {/* Search Input */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Send Bulk Reminder Button */}
          <Button 
            variant="default" 
            size="sm" 
            className="gap-2 bg-violet-600 hover:bg-violet-700"
            onClick={handleSendBulkReminder}
            disabled={selectedEmployees.length === 0}
          >
            <Mail className="h-4 w-4" />
            Send Bulk Reminder ({selectedEmployees.length})
          </Button>

          {/* Export Button */}
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export list
          </Button>

          {/* Filter Button */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Exempt">Exempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold w-12">
                <Checkbox 
                  checked={allEligibleSelected}
                  onCheckedChange={handleSelectAll}
                  disabled={eligibleEmployees.length === 0}
                />
              </TableHead>
              <TableHead className="font-semibold">Employee Name</TableHead>
              <TableHead className="font-semibold">Policy Assigned</TableHead>
              <TableHead className="font-semibold">Acknowledgement Date</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => {
              const isEligible = employee.status === 'Pending' || employee.status === 'Expired';
              const isSelected = selectedEmployees.includes(employee.id);
              
              return (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectEmployee(employee.id, checked as boolean)}
                      disabled={!isEligible}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{employee.name}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">{employee.policyAssigned}</TableCell>
                  <TableCell className="text-gray-600">
                    {employee.acknowledgementDate 
                      ? new Date(employee.acknowledgementDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(getStatusBadgeStyle(employee.status))}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {employee.status === 'Pending' && (
                          <DropdownMenuItem onClick={() => handleSendReminder(employee.id)}>
                            <Bell className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                        )}
                        {employee.status !== 'Exempt' && (
                          <DropdownMenuItem onClick={() => handleMarkAsExempt(employee.id)}>
                            <UserX className="h-4 w-4 mr-2" />
                            Mark as Exempt
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No employees found matching your search.' : 'No employee data available.'}
          </p>
        </div>
      )}

      {/* Bulk Reminder Dialog */}
      <Dialog open={bulkReminderOpen} onOpenChange={setBulkReminderOpen}>
        <DialogContent className="max-w-lg bg-white">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-gray-900">Send Bulk Reminder</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Document Name:</label>
                <p className="text-sm text-gray-600">Code of Conduct.pdf</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date:</label>
                <p className="text-sm text-red-600">July 30, 2025</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Selected Employees:</label>
                <p className="text-sm text-gray-600">{selectedEmployees.length} employee(s) selected</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Message</label>
              <Textarea
                value={bulkReminderMessage}
                onChange={(e) => setBulkReminderMessage(e.target.value)}
                rows={6}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setBulkReminderOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-violet-600 hover:bg-violet-700 text-white"
                onClick={handleConfirmBulkReminder}
              >
                Send Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={reminderSuccessOpen} onOpenChange={setReminderSuccessOpen}>
        <DialogContent className="max-w-md bg-white">
          <div className="text-center py-8">
            <div className="mx-auto mb-6 w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-violet-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              We've notified the document owners and recipients.
            </h3>
            <p className="text-gray-600 mb-6">
              They'll receive an email with the reminder to update or replace the expiring document.
            </p>
            
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline"
                onClick={() => setReminderSuccessOpen(false)}
              >
                Back to Acknowledgement Dashboard
              </Button>
              <Button 
                className="bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => setReminderSuccessOpen(false)}
              >
                View Document Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};