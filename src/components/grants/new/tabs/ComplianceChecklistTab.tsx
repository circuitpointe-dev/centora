
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComplianceRequirementRow } from '../components/ComplianceRequirementRow';

interface ComplianceChecklistTabProps {
  data: {
    complianceRequirements: Array<{
      name: string;
      dueDate: Date | undefined;
      status: string;
    }>;
  };
  onUpdate: (data: any) => void;
}

export const ComplianceChecklistTab: React.FC<ComplianceChecklistTabProps> = ({ data, onUpdate }) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Compliance Requirements</h3>
        <Button onClick={addComplianceRequirement} className="flex items-center gap-2 rounded-sm">
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
            <ComplianceRequirementRow
              key={index}
              requirement={requirement}
              index={index}
              onUpdate={updateComplianceRequirement}
              onRemove={removeComplianceRequirement}
            />
          ))}
        </TableBody>
      </Table>

      {data.complianceRequirements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No compliance requirements added yet. Click "Add Requirement" to get started.
        </div>
      )}
    </div>
  );
};
