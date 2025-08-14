
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
import { MONTH_FULL_NAMES } from '@/utils/monthConversion';

interface AddNewEntrySectionProps {
  onAddRecord: (month: string, year: number, amount: number, currency: string) => void;
}

export const AddNewEntrySection: React.FC<AddNewEntrySectionProps> = ({
  onAddRecord,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const handleAddEntry = () => {
    if (selectedMonth && selectedYear && amount && currency) {
      onAddRecord(selectedMonth, parseInt(selectedYear), parseInt(amount), currency);
      setSelectedMonth('');
      setSelectedYear('');
      setAmount('');
      setCurrency('USD');
    }
  };

  // Generate year options (current year and previous 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - i);

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
                            {MONTH_FULL_NAMES.map((month) => (
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
                            {yearOptions.map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 flex-1">
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

              <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium text-[#707070] text-sm">
                  Currency
                </label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="h-12 border-[#d2d2d2]">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="text-violet-600 border-violet-600 h-auto py-3"
                onClick={handleAddEntry}
                disabled={!selectedMonth || !selectedYear || !amount || !currency}
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
