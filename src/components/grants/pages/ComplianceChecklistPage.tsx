import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, CheckCircle, Clock, AlertTriangle, Edit, Eye } from 'lucide-react';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';
import { AddComplianceDialog } from '@/components/grants/view/AddComplianceDialog';
import { ComplianceViewDialog } from '@/components/grants/ngo/ComplianceViewDialog';
import { UploadEvidenceDialog } from '@/components/grants/view/UploadEvidenceDialog';
import { GrantCompliance } from '@/types/grants';

export const ComplianceChecklistPage = () => {
  const { compliance, loading, createCompliance, updateCompliance } = useGrantCompliance();
  const [isCreating, setIsCreating] = useState(false);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<GrantCompliance | null>(null);
  const [editingRequirement, setEditingRequirement] = useState<GrantCompliance | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'in_progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'overdue':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const completedCount = compliance.filter(c => c.status === 'completed').length;
  const totalCount = compliance.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateCompliance = async () => {
    setEditingRequirement(null);
    setAddDialogOpen(true);
  };

  const handleEditRequirement = (requirement: GrantCompliance) => {
    setEditingRequirement(requirement);
    setAddDialogOpen(true);
  };

  const handleViewRequirement = (requirement: GrantCompliance) => {
    setSelectedRequirement(requirement);
    setViewDialogOpen(true);
  };

  const handleViewEvidence = (requirement: GrantCompliance) => {
    setSelectedRequirement(requirement);
    setUploadDialogOpen(true);
  };

  const handleSaveRequirement = async (requirementData: Omit<GrantCompliance, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      if (editingRequirement) {
        await updateCompliance(editingRequirement.id, requirementData);
      } else {
        await createCompliance(requirementData);
      }
      setAddDialogOpen(false);
      setEditingRequirement(null);
    } catch (error) {
      console.error('Error saving compliance requirement:', error);
    }
  };

  const handleUploadComplete = async () => {
    setUploadDialogOpen(false);
    setSelectedRequirement(null);
    // Refresh the compliance data since the upload hook updates the record
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Checklist</h1>
          <p className="text-muted-foreground">
            Monitor compliance requirements and track completion status
          </p>
        </div>
        <Button onClick={handleCreateCompliance} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {compliance.filter(c => c.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {compliance.filter(c => c.status === 'overdue').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          {compliance.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Compliance Requirements</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first compliance requirement
              </p>
              <Button onClick={handleCreateCompliance}>
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Evidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compliance.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="font-medium">{item.requirement}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(item.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.evidence_document ? (
                          <Button variant="outline" size="sm" onClick={() => handleViewEvidence(item)}>
                            View Evidence
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">No evidence</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditRequirement(item)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewRequirement(item)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddComplianceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveRequirement}
        editingRequirement={editingRequirement}
      />

      <ComplianceViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        requirement={selectedRequirement}
      />

      <UploadEvidenceDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        requirement={selectedRequirement!}
        onUpload={handleUploadComplete}
      />
    </div>
  );
};