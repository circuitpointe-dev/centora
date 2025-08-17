import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, X, AlertCircle } from "lucide-react";
import { ContactPersonForm, ContactPerson } from "./ContactPersonForm";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { FocusAreaForm } from "./FocusAreaForm";
import { FocusArea, useFocusAreas } from "@/hooks/useFocusAreas";
import { useCreateDonor, useUpdateDonor, type Donor, type CreateDonorData } from "@/hooks/useDonors";
import { useToast } from "@/hooks/use-toast";
import { validateFiles, formatFileSize, getFileValidationSummary, type FileValidationError } from "@/utils/fileValidation";

interface NewDonorFormProps {
  onSubmit?: (donorData: any) => void;
  onCancel: () => void;
  initialData?: Donor;
  isEditing?: boolean;
}

export const NewDonorForm: React.FC<NewDonorFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}) => {
  const { toast } = useToast();
  const createDonorMutation = useCreateDonor();
  const updateDonorMutation = useUpdateDonor();
  const { focusAreas, loading: focusAreasLoading, refetch } = useFocusAreas();
  
  const [formData, setFormData] = useState({
    organization: initialData?.name || "",
    affiliation: initialData?.affiliation || "",
    organizationUrl: initialData?.organization_url || "",
    fundingStartDate: initialData?.funding_start_date || "",
    fundingEndDate: initialData?.funding_end_date || "",
    note: initialData?.notes || "",
  });

  const [contacts, setContacts] = useState<ContactPerson[]>(
    initialData?.contacts ? initialData.contacts.map((contact, index) => ({
      id: contact.id || index.toString(),
      fullName: contact.full_name,
      email: contact.email,
      phone: contact.phone
    })) : [{ id: "1", fullName: "", email: "", phone: "" }]
  );

  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>(
    initialData?.focus_areas?.map(fa => fa.focus_area_id) || []
  );

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileValidationErrors, setFileValidationErrors] = useState<FileValidationError[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; contactId: string }>({
    show: false,
    contactId: ""
  });
  const [focusAreaOpen, setFocusAreaOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addContact = () => {
    const newContact: ContactPerson = {
      id: Date.now().toString(),
      fullName: "",
      email: "",
      phone: ""
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (id: string, updatedContact: ContactPerson) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? updatedContact : contact
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    setDeleteConfirm({ show: false, contactId: "" });
  };

  const handleDeleteContact = (id: string) => {
    if (contacts.length > 1) {
      setDeleteConfirm({ show: true, contactId: id });
    }
  };

  const toggleFocusArea = (areaId: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleFocusAreaSave = () => {
    setFocusAreaOpen(false);
    // Refresh focus areas to show the newly created one
    refetch();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const allFiles = [...uploadedFiles, ...newFiles];
      
      // Validate all files together
      const validation = validateFiles(allFiles);
      
      if (validation.errors.length > 0) {
        setFileValidationErrors(validation.errors);
        toast({
          title: "File Validation Error",
          description: getFileValidationSummary(validation),
          variant: "destructive",
        });
      } else {
        setFileValidationErrors([]);
      }
      
      // Always update files, but user will see validation errors
      setUploadedFiles(allFiles);
    }
    
    // Reset the input
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    
    // Re-validate remaining files
    const validation = validateFiles(newFiles);
    setFileValidationErrors(validation.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.organization.trim()) {
      toast({
        title: "Validation Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    const validContacts = contacts.filter(contact => 
      contact.fullName.trim() && contact.email.trim() && contact.phone.trim()
    );

    if (validContacts.length === 0) {
      toast({
        title: "Validation Error", 
        description: "At least one complete contact person is required",
        variant: "destructive",
      });
      return;
    }

    // Validate files before submission
    if (uploadedFiles.length > 0) {
      const validation = validateFiles(uploadedFiles);
      if (validation.errors.length > 0) {
        toast({
          title: "File Validation Error",
          description: "Please fix file validation errors before submitting",
          variant: "destructive",
        });
        return;
      }
    }

    const donorData: CreateDonorData = {
      name: formData.organization,
      affiliation: formData.affiliation,
      organization_url: formData.organizationUrl,
      funding_start_date: formData.fundingStartDate,
      funding_end_date: formData.fundingEndDate,
      notes: formData.note,
      contacts: validContacts.map(contact => ({
        full_name: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        is_primary: false,
      })),
      focus_area_ids: selectedFocusAreas,
      documents: uploadedFiles,
    };

    try {
      if (isEditing && initialData) {
        await updateDonorMutation.mutateAsync({ 
          id: initialData.id, 
          donorData 
        });
        toast({
          title: "Success",
          description: "Donor updated successfully",
        });
      } else {
        await createDonorMutation.mutateAsync(donorData);
        toast({
          title: "Success", 
          description: "Donor created successfully",
        });
      }
      
      // Clear form after successful submission
      setFormData({
        organization: "",
        affiliation: "",
        organizationUrl: "",
        fundingStartDate: "",
        fundingEndDate: "",
        note: ""
      });
      setContacts([{ id: "1", fullName: "", email: "", phone: "" }]);
      setSelectedFocusAreas([]);
      setUploadedFiles([]);
      setFileValidationErrors([]);
      
      onCancel(); // Close the form
      onSubmit?.(donorData); // Call optional callback
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save donor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Organization Information</h3>
          
          <div>
            <Label className="text-sm text-gray-600">Name of Organization *</Label>
            <Input
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              placeholder="Enter organization name"
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Affiliation</Label>
              <Input
                value={formData.affiliation}
                onChange={(e) => handleInputChange('affiliation', e.target.value)}
                placeholder="Enter affiliation"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm text-gray-600">Organization URL</Label>
              <Input
                type="url"
                value={formData.organizationUrl}
                onChange={(e) => handleInputChange('organizationUrl', e.target.value)}
                placeholder="https://example.org"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Contact Persons */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Contact Persons</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addContact}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>

          <div className="space-y-4">
            {contacts.map((contact) => (
              <ContactPersonForm
                key={contact.id}
                contact={contact}
                onUpdate={(updatedContact) => updateContact(contact.id, updatedContact)}
                onDelete={() => handleDeleteContact(contact.id)}
                canDelete={contacts.length > 1}
              />
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Focus Areas</h3>
            <SideDialog open={focusAreaOpen} onOpenChange={setFocusAreaOpen}>
              <SideDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Focus Area
                </Button>
              </SideDialogTrigger>
              <SideDialogContent className="overflow-hidden">
                <SideDialogHeader>
                  <SideDialogTitle>Create Focus Area</SideDialogTitle>
                </SideDialogHeader>
                <div className="flex-1 overflow-y-auto p-6">
                  <FocusAreaForm
                    onSave={handleFocusAreaSave}
                    onCancel={() => setFocusAreaOpen(false)}
                  />
                </div>
              </SideDialogContent>
            </SideDialog>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            {focusAreasLoading ? (
              <div className="text-sm text-gray-500">Loading focus areas...</div>
            ) : focusAreas.length === 0 ? (
              <div className="text-sm text-gray-500">No focus areas available. Create one first.</div>
            ) : (
               focusAreas.map(area => {
                const isSelected = selectedFocusAreas.includes(area.id);
                // Extract background and text colors from the area.color string
                const colorClasses = area.color.split(' ');
                const bgColor = colorClasses.find(c => c.startsWith('bg-'));
                const textColor = colorClasses.find(c => c.startsWith('text-'));
                
                return (
                  <div
                    key={area.id}
                    onClick={() => toggleFocusArea(area.id)}
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-2
                      text-xs
                      font-medium
                      rounded-sm
                      border
                      cursor-pointer
                      transition-all
                      ${bgColor} ${textColor}
                      ${isSelected 
                        ? 'ring-2 ring-offset-1 ring-current shadow-sm' 
                        : 'hover:ring-1 hover:ring-current hover:ring-opacity-30'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                    {area.name}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Funding Dates */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Funding Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Funding Start Date</Label>
              <Input
                type="date"
                value={formData.fundingStartDate}
                onChange={(e) => handleInputChange('fundingStartDate', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm text-gray-600">Funding End Date</Label>
              <Input
                type="date"
                value={formData.fundingEndDate}
                onChange={(e) => handleInputChange('fundingEndDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Notes (Optional)</h3>
          <Textarea
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            placeholder="Add any additional notes or comments..."
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Document Upload */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Documents</h3>
          
          {/* File Validation Summary */}
          {(uploadedFiles.length > 0 || fileValidationErrors.length > 0) && (
            <div className="text-sm text-gray-600">
              {getFileValidationSummary(validateFiles(uploadedFiles))}
            </div>
          )}
          
          {/* File Validation Errors */}
          {fileValidationErrors.length > 0 && (
            <div className="space-y-2">
              {fileValidationErrors.map((error, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-700">{error.file.name}</p>
                    <ul className="text-xs text-red-600 list-disc list-inside">
                      {error.errors.map((err, errIndex) => (
                        <li key={errIndex}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => {
                const hasError = fileValidationErrors.some(error => error.file === file);
                return (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-2 rounded-md ${
                      hasError ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}
                      <div className="flex-1">
                        <span className={`text-sm truncate ${hasError ? 'text-red-700' : 'text-gray-700'}`}>
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Supported: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, WEBP
              <br />
              Max 10MB per file, 50MB total
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx,.jpg,.jpeg,.png,.gif,.webp"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Browse Files
            </Button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="brand-purple"
            disabled={
              createDonorMutation.isPending || 
              updateDonorMutation.isPending || 
              fileValidationErrors.length > 0
            }
          >
            {createDonorMutation.isPending || updateDonorMutation.isPending 
              ? "Saving..." 
              : isEditing ? 'Update Donor' : 'Create Donor'
            }
          </Button>
        </div>
      </form>

      <ConfirmationDialog
        open={deleteConfirm.show}
        onOpenChange={(open) => setDeleteConfirm({ show: open, contactId: "" })}
        title="Delete Contact Person"
        description="Are you sure you want to delete this contact person? This action cannot be undone."
        onConfirm={() => deleteContact(deleteConfirm.contactId)}
      />
    </div>
  );
};