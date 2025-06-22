
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface GranteeSubmissionTabProps {
  data: {
    narrativeReports: Array<{ title: string; status: string }>;
    financialReports: Array<{ title: string; status: string }>;
    meReports: Array<{ title: string; status: string }>;
    customReportTypes: Array<{
      name: string;
      reports: Array<{ title: string; status: string }>;
    }>;
  };
  onUpdate: (data: any) => void;
}

export const GranteeSubmissionTab: React.FC<GranteeSubmissionTabProps> = ({ data, onUpdate }) => {
  const [newReportTypeName, setNewReportTypeName] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('narrative');

  const addReport = (reportType: 'narrativeReports' | 'financialReports' | 'meReports', customTypeIndex?: number) => {
    const newReport = { title: '', status: 'Draft' };
    
    if (customTypeIndex !== undefined) {
      const updatedCustomTypes = [...data.customReportTypes];
      updatedCustomTypes[customTypeIndex].reports.push(newReport);
      onUpdate({ customReportTypes: updatedCustomTypes });
    } else {
      onUpdate({
        [reportType]: [...data[reportType], newReport]
      });
    }
  };

  const removeReport = (reportType: 'narrativeReports' | 'financialReports' | 'meReports', index: number, customTypeIndex?: number) => {
    if (customTypeIndex !== undefined) {
      const updatedCustomTypes = [...data.customReportTypes];
      updatedCustomTypes[customTypeIndex].reports.splice(index, 1);
      onUpdate({ customReportTypes: updatedCustomTypes });
    } else {
      const updatedReports = data[reportType].filter((_, i) => i !== index);
      onUpdate({ [reportType]: updatedReports });
    }
  };

  const updateReportTitle = (reportType: 'narrativeReports' | 'financialReports' | 'meReports', index: number, title: string, customTypeIndex?: number) => {
    if (customTypeIndex !== undefined) {
      const updatedCustomTypes = [...data.customReportTypes];
      updatedCustomTypes[customTypeIndex].reports[index].title = title;
      onUpdate({ customReportTypes: updatedCustomTypes });
    } else {
      const updatedReports = [...data[reportType]];
      updatedReports[index].title = title;
      onUpdate({ [reportType]: updatedReports });
    }
  };

  const addCustomReportType = () => {
    if (newReportTypeName.trim()) {
      const newCustomType = {
        name: newReportTypeName.trim(),
        reports: []
      };
      onUpdate({
        customReportTypes: [...data.customReportTypes, newCustomType]
      });
      setNewReportTypeName('');
    }
  };

  const renderReportTable = (reports: Array<{ title: string; status: string }>, reportType: 'narrativeReports' | 'financialReports' | 'meReports', customTypeIndex?: number) => (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  value={report.title}
                  onChange={(e) => updateReportTitle(reportType, index, e.target.value, customTypeIndex)}
                  placeholder="Enter report title"
                  className="rounded-sm"
                />
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="rounded-sm">
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReport(reportType, index, customTypeIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Button
        variant="outline"
        onClick={() => addReport(reportType, customTypeIndex)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Title
      </Button>
    </div>
  );

  const allTabs = [
    { id: 'narrative', label: 'Narrative Report', reports: data.narrativeReports, type: 'narrativeReports' as const },
    { id: 'financial', label: 'Financial Report', reports: data.financialReports, type: 'financialReports' as const },
    { id: 'me', label: 'M & E Report', reports: data.meReports, type: 'meReports' as const },
    ...data.customReportTypes.map((customType, index) => ({
      id: `custom-${index}`,
      label: customType.name,
      reports: customType.reports,
      type: 'narrativeReports' as const, // placeholder
      isCustom: true,
      customIndex: index,
    }))
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${allTabs.length}, 1fr)` }}>
          {allTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="narrative">
          {renderReportTable(data.narrativeReports, 'narrativeReports')}
        </TabsContent>

        <TabsContent value="financial">
          {renderReportTable(data.financialReports, 'financialReports')}
        </TabsContent>

        <TabsContent value="me">
          {renderReportTable(data.meReports, 'meReports')}
        </TabsContent>

        {data.customReportTypes.map((customType, index) => (
          <TabsContent key={`custom-${index}`} value={`custom-${index}`}>
            {renderReportTable(customType.reports, 'narrativeReports', index)}
          </TabsContent>
        ))}
      </Tabs>

      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Input
            value={newReportTypeName}
            onChange={(e) => setNewReportTypeName(e.target.value)}
            placeholder="Enter new report type name"
            className="rounded-sm"
          />
          <Button onClick={addCustomReportType} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Report Type
          </Button>
        </div>
      </div>
    </div>
  );
};
