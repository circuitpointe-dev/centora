import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, XIcon } from 'lucide-react';
import { useCreateDocument, useDocumentTags, useCreateDocumentTag } from '@/hooks/useDocuments';
import { toast } from 'sonner';

interface DocumentDetailsSectionProps {
  selectedFile?: File;
  onUploadComplete: () => void;
}

const DocumentDetailsSection = ({ selectedFile, onUploadComplete }: DocumentDetailsSectionProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');

  const { data: availableTags } = useDocumentTags();
  const createDocument = useCreateDocument();
  const createTag = useCreateDocumentTag();

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      await createTag.mutateAsync({
        name: newTagName.trim(),
        color: '#3B82F6',
        bg_color: 'bg-blue-100',
        text_color: 'text-blue-800',
      });
      setNewTagName('');
    } catch (error) {
      toast.error('Failed to create tag');
    }
  };

  const handleAddTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  const handleSubmit = async () => {
    if (!selectedFile || !title.trim()) {
      toast.error('Please select a file and provide a title');
      return;
    }

    try {
      // In a real app, you would upload the file to storage first
      // For now, we'll use a mock path
      const mockFilePath = `documents/${Date.now()}-${selectedFile.name}`;
      
      await createDocument.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        file_name: selectedFile.name,
        file_path: mockFilePath,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
        category: category as any || 'uncategorized',
        tag_ids: selectedTags,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setSelectedTags([]);
      onUploadComplete();
      
    } catch (error) {
      toast.error('Failed to create document');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Document Details
        </h3>
        
        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Document Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter document description"
            className="mt-1 min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="policies">Policies</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="contracts">Contracts</SelectItem>
              <SelectItem value="m-e">M&E</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="templates">Templates</SelectItem>
              <SelectItem value="uncategorized">Uncategorized</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Tags</Label>
          
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map(tagId => {
                const tag = availableTags?.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} variant="secondary" className="gap-1">
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tagId)}
                      className="hover:text-red-600"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          {/* Available Tags */}
          {availableTags && availableTags.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Available tags:</p>
              <div className="flex flex-wrap gap-1">
                {availableTags
                  .filter(tag => !selectedTags.includes(tag.id))
                  .map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleAddTag(tag.id)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      {tag.name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Create New Tag */}
          <div className="flex gap-2 mt-2">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Create new tag"
              className="flex-1"
            />
            <Button
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || createTag.isPending}
              size="sm"
              variant="outline"
            >
              <PlusIcon className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selectedFile || !title.trim() || createDocument.isPending}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {createDocument.isPending ? 'Uploading...' : 'Upload Document'}
      </Button>
    </div>
  );
};

export default DocumentDetailsSection;