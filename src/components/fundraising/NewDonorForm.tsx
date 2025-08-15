import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Upload, X, AlertCircle } from "lucide-react";
import { ContactPersonForm, ContactPerson } from "./ContactPersonForm";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
];
import { FocusAreaForm } from "./FocusAreaForm";
import { FocusArea, useFocusAreas } from "@/hooks/useFocusAreas";
import { useCreateDonor, useUpdateDonor, type Donor, type CreateDonorData, type FundingPeriod } from "@/hooks/useDonors";
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
    status: (initialData?.status as 'potential' | 'active') || 'potential',
    currency: initialData?.currency || 'USD',
    affiliation: initialData?.affiliation || "",
    organizationUrl: initialData?.organization_url || "",
    note: initialData?.notes || "",
  });

  const [fundingPeriods, setFundingPeriods] = useState<Array<{ id: string; name: string; startDate: string; endDate: string }>>([]);

  const [contacts, setContacts] = useState<ContactPerson[]>(
    initialData?.contacts && initialData.contacts.length > 0 
      ? initialData.contacts.map((contact, index) => ({
          id: contact.id || index.toString(),
          fullName: contact.full_name,
          email: contact.email,
          phone: contact.phone
        })) 
      : []
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
    setDeleteConfirm({ show: true, contactId: id });
  };

  const addFundingPeriod = () => {
    const newPeriod = {
      id: Date.now().toString(),
      name: "",
      startDate: "",
      endDate: ""
    };
    setFundingPeriods(prev => [...prev, newPeriod]);
  };

  const updateFundingPeriod = (id: string, field: string, value: string) => {
    setFundingPeriods(prev => prev.map(period => 
      period.id === id ? { ...period, [field]: value } : period
    ));
  };

  const deleteFundingPeriod = (id: string) => {
    setFundingPeriods(prev => prev.filter(period => period.id !== id));
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
    refetch();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const allFiles = [...uploadedFiles, ...newFiles];
      
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
      
      setUploadedFiles(allFiles);
    }
    
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    
    const validation = validateFiles(newFiles);
    setFileValidationErrors(validation.errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - only organization name is required
    if (!formData.organization.trim()) {
      toast({
        title: "Validation Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    // Validate funding periods if any exist
    const validFundingPeriods = fundingPeriods.filter(period => 
      period.startDate && period.endDate
    );

    for (const period of validFundingPeriods) {
      if (new Date(period.startDate) >= new Date(period.endDate)) {
        toast({
          title: "Validation Error",
          description: "Funding period start date must be before end date",
          variant: "destructive",
        });
        return;
      }
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

    const validContacts = contacts.filter(contact => 
      contact.fullName.trim() && contact.email.trim() && contact.phone.trim()
    );

    const donorData: CreateDonorData = {
      name: formData.organization,
      status: formData.status,
      currency: formData.currency,
      affiliation: formData.affiliation,
      organization_url: formData.organizationUrl,
      funding_periods: validFundingPeriods.map(period => ({
        name: period.name || undefined,
        start_date: period.startDate,
        end_date: period.endDate,
      })),
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
        status: 'potential',
        currency: 'USD',
        affiliation: "",
        organizationUrl: "",
        note: ""
      });
      setContacts([]);
      setFundingPeriods([]);
      setSelectedFocusAreas([]);
      setUploadedFiles([]);
      setFileValidationErrors([]);
      
      onCancel(); // Close the form
      onSubmit?.(donorData); // Call optional callback
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save donor";
      
      // Check for duplicate name error
      if (errorMessage.includes("already exists")) {
        toast({
          title: "Duplicate Organization",
          description: "An organization with this name already exists. Please use a different name.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  // helper to check if a contact row has any data
  const hasContactData = (c: ContactPerson) =>
    !!c.fullName.trim() || !!c.email.trim() || !!c.phone.trim();
  
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

          {/* Donor Status */}
          <div>
            <Label className="text-sm text-gray-600">Donor Status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
              className="flex flex-row gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="potential" id="potential" />
                <Label htmlFor="potential" className="text-sm">Potential</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="text-sm">Active</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Currency Selection */}
          <div>
            <Label className="text-sm text-gray-600">Preferred Currency *</Label>
            <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <h3 className="font-medium text-gray-900">Contact Persons (Optional)</h3>
            <Button
              type="button" // ensure not a submit
              variant="outline"
              size="sm"
              onClick={addContact}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </div>
        
          {contacts.length > 0 && (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <ContactPersonForm
                  key={contact.id}
                  contact={contact}
                  onUpdate={(updatedContact) => updateContact(contact.id, updatedContact)}
                  onDelete={() => handleDeleteContact(contact.id)}
                  canDelete={hasContactData(contact)} // only show delete when row has data
                />
              ))}
            </div>
          )}
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

        {/* Funding Periods */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Funding Periods (Optional)</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFundingPeriod}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Period
            </Button>
          </div>

          {fundingPeriods.length > 0 && (
            <div className="space-y-4">
              {fundingPeriods.map((period) => (
                <div key={period.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Funding Period</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFundingPeriod(period.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-600">Period Name (Optional)</Label>
                    <Input
                      value={period.name}
                      onChange={(e) => updateFundingPeriod(period.id, 'name', e.target.value)}
                      placeholder="e.g., Q1 2024, Annual Grant"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Start Date</Label>
                      <Input
                        type="date"
                        value={period.startDate}
                        onChange={(e) => updateFundingPeriod(period.id, 'startDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-600">End Date</Label>
                      <Input
                        type="date"
                        value={period.endDate}
                        onChange={(e) => updateFundingPeriod(period.id, 'endDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          
          {(uploadedFiles.length > 0 || fileValidationErrors.length > 0) && (
            <div className="text-sm text-gray-600">
              {getFileValidationSummary(validateFiles(uploadedFiles))}
            </div>
          )}
          
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
            className="bg-violet-600 hover:bg-violet-700 text-white"
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
        onConfirm={() => {
          deleteContact(deleteConfirm.contactId);
        }}
      />
    </div>
  );
};