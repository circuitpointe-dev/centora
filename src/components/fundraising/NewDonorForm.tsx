
import React, { useState } from "react";
import { ContactPerson } from "./ContactPersonForm";
import { useToast } from "@/hooks/use-toast";
import { OrganizationInfoSection } from "./donor-form/OrganizationInfoSection";
import { ContactPersonsSection } from "./donor-form/ContactPersonsSection";
import { FocusAreasSection } from "./donor-form/FocusAreasSection";
import { FundingDatesSection } from "./donor-form/FundingDatesSection";
import { NotesSection } from "./donor-form/NotesSection";
import { DocumentUploadSection } from "./donor-form/DocumentUploadSection";
import { FormActionsSection } from "./donor-form/FormActionsSection";

interface NewDonorFormProps {
  onSubmit: (donorData: any) => void;
  onCancel: () => void;
}

export const NewDonorForm: React.FC<NewDonorFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFocusArea = (areaName: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(areaName) 
        ? prev.filter(area => area !== areaName)
        : [...prev, areaName]
    );
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
    
    // Show success toast
    toast({
      title: "Donor Created Successfully",
      description: `${formData.organization} has been added to your donor list.`,
    });
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <OrganizationInfoSection
          formData={formData}
          onInputChange={handleInputChange}
        />

        <ContactPersonsSection
          contacts={contacts}
          onContactsChange={setContacts}
        />

        <FocusAreasSection
          selectedFocusAreas={selectedFocusAreas}
          onToggleFocusArea={toggleFocusArea}
        />

        <FundingDatesSection
          formData={formData}
          onInputChange={handleInputChange}
        />

        <NotesSection
          note={formData.note}
          onNoteChange={(note) => handleInputChange('note', note)}
        />

        <DocumentUploadSection
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onRemoveFile={removeFile}
        />

        <FormActionsSection onCancel={onCancel} />
      </form>
    </div>
  );
};
