
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, X } from "lucide-react";
import { ContactPersonForm, ContactPerson } from "./ContactPersonForm";
import { focusAreasData, getFocusAreaColor } from "@/data/focusAreaData";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { FocusAreaForm } from "./FocusAreaForm";
import { FocusArea } from "@/types/donor";
import { useToast } from "@/hooks/use-toast";

interface NewDonorFormProps {
  onSubmit: (donorData: any) => void;
  onCancel: () => void;
}

export const NewDonorForm: React.FC<NewDonorFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    organization: "",
    affiliation: "",
    organizationUrl: "",
    fundingStartDate: "",
    fundingEndDate: "",
    note: "",
  });

  const [contacts, setContacts] = useState<ContactPerson[]>([
    { id: "1", fullName: "", email: "", phone: "" }
  ]);

  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; contactId: string }>({
    show: false,
    contactId: ""
  });
  const [focusAreaOpen, setFocusAreaOpen] = useState(false);
  const { toast } = useToast();

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

  const toggleFocusArea = (areaName: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(areaName) 
        ? prev.filter(area => area !== areaName)
        : [...prev, areaName]
    );
  };

  const handleFocusAreaSave = (focusAreaData: Omit<FocusArea, 'id'>) => {
    console.log("New focus area data:", focusAreaData);
    setFocusAreaOpen(false);
    toast({
      title: "Focus Area Created",
      description: `${focusAreaData.name} has been successfully created.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.organization.trim()) {
      alert("Organization name is required");
      return;
    }

    const validContacts = contacts.filter(contact => 
      contact.fullName.trim() && contact.email.trim() && contact.phone.trim()
    );

    if (validContacts.length === 0) {
      alert("At least one complete contact person is required");
      return;
    }

    const donorData = {
      ...formData,
      contacts: validContacts,
      focusAreas: selectedFocusAreas,
      documents: uploadedFiles
    };

    onSubmit(donorData);
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
  {focusAreasData.map(area => {
    const isSelected = selectedFocusAreas.includes(area.name)
    return (
      <Badge
        key={area.id}
        onClick={() => toggleFocusArea(area.name)}
        className={`
          inline-block
          w
          text-center
          transition-colors 
          ${ isSelected ? 'bg-blue-50' : 'hover:bg-gray-50' }
          ${ getFocusAreaColor(area.name) } 
          text-xs 
          rounded-sm
        `}
      >
        {area.name}
      </Badge>
    )
  })}
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
          
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
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
              ))}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Drag and drop files here or</p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
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
          <Button type="submit">
            Create Donor
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
