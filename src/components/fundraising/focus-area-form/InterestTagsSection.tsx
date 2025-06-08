
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface InterestTagsSectionProps {
  interestTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const InterestTagsSection: React.FC<InterestTagsSectionProps> = ({
  interestTags,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !interestTags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag("");
    }
  };

  return (
    <div>
      <Label>Interest Tags</Label>
      <div className="space-y-2 mt-2">
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add interest tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button type="button" onClick={handleAddTag} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {interestTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1 rounded-sm">
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
