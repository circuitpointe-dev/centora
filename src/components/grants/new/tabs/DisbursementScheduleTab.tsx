
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DisbursementRow } from '../components/DisbursementRow';

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
            <DisbursementRow
              key={index}
              disbursement={disbursement}
              index={index}
              onUpdate={updateDisbursement}
              onRemove={removeDisbursement}
            />
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
