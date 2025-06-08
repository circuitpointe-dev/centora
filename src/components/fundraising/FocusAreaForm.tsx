import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { FocusArea } from "@/types/donor";
import { useToast } from "@/hooks/use-toast";

interface FocusAreaFormProps {
  focusArea?: FocusArea;
  onSave: (focusArea: Omit<FocusArea, 'id'>) => void;
  onCancel: () => void;
}

export const FocusAreaForm: React.FC<FocusAreaFormProps> = ({
  focusArea,
  onSave,
  onCancel,
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: focusArea?.name || "",
    description: focusArea?.description || "",
    color: focusArea?.color || "bg-blue-100 text-blue-800",
    fundingStartDate: focusArea?.fundingStartDate || "",
    fundingEndDate: focusArea?.fundingEndDate || "",
    amount: focusArea?.amount || 0,
    currency: focusArea?.currency || "USD",
    interestTags: focusArea?.interestTags || [],
  });

  const [newTag, setNewTag] = useState("");

  const colorOptions = [
    { value: "bg-blue-100 text-blue-800", label: "Blue", preview: "bg-blue-100" },
    { value: "bg-green-100 text-green-800", label: "Green", preview: "bg-green-100" },
    { value: "bg-orange-100 text-orange-800", label: "Orange", preview: "bg-orange-100" },
    { value: "bg-red-100 text-red-800", label: "Red", preview: "bg-red-100" },
    { value: "bg-purple-100 text-purple-800", label: "Purple", preview: "bg-purple-100" },
    { value: "bg-pink-100 text-pink-800", label: "Pink", preview: "bg-pink-100" },
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !formData.interestTags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        interestTags: [...prev.interestTags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interestTags: prev.interestTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    
    // Show success toast
    toast({
      title: focusArea ? "Focus Area Updated" : "Focus Area Created",
      description: focusArea 
        ? `${formData.name} has been updated successfully.`
        : `${formData.name} has been created successfully.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Focus Area Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter focus area name"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter description"
            rows={3}
          />
        </div>

        <div>
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                className={`w-8 h-8 rounded-sm border-2 ${
                  formData.color === color.value ? 'border-gray-900' : 'border-gray-300'
                } ${color.preview}`}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fundingStartDate">Funding Start Date</Label>
            <Input
              id="fundingStartDate"
              type="date"
              value={formData.fundingStartDate}
              onChange={(e) => setFormData(prev => ({ ...prev, fundingStartDate: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="fundingEndDate">Funding End Date</Label>
            <Input
              id="fundingEndDate"
              type="date"
              value={formData.fundingEndDate}
              onChange={(e) => setFormData(prev => ({ ...prev, fundingEndDate: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>

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
              {formData.interestTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 rounded-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {focusArea ? 'Update Focus Area' : 'Create Focus Area'}
        </Button>
      </div>
    </form>
  );
};
