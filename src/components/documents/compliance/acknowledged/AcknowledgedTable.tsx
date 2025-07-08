import React from 'react';
import { MoreHorizontal, Bell, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  name: string;
  policyAssigned: string;
  acknowledgementDate: string | null;
  status: 'Acknowledged' | 'Pending' | 'Expired' | 'Exempt';
}

interface AcknowledgedTableProps {
  employees: Employee[];
  selectedEmployees: string[];
  onSelectEmployee: (employeeId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onSendReminder: (employeeId: string) => void;
  onMarkAsExempt: (employeeId: string) => void;
  allEligibleSelected: boolean;
  eligibleEmployeesCount: number;
}

export const AcknowledgedTable: React.FC<AcknowledgedTableProps> = ({
  employees,
  selectedEmployees,
  onSelectEmployee,
  onSelectAll,
  onSendReminder,
  onMarkAsExempt,
  allEligibleSelected,
  eligibleEmployeesCount
}) => {
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
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold w-12">
              <Checkbox 
                checked={allEligibleSelected}
                onCheckedChange={onSelectAll}
                disabled={eligibleEmployeesCount === 0}
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
          {employees.map((employee) => {
            const isEligible = employee.status === 'Pending' || employee.status === 'Expired';
            const isSelected = selectedEmployees.includes(employee.id);
            
            return (
              <TableRow key={employee.id}>
                <TableCell>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectEmployee(employee.id, checked as boolean)}
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
                        <DropdownMenuItem onClick={() => onSendReminder(employee.id)}>
                          <Bell className="h-4 w-4 mr-2" />
                          Send Reminder
                        </DropdownMenuItem>
                      )}
                      {employee.status !== 'Exempt' && (
                        <DropdownMenuItem onClick={() => onMarkAsExempt(employee.id)}>
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
  );
};