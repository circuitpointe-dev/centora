
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EngagementHistorySection } from "./sections/EngagementHistorySection";
import { ProfileInformationSection } from "./sections/ProfileInformationSection";
import { CommunicationsSection } from "./sections/CommunicationsSection";
import { FilesSection } from "./sections/FilesSection";
import { GivingHistorySection } from "./sections/GivingHistorySection";
import { Donor } from "@/types/donor";

interface DonorProfileProps {
  donor: Donor;
  onEdit: () => void;
}

export const DonorProfile: React.FC<DonorProfileProps> = ({ donor, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    organization: donor.name,
    contactPerson: donor.name,
    email: donor.contactInfo.email,
    secondaryEmail: "contact@fehd.org",
    affiliation: "Lorem ipsum non aliquet fusce",
    companyUrl: "https://FEHDfoundation.com",
    fundingStartDate: "2024-01-01",
    fundingEndDate: "2024-12-31",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-[#f4f6f9] flex flex-row justify-center w-full">
      <div className="bg-[#f4f6f9] w-[900px] relative">
        <Separator className="w-full" />

        <div className="w-full py-6">
          <div className="flex items-center justify-between px-6 mb-4">
            <h1 className="font-medium text-[22px] text-[#383839] flex-1 min-w-0 mr-4">
              {isEditing ? 'Edit' : ''} Donor Profile - <span className="font-light truncate">{donor.name}</span>
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
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Donor Profile
                </Button>
              )}
            </div>
          </div>

          <Separator className="w-full" />
        </div>

        <div className="flex flex-col gap-6">
          {/* Row 1: Profile Information and Engagement History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 items-start">
            <div className="h-full">
              <ProfileInformationSection
                isEditing={isEditing}
                formData={formData}
                onInputChange={handleInputChange}
                interestTags={donor.interestTags}
              />
            </div>
            <div className="h-full">
              <EngagementHistorySection />
            </div>
          </div>

          {/* Row 2: Communications & Notes and Files */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 items-start">
            <div className="h-full">
              <CommunicationsSection />
            </div>
            <div className="h-full">
              <FilesSection />
            </div>
          </div>

          {/* Row 3: Giving History (full width) */}
          <GivingHistorySection />
        </div>
        
        <Separator className="w-full" />
      </div>
    </div>
  );
};

export default DonorProfile;
