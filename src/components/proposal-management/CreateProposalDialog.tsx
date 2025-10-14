import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload, FileText, FilePlus, Bot, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProposalWizard from "@/components/fundraising/ai/ProposalWizard";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useFileUpload } from "@/hooks/useFileUpload";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateProposalDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [title, setTitle] = useState("");
  const [opportunityId, setOpportunityId] = useState<string>("");
  const [isTemplate, setIsTemplate] = useState(false);
  const [creationMethod, setCreationMethod] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const navigate = useNavigate();
  const [showWizard, setShowWizard] = useState(false);
  
  // Fetch real opportunities from backend
  const { data: opportunities = [] } = useOpportunities();
  
  // File upload hook for proposal images
  const { uploadFile, isUploading } = useFileUpload({
    bucket: 'proposal-attachments',
    folder: 'cover-images',
    allowedTypes: ['image/*'],
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  // Get sorted opportunity options for select
  const opportunityOptions = opportunities
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  const creationOptions = [
    { value: "ai-wizard", label: "Use AI Wizard", icon: Bot },
    { value: "upload-template", label: "Upload Donor Template", icon: Upload },
    { value: "reuse-library", label: "Reuse Proposal from Library", icon: FileText },
    { value: "create-manually", label: "Create Manually", icon: FilePlus },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImagePreview("");
  };

  const handleCreate = async () => {
    if (!creationMethod || isCreating) return;

    setIsCreating(true);

    // Upload image if provided
    let uploadedImagePath = "";
    if (coverImage) {
      try {
        const uploadResult = await uploadFile(coverImage);
        uploadedImagePath = uploadResult.path;
      } catch (error) {
        console.error("Failed to upload cover image:", error);
      }
    }

    // Close the dialog
    onOpenChange(false);

    // Navigate based on creation method
    switch (creationMethod) {
      case "ai-wizard":
        setShowWizard(true);
        break;
      case "upload-template":
        // Navigate to proposal management with browse templates tab active
        navigate("/dashboard/fundraising/proposal-management?tab=browse-templates&mode=create", {
          state: {
            creationContext: {
              method: "template",
              title,
              opportunityId,
              isTemplate,
              coverImage: uploadedImagePath
            }
          }
        });
        break;
      case "reuse-library":
        // Navigate to proposal management with past proposal library tab active
        navigate("/dashboard/fundraising/proposal-management?tab=past-proposals&mode=create", {
          state: {
            creationContext: {
              method: "reuse",
              title,
              opportunityId,
              isTemplate,
              coverImage: uploadedImagePath
            }
          }
        });
        break;
      case "create-manually":
        navigate("/dashboard/fundraising/manual-proposal-creation", {
          state: {
            creationContext: {
              method: "manual",
              title,
              opportunityId,
              isTemplate,
              coverImage: uploadedImagePath
            }
          }
        });
        break;
      default:
        break;
    }

    // Reset creating state after a delay
    setTimeout(() => setIsCreating(false), 1000);
  };

  const selectedOption = creationOptions.find(option => option.value === creationMethod);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-full bg-white text-black rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Create a New Proposal</DialogTitle>
          <DialogDescription className="text-center">Set title, pick an opportunity, then choose how to create.</DialogDescription>
        </DialogHeader>
        <form
          className="mt-6 flex flex-col gap-8 w-full"
          onSubmit={e => {
            e.preventDefault();
            handleCreate();
          }}
        >
          {/* Proposal Title */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="proposal-title">
              Proposal Title
            </Label>
            <Input
              id="proposal-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter proposal title"
              required
            />
          </div>

          {/* Opportunity Select */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="opportunity-select">
              Select Opportunity
            </Label>
            <Select
              value={opportunityId}
              onValueChange={setOpportunityId}
            >
              <SelectTrigger id="opportunity-select" className="bg-[#f6f6fa]">
                <SelectValue placeholder="Choose opportunity" />
              </SelectTrigger>
              <SelectContent>
                {opportunityOptions.length === 0 ? (
                  <SelectItem value="no-opportunities" disabled>
                    No opportunities available
                  </SelectItem>
                ) : (
                  opportunityOptions.map((op) => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.title} {op.donor?.name ? `- ${op.donor.name}` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Cover Image Upload */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cover-image">
              Cover Image (Optional)
            </Label>
            {coverImagePreview ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="cover-image"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors"
              >
                <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload cover image</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                <input
                  id="cover-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Creation Method Select */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="creation-method">
              Creation Method
            </Label>
            <Select
              value={creationMethod}
              onValueChange={setCreationMethod}
            >
              <SelectTrigger id="creation-method" className="bg-[#f6f6fa]">
                <SelectValue placeholder="Choose how to create proposal" />
              </SelectTrigger>
              <SelectContent>
                {creationOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Make Available as Template */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="template-checkbox"
              checked={isTemplate}
              onCheckedChange={checked => setIsTemplate(!!checked)}
            />
            <Label htmlFor="template-checkbox">
              Make available as template
            </Label>
          </div>

          {/* Create Button */}
          <div className="flex flex-row gap-4 mt-2">
            <Button
              type="submit"
              variant="default"
              className="flex-1 flex items-center justify-center"
              disabled={!creationMethod || isCreating || isUploading}
            >
              {selectedOption && <selectedOption.icon className="mr-2 w-5 h-5" />}
              {isCreating ? "Creating..." : "Create Proposal"}
            </Button>
          </div>
        </form>
      </DialogContent>
      {showWizard && (
        <ProposalWizard
          open={showWizard}
          onOpenChange={setShowWizard}
          defaultOpportunity={{
            id: opportunityId,
            title: (opportunities.find((o) => o.id === opportunityId)?.title) || "",
          }}
          defaultTitle={title}
        />
      )}
    </Dialog>
  );
};

export default CreateProposalDialog;
