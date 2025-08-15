import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EngagementHistorySection } from "./sections/EngagementHistorySection";
import { ProfileInformationSection } from "./sections/ProfileInformationSection";
import { CommunicationsSection } from "./sections/CommunicationsSection";
import { FilesSection } from "./sections/FilesSection";
import { GivingHistorySection } from "./sections/GivingHistorySection";
import { Donor, useUpdateDonor } from "@/hooks/useDonors";
import { useToast } from "@/hooks/use-toast";

interface DonorProfileProps {
  donor: Donor;
  onEdit: () => void;
  onClose?: () => void;
}

export const DonorProfile: React.FC<DonorProfileProps> = ({
  donor,
  onEdit,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    organization: "",
    affiliation: "",
    companyUrl: "",
    currency: "",
  });
  
  const { toast } = useToast();
  const updateDonorMutation = useUpdateDonor();

  // Update form data when donor prop changes
  useEffect(() => {
    if (donor) {
      setFormData({
        organization: donor.name || "",
        affiliation: donor.affiliation || "",
        companyUrl: donor.organization_url || "",
        currency: donor.currency || "USD",
      });
    }
  }, [donor]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!donor) return;
    
    try {
      await updateDonorMutation.mutateAsync({
        id: donor.id,
        donorData: {
          name: formData.organization,
          affiliation: formData.affiliation,
          organization_url: formData.companyUrl,
          currency: formData.currency,
          status: donor.status === 'inactive' ? 'potential' : donor.status as 'active' | 'potential'
        }
      });
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Donor profile updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update donor profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white w-full">
      <div className="w-full">
        {/* Header */}
        <div className="px-4 py-4 pr-12 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="font-medium text-xl text-black flex-1 min-w-0 mr-4">
              {isEditing ? "Edit" : ""} Donor Profile -{" "}
              <span className="font-light truncate">{donor.name}</span>
            </h1>
            <div className="flex gap-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="text-gray-600 border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600"
                    disabled={updateDonorMutation.isPending}
                  >
                    {updateDonorMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEdit}
                  variant="brand-purple"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Donor Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4">
          {/* Row 1: Profile Information and Engagement History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="h-full">
              <ProfileInformationSection
                donor={donor}
                isEditing={isEditing}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
            <div className="h-full">
              <EngagementHistorySection donorId={donor.id} />
            </div>
          </div>

          {/* Row 2: Communications & Notes and Files */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4 min-h-[350px]">
              <CommunicationsSection donorId={donor.id} />
            </div>
            <div className="flex flex-col gap-4 min-h-[350px]">
              <FilesSection donorId={donor.id} />
            </div>
          </div>

          {/* Row 3: Giving History (full width) */}
          <GivingHistorySection donorId={donor.id} />
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;
