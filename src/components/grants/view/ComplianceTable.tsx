import React, { useState } from "react";
import { Plus, MoreVertical, Eye, CheckCircle, Clock, Upload, Edit } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGrantCompliance } from "@/hooks/grants/useGrantCompliance";
import { AddComplianceDialog } from "./AddComplianceDialog";
import { UploadEvidenceDialog } from "./UploadEvidenceDialog";
import { GrantCompliance } from "@/types/grants";

interface ComplianceTableProps {
  grantId: string;
  isEditMode?: boolean;
}

export const ComplianceTable = ({ grantId, isEditMode = false }: ComplianceTableProps) => {
  const { compliance: requirements, createCompliance, updateCompliance } = useGrantCompliance(grantId);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<GrantCompliance | null>(null);
  const [editingRequirement, setEditingRequirement] = useState<GrantCompliance | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalItems = requirements.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequirements = requirements.slice(startIndex, endIndex);

  const handleAddNew = () => {
    setEditingRequirement(null);
    setAddDialogOpen(true);
  };

  const handleEdit = (requirement: GrantCompliance) => {
    setEditingRequirement(requirement);
    setAddDialogOpen(true);
  };

  const handleUploadEvidence = (requirement: GrantCompliance) => {
    setSelectedRequirement(requirement);
    setUploadDialogOpen(true);
  };

  const handleViewDocument = (documentName: string) => {
    console.log('Viewing document:', documentName);
    // TODO: Implement document viewing logic
  };

  const handleSaveRequirement = async (requirementData: Omit<GrantCompliance, 'id' | 'grant_id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      if (editingRequirement) {
        await updateCompliance(editingRequirement.id, requirementData);
      } else {
        await createCompliance({
          ...requirementData,
          grant_id: grantId,
        });
      }
      setEditingRequirement(null);
    } catch (error) {
      console.error('Error saving compliance requirement:', error);
    }
  };

  const handleUploadComplete = async (fileName: string) => {
    if (selectedRequirement) {
      try {
        await updateCompliance(selectedRequirement.id, {
          status: 'completed',
          evidence_document: fileName
        });
        setSelectedRequirement(null);
      } catch (error) {
        console.error('Error updating compliance:', error);
      }
    }
  };

  const getStatusIcon = (status: GrantCompliance['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: GrantCompliance['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-800 bg-green-100';
      case 'in_progress':
        return 'text-yellow-800 bg-yellow-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Checklist</h2>
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
            {currentRequirements.map((requirement) => (
              <TableRow key={requirement.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-black">
                  {requirement.requirement}
                </TableCell>
                <TableCell className="text-gray-600">
                  <span className={requirement.status === 'completed' ? 'line-through' : ''}>
                    {new Date(requirement.due_date).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(requirement.status)}
                    <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(requirement.status)}`}>
                      {requirement.status.replace('_', ' ')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {requirement.status === 'completed' && requirement.evidence_document ? (
                    <span className="text-blue-600 underline cursor-pointer">
                      {requirement.evidence_document}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-gray-200 z-50">
                        {requirement.status === 'completed' && requirement.evidence_document ? (
                          <DropdownMenuItem
                            onClick={() => handleViewDocument(requirement.evidence_document!)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            View Document
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleEdit(requirement)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUploadEvidence(requirement)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Upload className="h-4 w-4" />
                              Upload Evidence
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <AddComplianceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveRequirement}
        editingRequirement={editingRequirement}
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