import React, { useState } from 'react';
import { AcknowledgedStatCards } from './acknowledged/AcknowledgedStatCards';
import { AcknowledgedToolbar } from './acknowledged/AcknowledgedToolbar';
import { AcknowledgedTable } from './acknowledged/AcknowledgedTable';
import { BulkReminderDialog } from './acknowledged/BulkReminderDialog';
import { ReminderSuccessDialog } from './acknowledged/ReminderSuccessDialog';
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

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <AcknowledgedStatCards statistics={statisticsData} />

      {/* Toolbar */}
      <AcknowledgedToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedCount={selectedEmployees.length}
        onSendBulkReminder={handleSendBulkReminder}
        filterOpen={filterOpen}
        onFilterOpenChange={setFilterOpen}
      />

      {/* Table */}
      <AcknowledgedTable
        employees={filteredEmployees}
        selectedEmployees={selectedEmployees}
        onSelectEmployee={handleSelectEmployee}
        onSelectAll={handleSelectAll}
        onSendReminder={handleSendReminder}
        onMarkAsExempt={handleMarkAsExempt}
        allEligibleSelected={allEligibleSelected}
        eligibleEmployeesCount={eligibleEmployees.length}
      />

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No employees found matching your search.' : 'No employee data available.'}
          </p>
        </div>
      )}

      {/* Bulk Reminder Dialog */}
      <BulkReminderDialog
        open={bulkReminderOpen}
        onOpenChange={setBulkReminderOpen}
        selectedCount={selectedEmployees.length}
        message={bulkReminderMessage}
        onMessageChange={setBulkReminderMessage}
        onConfirm={handleConfirmBulkReminder}
      />

      {/* Success Dialog */}
      <ReminderSuccessDialog
        open={reminderSuccessOpen}
        onOpenChange={setReminderSuccessOpen}
      />
    </div>
  );
};