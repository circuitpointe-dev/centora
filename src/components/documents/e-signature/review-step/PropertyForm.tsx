
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Edit, Trash2 } from "lucide-react";
import { SignatureDialog } from "./SignatureDialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email" | "text";
  icon: React.ReactNode;
}

interface PropertyFormProps {
  selectedField: Field;
}

export const PropertyForm = ({ selectedField }: PropertyFormProps) => {
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fieldName, setFieldName] = useState(selectedField.name);
  const [hasSignature, setHasSignature] = useState(false);

  const handleSignatureSave = (signatureData: { type: string; data: string }) => {
    setHasSignature(true);
    console.log("Signature saved:", signatureData);
  };

  const handleDelete = () => {
    console.log("Deleting field:", selectedField.id);
    setShowDeleteDialog(false);
  };

  if (selectedField.type === "signature") {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Signature</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-gray-500 hover:text-violet-600"
                onClick={() => setShowSignatureDialog(true)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-gray-500 hover:text-red-600"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-900 block mb-1">
                Assigned to
              </label>
              <Select defaultValue="chioma" disabled>
                <SelectTrigger className="h-8 text-xs bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-blue-600" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chioma">Chioma Ike (Me)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-900 block mb-1">
                Required
              </label>
              <Select defaultValue="yes">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-900 block mb-1">
                Field Name
              </label>
              <Input 
                className="h-8 text-xs" 
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <SignatureDialog
          open={showSignatureDialog}
          onOpenChange={setShowSignatureDialog}
          onSave={handleSignatureSave}
        />

        <ConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Field"
          description="Are you sure you want to delete this signature field? This action cannot be undone."
          onConfirm={handleDelete}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />
      </>
    );
  }

  // For text-based fields (name, date, email, text)
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedField.icon}
            <span className="text-sm font-medium text-gray-900">{selectedField.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-500 hover:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Assigned to
            </label>
            <Select defaultValue="chioma" disabled>
              <SelectTrigger className="h-8 text-xs bg-gray-50 border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-blue-600" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chioma">Chioma Ike (Me)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Required
            </label>
            <Select defaultValue="yes">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Formatting
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="uppercase">Uppercase</SelectItem>
                <SelectItem value="lowercase">Lowercase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Field Name
            </label>
            <Input 
              className="h-8 text-xs" 
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Field"
        description={`Are you sure you want to delete this ${selectedField.name.toLowerCase()} field? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};
