
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, AlertCircle } from "lucide-react";
import { FocusArea, useFocusAreas } from "@/hooks/useFocusAreas";
import { useToast } from "@/hooks/use-toast";
import { colorOptions } from "@/utils/focusAreaColors";

interface FocusAreaFormProps {
  focusArea?: FocusArea;
  onSave?: (focusArea: Omit<FocusArea, 'id'>) => void;
  onCancel: () => void;
}

export const FocusAreaForm: React.FC<FocusAreaFormProps> = ({
  focusArea,
  onSave,
  onCancel,
}) => {
  const { focusAreas, createFocusArea, updateFocusArea } = useFocusAreas();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = "Focus area name is required";
    } else if (focusAreas.some(area => area.name.toLowerCase() === formData.name.toLowerCase() && area.id !== focusArea?.id)) {
      newErrors.name = "A Focus Area with this name already exists";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.fundingStartDate) {
      newErrors.fundingStartDate = "Funding start date is required";
    } else if (new Date(formData.fundingStartDate) < new Date(new Date().toDateString())) {
      newErrors.fundingStartDate = "Start date must be today or in the future";
    }
    
    if (!formData.fundingEndDate) {
      newErrors.fundingEndDate = "Funding end date is required";
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling to parent form
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (focusArea) {
        await updateFocusArea(focusArea.id, formData);
        toast({
          title: "Success",
          description: "Focus Area updated successfully",
        });
      } else {
        await createFocusArea(formData);
        toast({
          title: "Success",
          description: "Focus Area created successfully",
        });
        // Clear form after successful creation
        setFormData({
          name: "",
          description: "",
          color: "bg-blue-100 text-blue-800",
          fundingStartDate: "",
          fundingEndDate: "",
          amount: 0,
          currency: "USD",
          interestTags: [],
        });
        setErrors({});
      }
      
      // Call the optional callback for backward compatibility
      onSave?.(formData);
      onCancel();
    } catch (error) {
      console.error('Error saving focus area:', error);
      toast({
        title: "Error",
        description: "Failed to save focus area. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Focus Area Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter focus area name"
            className={errors.name ? "border-red-500" : ""}
            required
          />
          {errors.name && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter description"
            rows={3}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.description}</span>
            </div>
          )}
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
              onChange={(e) => handleInputChange('fundingStartDate', e.target.value)}
              className={errors.fundingStartDate ? "border-red-500" : ""}
              required
            />
            {errors.fundingStartDate && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.fundingStartDate}</span>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="fundingEndDate">Funding End Date</Label>
            <Input
              id="fundingEndDate"
              type="date"
              value={formData.fundingEndDate}
              onChange={(e) => handleInputChange('fundingEndDate', e.target.value)}
              className={errors.fundingEndDate ? "border-red-500" : ""}
              required
            />
            {errors.fundingEndDate && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.fundingEndDate}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', Number(e.target.value))}
              placeholder="0"
              min="0"
              className={errors.amount ? "border-red-500" : ""}
              required
            />
            {errors.amount && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.amount}</span>
              </div>
            )}
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
        <Button type="submit" disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}>
          {isSubmitting ? 'Saving...' : (focusArea ? 'Update Focus Area' : 'Create Focus Area')}
        </Button>
      </div>
    </form>
  );
};
