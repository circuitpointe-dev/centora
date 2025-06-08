
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

interface AddNewEntrySectionProps {
  onAddRecord: (month: string, year: number, amount: number) => void;
}

export const AddNewEntrySection: React.FC<AddNewEntrySectionProps> = ({
  onAddRecord,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddEntry = () => {
    if (selectedMonth && selectedYear && amount) {
      onAddRecord(selectedMonth, parseInt(selectedYear), parseInt(amount));
      setSelectedMonth('');
      setSelectedYear('');
      setAmount('');
    }
  };

  const months = [
    { value: "Jan", label: "January" },
    { value: "Feb", label: "February" },
    { value: "Mar", label: "March" },
    { value: "Apr", label: "April" },
    { value: "May", label: "May" },
    { value: "Jun", label: "June" },
    { value: "Jul", label: "July" },
    { value: "Aug", label: "August" },
    { value: "Sep", label: "September" },
    { value: "Oct", label: "October" },
    { value: "Nov", label: "November" },
    { value: "Dec", label: "December" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-medium text-[#383839] text-lg">Add New Entry</h2>

      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium text-[#707070] text-sm">
                  Month
                </label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-12 border-[#d2d2d2]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium text-[#707070] text-sm">
                  Year
                </label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-12 border-[#d2d2d2]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#707070] text-sm">
                Amount
              </label>
              <Input
                className="h-12 border-[#d2d2d2]"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="text-violet-600 border-violet-600 h-auto py-3"
                onClick={handleAddEntry}
                disabled={!selectedMonth || !selectedYear || !amount}
              >
                Add New Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
