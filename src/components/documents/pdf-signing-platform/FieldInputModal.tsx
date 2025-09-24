import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Mail, Building, User, Type } from 'lucide-react';

interface FieldInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  fieldType: 'date' | 'text' | 'name' | 'initials';
  fieldLabel: string;
  initialValue?: string;
}

const FieldInputModal: React.FC<FieldInputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  fieldType,
  fieldLabel,
  initialValue = ''
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
      onClose();
    }
  };

  const getIcon = () => {
    switch (fieldType) {
      case 'date':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'text':
        return <Building className="w-5 h-5 text-purple-600" />;
      case 'name':
        return <User className="w-5 h-5 text-orange-600" />;
      case 'initials':
        return <Type className="w-5 h-5 text-blue-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPlaceholder = () => {
    switch (fieldType) {
      case 'date':
        return 'MM/DD/YYYY or select a date';
      case 'text':
        return 'Enter text';
      case 'name':
        return 'Enter full name';
      case 'initials':
        return 'Enter initials (e.g., AC)';
      default:
        return `Enter ${fieldLabel.toLowerCase()}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getIcon()}
            <span>Enter {fieldLabel}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="field-input" className="text-sm font-medium">
              {fieldLabel}
            </Label>
            <Input
              id="field-input"
              type={fieldType === 'date' ? 'date' : 'text'}
              placeholder={getPlaceholder()}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!value.trim()}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FieldInputModal;