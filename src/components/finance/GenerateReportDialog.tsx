import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGenerateReport } from '@/hooks/finance/useFinanceReports';
import { toast } from '@/hooks/use-toast';
import { Calendar, FileText, TrendingUp, BarChart3, DollarSign } from 'lucide-react';

interface GenerateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GenerateReportDialog: React.FC<GenerateReportDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [reportType, setReportType] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generateReport = useGenerateReport();

  const reportTypes = [
    {
      value: 'income_statement',
      label: 'Income Statement',
      description: 'Revenue and expenses over a period',
      icon: TrendingUp,
    },
    {
      value: 'balance_sheet',
      label: 'Balance Sheet',
      description: 'Assets, liabilities, and equity snapshot',
      icon: BarChart3,
    },
    {
      value: 'cash_flow',
      label: 'Cash Flow Statement',
      description: 'Cash inflows and outflows',
      icon: DollarSign,
    },
    {
      value: 'budget_variance',
      label: 'Budget Variance Report',
      description: 'Compare actual vs budgeted amounts',
      icon: FileText,
    },
    {
      value: 'project_summary',
      label: 'Project Summary Report',
      description: 'Financial summary of all projects',
      icon: BarChart3,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType || !startDate || !endDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: 'Error',
        description: 'Start date must be before end date',
        variant: 'destructive',
      });
      return;
    }

    try {
      await generateReport.mutateAsync({
        reportType: reportType as any,
        startDate,
        endDate,
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const resetForm = () => {
    setReportType('');
    setStartDate('');
    setEndDate('');
  };

  const setQuickDateRange = (range: string) => {
    const today = new Date();
    let start: Date;
    let end = today;

    switch (range) {
      case 'this_month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'last_month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'this_quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case 'this_year':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Generate Financial Report</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type *</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <type.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4" />
              <Label>Date Range *</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quick Date Ranges</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setQuickDateRange('this_month')}
                  className="text-xs"
                >
                  This Month
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setQuickDateRange('last_month')}
                  className="text-xs"
                >
                  Last Month
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setQuickDateRange('this_quarter')}
                  className="text-xs"
                >
                  This Quarter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setQuickDateRange('this_year')}
                  className="text-xs"
                >
                  This Year
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!reportType || !startDate || !endDate || generateReport.isPending}
              className="flex-1"
            >
              {generateReport.isPending ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};