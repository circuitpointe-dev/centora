import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload, FileText, FilePlus, Bot } from "lucide-react";
import { mockOpportunities } from "@/types/opportunity";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateProposalDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [title, setTitle] = useState("");
  const [opportunityId, setOpportunityId] = useState<string>("");
  const [isTemplate, setIsTemplate] = useState(false);
  const [creationMethod, setCreationMethod] = useState<string>("");
  const navigate = useNavigate();

  // Get sorted opportunity options for select
  const opportunityOptions = mockOpportunities
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  const creationOptions = [
    { value: "ai-wizard", label: "Use AI Wizard", icon: Bot },
    { value: "upload-template", label: "Upload Donor Template", icon: Upload },
    { value: "reuse-library", label: "Reuse Proposal from Library", icon: FileText },
    { value: "create-manually", label: "Create Manually", icon: FilePlus },
  ];

  const handleCreate = () => {
    if (!creationMethod) return;

    // Close the dialog first
    onOpenChange(false);

    // Navigate based on creation method
    switch (creationMethod) {
      case "ai-wizard":
        navigate("/dashboard/fundraising/ai-proposal-wizard");
        break;
      case "upload-template":
        // Navigate to proposal management with browse templates tab active
        navigate("/dashboard/fundraising/proposal-management?tab=browse-templates&mode=create", {
          state: { 
            creationContext: {
              method: "template",
              title,
              opportunityId,
              isTemplate
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
              isTemplate
            }
          }
        });
        break;
      case "create-manually":
        navigate("/dashboard/fundraising/manual-proposal-creation", {
          state: {
            title,
            opportunityId,
            isTemplate
          }
        });
        break;
      default:
        break;
    }
  };

  const selectedOption = creationOptions.find(option => option.value === creationMethod);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-full bg-white text-black rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Create a New Proposal</DialogTitle>
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
                {opportunityOptions.map((op) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.title} {op.donorName ? `- ${op.donorName}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={!creationMethod}
            >
              {selectedOption && <selectedOption.icon className="mr-2 w-5 h-5" />}
              Create Proposal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProposalDialog;
