
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, Search, X } from 'lucide-react';
import AddTagDialog from './AddTagDialog';

interface Tag {
  name: string;
  color: string;
}

interface TagSelectionProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

const availableTags: Tag[] = [
  { name: "Finance", color: "bg-[#f9e6fd] text-[#cb27f5]" },
  { name: "Legal", color: "bg-[#e8fbef] text-[#17a34b]" },
  { name: "Marketing", color: "bg-[#fef3e2] text-[#f59e0b]" },
  { name: "Operations", color: "bg-[#eff6ff] text-[#3b82f6]" },
  { name: "Compliance", color: "bg-[#fef2f2] text-[#ef4444]" },
  { name: "Training", color: "bg-[#f3f4f6] text-[#6b7280]" },
];

const TagSelection = ({ selectedTags, onTagsChange }: TagSelectionProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>(availableTags);

  const filteredTags = allTags.filter(tag =>
    tag.name.toLowerCase().includes(searchValue.toLowerCase()) &&
    !selectedTags.some(selected => selected.name === tag.name)
  );

  const handleSelectTag = (tag: Tag) => {
    onTagsChange([...selectedTags, tag]);
    setOpen(false);
    setSearchValue('');
  };

  const handleRemoveTag = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.name !== tagToRemove.name));
  };

  const handleAddNewTag = (tagName: string, tagColor: string) => {
    const newTag = { name: tagName, color: tagColor };
    setAllTags([...allTags, newTag]);
    onTagsChange([...selectedTags, newTag]);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        <Label className="font-medium text-[#383838e6] text-sm">
          Tag
        </Label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between px-4 py-3 rounded-[3px] border border-[#d9d9d9] bg-white hover:bg-gray-50"
            >
              <span className="text-[#38383880] text-sm">
                {selectedTags.length > 0 ? `${selectedTags.length} tag(s) selected` : "Select tags..."}
              </span>
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search tags..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-2 p-4">
                    <span className="text-sm text-gray-500">No tags found.</span>
                    <Button
                      onClick={() => {
                        setShowAddDialog(true);
                        setOpen(false);
                      }}
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add New Tag
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {filteredTags.map((tag) => (
                    <CommandItem
                      key={tag.name}
                      onSelect={() => handleSelectTag(tag)}
                      className="cursor-pointer"
                    >
                      <Badge
                        className={`${tag.color} h-[20px] px-2 py-1 rounded-[3px] font-medium text-xs border-0`}
                      >
                        {tag.name}
                      </Badge>
                    </CommandItem>
                  ))}
                  {filteredTags.length > 0 && (
                    <CommandItem
                      onSelect={() => {
                        setShowAddDialog(true);
                        setOpen(false);
                      }}
                      className="cursor-pointer border-t"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Tag
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.name}
              className={`${tag.color} h-[25px] px-2.5 py-1 rounded-[3px] font-medium text-xs border-0 flex items-center gap-1`}
            >
              {tag.name}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <AddTagDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddTag={handleAddNewTag}
      />
    </div>
  );
};

export default TagSelection;
