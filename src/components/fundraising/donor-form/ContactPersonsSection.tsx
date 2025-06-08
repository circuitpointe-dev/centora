
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContactPersonForm, ContactPerson } from "../ContactPersonForm";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface ContactPersonsSectionProps {
  contacts: ContactPerson[];
  onContactsChange: (contacts: ContactPerson[]) => void;
}

export const ContactPersonsSection: React.FC<ContactPersonsSectionProps> = ({
  contacts,
  onContactsChange,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; contactId: string }>({
    show: false,
    contactId: ""
  });

  const addContact = () => {
    const newContact: ContactPerson = {
      id: Date.now().toString(),
      fullName: "",
      email: "",
      phone: ""
    };
    onContactsChange([...contacts, newContact]);
  };

  const updateContact = (id: string, updatedContact: ContactPerson) => {
    onContactsChange(contacts.map(contact => 
      contact.id === id ? updatedContact : contact
    ));
  };

  const deleteContact = (id: string) => {
    onContactsChange(contacts.filter(contact => contact.id !== id));
    setDeleteConfirm({ show: false, contactId: "" });
  };

  const handleDeleteContact = (id: string) => {
    if (contacts.length > 1) {
      setDeleteConfirm({ show: true, contactId: id });
    }
  };

  return (
    <>
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

      <ConfirmationDialog
        open={deleteConfirm.show}
        onOpenChange={(open) => setDeleteConfirm({ show: open, contactId: "" })}
        title="Delete Contact Person"
        description="Are you sure you want to delete this contact person? This action cannot be undone."
        onConfirm={() => deleteContact(deleteConfirm.contactId)}
      />
    </>
  );
};
