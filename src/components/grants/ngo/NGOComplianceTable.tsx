import React, { useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';
import { ComplianceViewDialog } from './ComplianceViewDialog';
import { UploadEvidenceDialog } from '../view/UploadEvidenceDialog';
import { useToast } from "@/hooks/use-toast";
import { GrantCompliance } from "@/types/grants";

interface NGOComplianceTableProps {
  grantId: string;
}

export const NGOComplianceTable = ({ grantId }: NGOComplianceTableProps) => {
  const { toast } = useToast();
  const { compliance: grantCompliance, updateCompliance } = useGrantCompliance(grantId);
  const [selectedRequirement, setSelectedRequirement] = useState<GrantCompliance | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewRequirement = (requirement: GrantCompliance) => {
    setSelectedRequirement(requirement);
    setIsViewDialogOpen(true);
  };

  const handleUploadEvidence = (requirement: GrantCompliance) => {
    setSelectedRequirement(requirement);
    setIsUploadDialogOpen(true);
  };

  const handleUploadComplete = async (fileName: string) => {
    if (selectedRequirement) {
      try {
        await updateCompliance(selectedRequirement.id, {
          status: 'completed',
          evidence_document: fileName
        });
        toast({
          title: "Evidence Uploaded",
          description: `${fileName} has been uploaded successfully.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload evidence. Please try again.",
          variant: "destructive",
        });
      }
    }
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
                <TableCell>{new Date(requirement.due_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(requirement.status)}>
                    {requirement.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  {requirement.evidence_document ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{requirement.evidence_document}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {requirement.status === 'completed' ? (
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
                        Submit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {grantCompliance.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No compliance requirements found for this grant.</p>
        </div>
      )}

      <ComplianceViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        requirement={selectedRequirement}
      />

      <UploadEvidenceDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        requirement={selectedRequirement?.requirement || ""}
        requirementData={selectedRequirement}
        onUpload={handleUploadComplete}
      />
    </div>
  );
};