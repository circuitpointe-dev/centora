
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GivingRecordsChart } from './GivingRecordsChart';
import { ExistingRecordsSection } from './ExistingRecordsSection';
import { AddNewEntrySection } from './AddNewEntrySection';

interface ManageGivingRecordsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface GivingRecord {
  id: string;
  month: string;
  year: number;
  amount: number;
}

export const ManageGivingRecordsDialog: React.FC<ManageGivingRecordsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [records, setRecords] = useState<GivingRecord[]>([
    { id: '1', month: 'Jan', year: 2024, amount: 25000 },
    { id: '2', month: 'Feb', year: 2024, amount: 35000 },
    { id: '3', month: 'Mar', year: 2024, amount: 20000 },
    { id: '4', month: 'Apr', year: 2024, amount: 40000 },
    { id: '5', month: 'May', year: 2024, amount: 15000 },
    { id: '6', month: 'Jun', year: 2024, amount: 30000 },
  ]);

  const handleAddRecord = (month: string, year: number, amount: number) => {
    const newRecord: GivingRecord = {
      id: Date.now().toString(),
      month,
      year,
      amount,
    };
    setRecords(prev => [...prev, newRecord]);
  };

  const handleEditRecord = (id: string, month: string, year: number, amount: number) => {
    setRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, month, year, amount } : record
      )
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const filteredRecords = records.filter(record => record.year === selectedYear);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-medium">
            Manage Giving Records
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Chart Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-lg text-[#383839]">Giving History</h2>
              <Select 
                value={selectedYear.toString()} 
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[113px] border-violet-600 text-violet-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <GivingRecordsChart records={filteredRecords} />
          </div>

          {/* Records Management Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ExistingRecordsSection 
                records={filteredRecords}
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            </div>
            <div className="flex-1">
              <AddNewEntrySection onAddRecord={handleAddRecord} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
