import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GrantCompliance } from "@/types/grants";
import { useGrants } from "@/hooks/grants/useGrants";

interface AddComplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (requirement: Omit<GrantCompliance, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => void;
  editingRequirement?: GrantCompliance | null;
}

export const AddComplianceDialog: React.FC<AddComplianceDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  editingRequirement,
}) => {
  const { grants, loading: grantsLoading } = useGrants();
  const [requirement, setRequirement] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [status, setStatus] = useState<'in_progress' | 'completed' | 'overdue'>('in_progress');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [selectedGrantId, setSelectedGrantId] = useState<string>("");

  const isEditing = !!editingRequirement;

  // Populate form when editing
  useEffect(() => {
    if (editingRequirement) {
      setRequirement(editingRequirement.requirement);
      setDueDate(new Date(editingRequirement.due_date));
      setStatus(editingRequirement.status);
      setSelectedGrantId(editingRequirement.grant_id);
      setEvidenceFile(null); // Reset file input for editing
    } else {
      // Reset form for adding new
      setRequirement("");
      setDueDate(undefined);
      setStatus('in_progress');
      setSelectedGrantId("");
      setEvidenceFile(null);
    }
  }, [editingRequirement, open]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
    }
  };

  const handleSave = () => {
    if (!requirement || !dueDate || (!isEditing && !selectedGrantId)) return;

    onSave({
      requirement,
      due_date: format(dueDate, "yyyy-MM-dd"),
      status,
      evidence_document: evidenceFile ? evidenceFile.name : editingRequirement?.evidence_document,
      grant_id: isEditing ? editingRequirement!.grant_id : selectedGrantId,
    });

    // Reset form
    setRequirement("");
    setDueDate(undefined);
    setStatus('in_progress');
    setSelectedGrantId("");
    setEvidenceFile(null);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setRequirement("");
    setDueDate(undefined);
    setStatus('in_progress');
    setSelectedGrantId("");
    setEvidenceFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {isEditing ? "Edit Compliance Requirement" : "Add New Compliance Requirement"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Grant Selection - only show when adding new requirement */}
          {!isEditing && (
            <div className="space-y-2">
              <Label className="text-gray-700">Select Grant</Label>
              <Select value={selectedGrantId} onValueChange={setSelectedGrantId}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Choose a grant" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {grantsLoading ? (
                    <SelectItem value="" disabled>Loading grants...</SelectItem>
                  ) : grants.length === 0 ? (
                    <SelectItem value="" disabled>No grants available</SelectItem>
                  ) : (
                    grants.map((grant) => (
                      <SelectItem key={grant.id} value={grant.id}>
                        {grant.grant_name} - {grant.donor_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="requirement" className="text-gray-700">
              Requirement
            </Label>
            <Input
              id="requirement"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Enter compliance requirement"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-300",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Status</Label>
            <Select value={status} onValueChange={(value: 'in_progress' | 'completed' | 'overdue') => setStatus(value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Evidence (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-sm p-4 text-center">
              <label className="cursor-pointer">
                <span className="text-purple-600 hover:text-purple-700 underline">
                  Browse files
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {evidenceFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {evidenceFile.name}
                </p>
              )}
              {isEditing && editingRequirement?.evidence_document && !evidenceFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Current: {editingRequirement.evidence_document}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!requirement || !dueDate || (!isEditing && !selectedGrantId)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};