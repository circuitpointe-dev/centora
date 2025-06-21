
import React, { useState } from "react";
import { Plus, MoreVertical, Eye, CheckCircle, Clock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { complianceData, ComplianceRequirement } from "../data/complianceData";
import { AddComplianceDialog } from "./AddComplianceDialog";
import { UploadEvidenceDialog } from "./UploadEvidenceDialog";

interface ComplianceTableProps {
  grantId: number;
}

export const ComplianceTable = ({ grantId }: ComplianceTableProps) => {
  const [requirements, setRequirements] = useState(
    complianceData.filter(r => r.grantId === grantId)
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ComplianceRequirement | null>(null);

  const handleAddNew = () => {
    setAddDialogOpen(true);
  };

  const handleUploadEvidence = (requirement: ComplianceRequirement) => {
    setSelectedRequirement(requirement);
    setUploadDialogOpen(true);
  };

  const handleViewDocument = (documentName: string) => {
    console.log('Viewing document:', documentName);
    // TODO: Implement document viewing logic
  };

  const handleSaveRequirement = (requirementData: Omit<ComplianceRequirement, 'id' | 'grantId'>) => {
    const newRequirement: ComplianceRequirement = {
      id: Math.max(...requirements.map(r => r.id), 0) + 1,
      grantId,
      ...requirementData,
    };
    setRequirements(prev => [...prev, newRequirement]);
  };

  const handleUploadComplete = (fileName: string) => {
    if (selectedRequirement) {
      setRequirements(prev =>
        prev.map(r =>
          r.id === selectedRequirement.id
            ? { ...r, status: 'Completed' as const, evidenceDocument: fileName }
            : r
        )
      );
      setSelectedRequirement(null);
    }
  };

  const getStatusIcon = (status: ComplianceRequirement['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ComplianceRequirement['status']) => {
    switch (status) {
      case 'Completed':
        return 'text-green-800 bg-green-100';
      case 'In Progress':
        return 'text-yellow-800 bg-yellow-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Checklist</h2>
        <Button
          onClick={handleAddNew}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="border border-gray-200 rounded-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-black">Requirement</TableHead>
              <TableHead className="font-semibold text-black">Due Date</TableHead>
              <TableHead className="font-semibold text-black">Status</TableHead>
              <TableHead className="font-semibold text-black">Evidence</TableHead>
              <TableHead className="font-semibold text-black text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map((requirement) => (
              <TableRow key={requirement.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-black">
                  {requirement.requirement}
                </TableCell>
                <TableCell className="text-gray-600">
                  <span className={requirement.status === 'Completed' ? 'line-through' : ''}>
                    {new Date(requirement.dueDate).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(requirement.status)}
                    <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(requirement.status)}`}>
                      {requirement.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {requirement.status === 'Completed' && requirement.evidenceDocument ? (
                    <span className="text-blue-600 underline cursor-pointer">
                      {requirement.evidenceDocument}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {requirement.status === 'Completed' && requirement.evidenceDocument ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDocument(requirement.evidenceDocument!)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUploadEvidence(requirement)}
                        className="text-xs px-3 py-1 h-7 border-gray-300"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload Evidence
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {requirements.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No compliance requirements found for this grant.</p>
        </div>
      )}

      <AddComplianceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveRequirement}
      />

      <UploadEvidenceDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        requirement={selectedRequirement?.requirement || ""}
        onUpload={handleUploadComplete}
      />
    </div>
  );
};
