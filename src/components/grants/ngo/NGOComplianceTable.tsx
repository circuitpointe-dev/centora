import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { complianceData, ComplianceRequirement } from '../data/complianceData';
import { ComplianceViewDialog } from './ComplianceViewDialog';
import { UploadEvidenceDialog } from '../view/UploadEvidenceDialog';
import { useToast } from "@/hooks/use-toast";

interface NGOComplianceTableProps {
  grantId: number;
}

export const NGOComplianceTable = ({ grantId }: NGOComplianceTableProps) => {
  const { toast } = useToast();
  const [selectedRequirement, setSelectedRequirement] = useState<ComplianceRequirement | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  // Filter compliance data for this specific grant
  const grantCompliance = complianceData.filter(item => item.grantId === grantId);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewRequirement = (requirement: ComplianceRequirement) => {
    setSelectedRequirement(requirement);
    setIsViewDialogOpen(true);
  };

  const handleUploadEvidence = (requirement: ComplianceRequirement) => {
    setSelectedRequirement(requirement);
    setIsUploadDialogOpen(true);
  };

  const handleUploadComplete = (fileName: string) => {
    toast({
      title: "Evidence Uploaded",
      description: `${fileName} has been uploaded successfully.`,
    });
    setIsUploadDialogOpen(false);
    setSelectedRequirement(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compliance Requirements</h3>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requirement</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Evidence Document</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grantCompliance.map((requirement) => (
              <TableRow key={requirement.id}>
                <TableCell className="font-medium">{requirement.requirement}</TableCell>
                <TableCell>{new Date(requirement.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(requirement.status)}>
                    {requirement.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {requirement.evidenceDocument ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{requirement.evidenceDocument}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {requirement.status === 'Completed' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewRequirement(requirement)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUploadEvidence(requirement)}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ComplianceViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        requirement={selectedRequirement}
      />

      <UploadEvidenceDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        requirement={selectedRequirement?.requirement || ""}
        onUpload={handleUploadComplete}
      />
    </div>
  );
};