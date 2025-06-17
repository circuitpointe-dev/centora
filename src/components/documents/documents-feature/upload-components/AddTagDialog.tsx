
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

interface AddTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTag: (tagName: string, tagColor: string) => void;
}

const colorOptions = [
  { name: 'Purple', value: 'bg-[#f9e6fd] text-[#cb27f5]' },
  { name: 'Green', value: 'bg-[#e8fbef] text-[#17a34b]' },
  { name: 'Orange', value: 'bg-[#fef3e2] text-[#f59e0b]' },
  { name: 'Blue', value: 'bg-[#eff6ff] text-[#3b82f6]' },
  { name: 'Red', value: 'bg-[#fef2f2] text-[#ef4444]' },
  { name: 'Gray', value: 'bg-[#f3f4f6] text-[#6b7280]' },
];

const AddTagDialog = ({ open, onOpenChange, onAddTag }: AddTagDialogProps) => {
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  const handleAdd = () => {
    if (tagName.trim()) {
      onAddTag(tagName.trim(), selectedColor);
      setTagName('');
      setSelectedColor(colorOptions[0].value);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-gray-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900 font-bold">Add New Tag</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tagName" className="font-medium text-[#383838e6] text-sm">
              Tag Name
            </Label>
            <Input
              id="tagName"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter tag name..."
              className="px-4 py-3 rounded-[3px] border border-[#d9d9d9]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-medium text-[#383838e6] text-sm">
              Color
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`p-3 rounded-[3px] border-2 transition-colors ${
                    selectedColor === color.value 
                      ? 'border-violet-600' 
                      : 'border-gray-200'
                  } ${color.value}`}
                >
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 rounded-[3px] border border-[#d9d9d9]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!tagName.trim()}
              className="flex-1 bg-violet-600 hover:bg-violet-700 rounded-[3px]"
            >
              Add Tag
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTagDialog;
