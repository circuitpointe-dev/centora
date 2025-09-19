import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { exportGrantToPDF, exportGrantToExcel } from '@/utils/exportUtils';
import type { Grant } from '@/types/grants';

interface ExportDropdownProps {
  data: any[];
  grant?: Grant;
}

export const ExportDropdown = ({ data, grant }: ExportDropdownProps) => {
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting ${data.length} records as ${format}`);
    
    if (grant) {
      // Export grant-specific data
      const exportData = {
        grant,
        reports: data.filter((item: any) => item.report_type),
        disbursements: data.filter((item: any) => item.milestone),
        compliance: data.filter((item: any) => item.requirement)
      };
      
      if (format === 'pdf') {
        await exportGrantToPDF(exportData);
      } else if (format === 'excel' || format === 'csv') {
        exportGrantToExcel(exportData);
      }
    } else {
      // Export table data as CSV
      if (data.length === 0) return;
      
      const headers = Object.keys(data[0]);
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += headers.join(",") + "\n";
      
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvContent += values.join(",") + "\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <Table className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};