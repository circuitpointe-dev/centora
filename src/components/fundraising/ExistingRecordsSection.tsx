
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash } from 'lucide-react';
import { DonorGivingRecord } from '@/hooks/useDonorGivingRecords';
import { getMonthName, getMonthNumber, MONTH_NAMES, formatCurrency } from '@/utils/monthConversion';

interface ExistingRecordsSectionProps {
  records: DonorGivingRecord[];
  onEditRecord: (id: string, month: string, year: number, amount: number) => void;
  onDeleteRecord: (id: string) => void;
  isLoading?: boolean;
}

export const ExistingRecordsSection: React.FC<ExistingRecordsSectionProps> = ({
  records,
  onEditRecord,
  onDeleteRecord,
  isLoading = false,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMonth, setEditMonth] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const handleEdit = (record: DonorGivingRecord) => {
    setEditingId(record.id);
    setEditMonth(getMonthName(record.month));
    setEditYear(record.year.toString());
    setEditAmount(record.amount.toString());
  };

  const handleSave = () => {
    if (editingId && editMonth && editYear && editAmount) {
      onEditRecord(editingId, editMonth, parseInt(editYear), parseInt(editAmount));
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditMonth('');
    setEditYear('');
    setEditAmount('');
  };

  // Get available years from records
  const availableYears = React.useMemo(() => {
    const years = Array.from(new Set(records.map(record => record.year)));
    return years.sort((a, b) => b - a);
  }, [records]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-[#383839] text-lg">
        Existing Giving Records
      </h2>

      <Card className="w-full">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading giving records...</div>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <div className="text-lg font-medium mb-2">No giving records found</div>
              <div className="text-sm text-center">
                No giving records available for the selected year.
                <br />
                Add a new record to get started.
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#a273f2] font-medium">SL. NO</TableHead>
                  <TableHead className="text-[#a273f2] font-medium">Month</TableHead>
                  <TableHead className="text-[#a273f2] font-medium">Year</TableHead>
                  <TableHead className="text-[#a273f2] font-medium">Amount</TableHead>
                  <TableHead className="text-[#a273f2] font-medium text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-normal text-[#232323]">
                      {String(index + 1).padStart(2, '0')}.
                    </TableCell>
                    <TableCell className="font-normal text-[#232323]">
                      {editingId === record.id ? (
                        <Select value={editMonth} onValueChange={setEditMonth}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTH_NAMES.map(month => (
                              <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        getMonthName(record.month)
                      )}
                    </TableCell>
                    <TableCell className="font-normal text-[#232323]">
                      {editingId === record.id ? (
                        <Select value={editYear} onValueChange={setEditYear}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableYears.map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                            {/* Add current year if not in available years */}
                            {!availableYears.includes(new Date().getFullYear()) && (
                              <SelectItem value={new Date().getFullYear().toString()}>
                                {new Date().getFullYear()}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        record.year
                      )}
                    </TableCell>
                    <TableCell className="font-normal text-[#232323]">
                      {editingId === record.id ? (
                        <Input
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="h-8"
                          type="number"
                        />
                      ) : (
                        formatCurrency(Number(record.amount), record.currency)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === record.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0"
                            onClick={() => handleEdit(record)}
                          >
                            <Pencil className="h-4 w-4 text-violet-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0"
                            onClick={() => onDeleteRecord(record.id)}
                          >
                            <Trash className="h-4 w-4 text-violet-500" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
