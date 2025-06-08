
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
import { GivingRecord } from './ManageGivingRecordsDialog';

interface ExistingRecordsSectionProps {
  records: GivingRecord[];
  onEditRecord: (id: string, month: string, year: number, amount: number) => void;
  onDeleteRecord: (id: string) => void;
}

export const ExistingRecordsSection: React.FC<ExistingRecordsSectionProps> = ({
  records,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMonth, setEditMonth] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const handleEdit = (record: GivingRecord) => {
    setEditingId(record.id);
    setEditMonth(record.month);
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

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-[#383839] text-lg">
        Existing Giving Records
      </h2>

      <Card className="w-full">
        <CardContent className="p-6">
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
                          {months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      record.month
                    )}
                  </TableCell>
                  <TableCell className="font-normal text-[#232323]">
                    {editingId === record.id ? (
                      <Select value={editYear} onValueChange={setEditYear}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
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
                      `$${record.amount.toLocaleString()}`
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
        </CardContent>
      </Card>
    </div>
  );
};
