
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, RotateCcw } from 'lucide-react';
import DocumentOwnerSelect from './upload-components/DocumentOwnerSelect';
import DepartmentSelect from './upload-components/DepartmentSelect';
import TagSelection from './upload-components/TagSelection';

interface RestoreVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versionData: { user: { name: string; avatar: string }; date: string; action: string } | null;
  onRestore: (action: 'overwrite' | 'saveAs', details?: { title: string; owner: any; department: any; tags: string[] }) => void;
}

const RestoreVersionDialog = ({ open, onOpenChange, versionData, onRestore }: RestoreVersionDialogProps) => {
  const [showSaveAsForm, setShowSaveAsForm] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleOverwrite = () => {
    onRestore('overwrite');
    onOpenChange(false);
    setShowSaveAsForm(false);
  };

  const handleSaveAs = () => {
    if (title && selectedOwner && selectedDepartment) {
      onRestore('saveAs', {
        title,
        owner: selectedOwner,
        department: selectedDepartment,
        tags: selectedTags
      });
      onOpenChange(false);
      setShowSaveAsForm(false);
      // Reset form
      setTitle('');
      setSelectedOwner(null);
      setSelectedDepartment(null);
      setSelectedTags([]);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setShowSaveAsForm(false);
    // Reset form
    setTitle('');
    setSelectedOwner(null);
    setSelectedDepartment(null);
    setSelectedTags([]);
  };

  if (!versionData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border border-gray-200">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Restore Version
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Restore version from {versionData.date} by {versionData.user.name}
          </p>
        </DialogHeader>

        {!showSaveAsForm ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose how you want to restore this version:
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleOverwrite}
                className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Overwrite Current Document
              </Button>
              
              <Button
                onClick={() => setShowSaveAsForm(true)}
                variant="outline"
                className="w-full justify-start border-gray-300"
              >
                <Save className="w-4 h-4 mr-2" />
                Save As New Document
              </Button>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 text-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Document Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Document Owner
              </Label>
              <DocumentOwnerSelect
                selectedOwner={selectedOwner}
                onOwnerChange={setSelectedOwner}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Department
              </Label>
              <DepartmentSelect
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Tags (Optional)
              </Label>
              <TagSelection
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowSaveAsForm(false)}
                className="border-gray-300 text-gray-700"
              >
                Back
              </Button>
              <Button
                onClick={handleSaveAs}
                disabled={!title || !selectedOwner || !selectedDepartment}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Save As New Document
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RestoreVersionDialog;
