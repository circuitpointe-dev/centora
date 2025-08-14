
import React, { useState, useMemo } from 'react';
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
import { useDonorGivingRecords, useCreateDonorGivingRecord, useUpdateDonorGivingRecord, useDeleteDonorGivingRecord } from '@/hooks/useDonorGivingRecords';
import { getMonthNumber } from '@/utils/monthConversion';
import { useToast } from '@/hooks/use-toast';

interface ManageGivingRecordsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  donorId: string;
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
  donorId,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { toast } = useToast();

  // Fetch giving records
  const { data: allRecords = [], isLoading } = useDonorGivingRecords(donorId);
  const { data: records = [] } = useDonorGivingRecords(donorId, selectedYear);

  // Mutations
  const createMutation = useCreateDonorGivingRecord();
  const updateMutation = useUpdateDonorGivingRecord();
  const deleteMutation = useDeleteDonorGivingRecord();

  // Get available years from all records
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(allRecords.map(record => record.year)));
    return years.sort((a, b) => b - a); // Sort descending
  }, [allRecords]);

  // Set default year to the most recent year with data
  React.useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const handleAddRecord = async (month: string, year: number, amount: number, currency: string) => {
    try {
      await createMutation.mutateAsync({
        donorId,
        month: getMonthNumber(month),
        year,
        amount,
        currency
      });
      toast({
        title: "Success",
        description: "Giving record added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add giving record",
        variant: "destructive",
      });
    }
  };

  const handleEditRecord = async (id: string, month: string, year: number, amount: number, currency: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        month: getMonthNumber(month),
        year,
        amount,
        currency
      });
      toast({
        title: "Success",
        description: "Giving record updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update giving record",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Giving record deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete giving record",
        variant: "destructive",
      });
    }
  };

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
                disabled={availableYears.length === 0}
              >
                <SelectTrigger className="w-[113px] border-violet-600 text-violet-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                  {availableYears.length === 0 && (
                    <SelectItem value={selectedYear.toString()}>{selectedYear}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <GivingRecordsChart records={records} />
          </div>

          {/* Records Management Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ExistingRecordsSection 
                records={records}
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
                isLoading={isLoading}
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
