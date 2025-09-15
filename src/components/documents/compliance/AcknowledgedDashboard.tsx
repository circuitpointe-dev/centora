import React, { useState } from 'react';
import { AcknowledgedStatCards } from './acknowledged/AcknowledgedStatCards';
import { AcknowledgedToolbar } from './acknowledged/AcknowledgedToolbar';
import { AcknowledgedTable } from './acknowledged/AcknowledgedTable';
import { BulkReminderDialog } from './acknowledged/BulkReminderDialog';
import { SingleReminderDialog } from './acknowledged/SingleReminderDialog';
import { ReminderSuccessDialog } from './acknowledged/ReminderSuccessDialog';
import { useToast } from '@/hooks/use-toast';
import { usePolicyAcknowledgments, usePolicyStats } from '@/hooks/usePolicyDocuments';
import { Loader2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  policyAssigned: string;
  acknowledgementDate: string | null;
  status: 'Acknowledged' | 'Pending' | 'Expired' | 'Exempt';
}

export const AcknowledgedDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showBulkReminder, setShowBulkReminder] = useState(false);
  const [showSingleReminder, setSingleReminder] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  // Fetch real data from backend
  const { data: acknowledgments, isLoading: acknowledgementsLoading } = usePolicyAcknowledgments({
    search: searchQuery,
    status: selectedStatus !== 'All Status' ? selectedStatus.toLowerCase() : undefined,
    department: selectedDepartment !== 'All Departments' ? selectedDepartment : undefined,
  });

  const { data: stats, isLoading: statsLoading } = usePolicyStats();

  const statisticsData = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees?.toString() || '0',
      icon: '👥',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Acknowledged',
      value: stats?.acknowledged?.toString() || '0',
      icon: '✓',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending',
      value: stats?.pending?.toString() || '0',
      icon: '⏳',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Exempt',
      value: stats?.exempt?.toString() || '0',
      icon: '⊘',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  // Transform acknowledgments data to Employee format
  const acknowledgedData: Employee[] = acknowledgments?.map(ack => ({
    id: ack.id,
    name: ack.user?.full_name || 'Unknown User',
    policyAssigned: ack.policy_document?.title || 'Unknown Policy',
    acknowledgementDate: ack.acknowledged_at,
    status: 'Acknowledged' as const
  })) || [];

  if (acknowledgementsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleBulkReminder = () => {
    setShowBulkReminder(true);
  };

  const handleSingleReminder = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSingleReminder(true);
  };

  const handleBulkReminderSend = (selectedEmployees: string[], message: string) => {
    console.log('Sending bulk reminder to:', selectedEmployees, 'Message:', message);
    setShowBulkReminder(false);
    setShowSuccessDialog(true);
    toast({
      title: "Reminders Sent",
      description: `Bulk reminder sent to ${selectedEmployees.length} employees.`,
    });
  };

  const handleSingleReminderSend = (message: string) => {
    if (selectedEmployee) {
      console.log(`This is a reminder to review and acknowledge the ${selectedEmployee.policyAssigned} policy document.`);
      setSingleReminder(false);
      setShowSuccessDialog(true);
      toast({
        title: "Reminder Sent",
        description: `Reminder sent to ${selectedEmployee.name}.`,
      });
    }
  };

  const handleCheckboxChange = (employeeId: string, checked: boolean) => {
    setSelectedEmployees(prev => 
      checked 
        ? [...prev, employeeId]
        : prev.filter(id => id !== employeeId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedEmployees(checked ? acknowledgedData.map(emp => emp.id) : []);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleDepartmentFilterChange = (department: string) => {
    setSelectedDepartment(department);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleGenerateReport = () => {
    console.log('Generating compliance report with current filters');
    toast({
      title: "Report Generated",
      description: "Compliance report has been generated successfully.",
    });
  };

  const filteredData = acknowledgedData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.policyAssigned.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All Status' || employee.status === selectedStatus;
    
    // For department filtering, we'd need to add department info to the Employee interface
    // For now, we'll just handle 'All Departments'
    const matchesDepartment = selectedDepartment === 'All Departments';
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const successMessage = selectedEmployees.length > 1 
    ? `Bulk reminder sent successfully to ${selectedEmployees.length} employees!`
    : selectedEmployee 
      ? `This is a reminder to review and acknowledge your assigned policy document.`
      : "Reminder sent successfully!";

  return (
    <div className="space-y-6">
      <AcknowledgedStatCards statistics={statisticsData} />
      
      <AcknowledgedToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={selectedStatus}
        onStatusFilterChange={handleStatusFilterChange}
        selectedCount={selectedEmployees.length}
        onSendBulkReminder={handleBulkReminder}
        filterOpen={false}
        onFilterOpenChange={() => {}}
      />

      <AcknowledgedTable
        employees={filteredData}
        selectedEmployees={selectedEmployees}
        onSelectEmployee={handleCheckboxChange}
        onSelectAll={handleSelectAll}
        onSendReminder={(employeeId) => {
          const employee = filteredData.find(emp => emp.id === employeeId);
          if (employee) handleSingleReminder(employee);
        }}
        onMarkAsExempt={() => {}}
        allEligibleSelected={selectedEmployees.length === filteredData.length}
        eligibleEmployeesCount={filteredData.length}
      />

      <BulkReminderDialog
        open={showBulkReminder}
        onOpenChange={setShowBulkReminder}
        selectedCount={selectedEmployees.length}
        message=""
        onMessageChange={() => {}}
        onConfirm={() => handleBulkReminderSend(selectedEmployees, "")}
      />

      <SingleReminderDialog
        open={showSingleReminder}
        onOpenChange={setSingleReminder}
        employee={selectedEmployee}
        message=""
        onMessageChange={() => {}}
        onConfirm={() => handleSingleReminderSend("")}
      />

      <ReminderSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
      />
    </div>
  );
};