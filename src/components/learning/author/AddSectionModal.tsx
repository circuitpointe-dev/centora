import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [sectionTitle, setSectionTitle] = useState('Module 1: Introduction to digital tools');

  const handleSave = () => {
    if (sectionTitle.trim()) {
      onSave(sectionTitle.trim());
      setSectionTitle('Module 1: Introduction to digital tools');
      onClose();
    }
  };

  const handleCancel = () => {
    setSectionTitle('Module 1: Introduction to digital tools');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">New section</h2>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="sectionTitle" className="text-sm font-medium text-foreground mb-2 block">
              Section title
            </label>
            <Input
              id="sectionTitle"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Enter section title"
              className="w-full"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Save
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddSectionModal;
