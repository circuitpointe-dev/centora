
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EngagementHistorySection } from "./sections/EngagementHistorySection";
import { GivingHistorySection } from "./sections/GivingHistorySection";
import { ProfileInformationSection } from "./sections/ProfileInformationSection";
import { Donor } from "@/types/donor";

interface DonorProfileProps {
  donor: Donor;
  onEdit: () => void;
}

export const DonorProfile: React.FC<DonorProfileProps> = ({ donor, onEdit }) => {
  return (
    <div className="bg-[#f4f6f9] flex flex-row justify-center w-full">
      <div className="bg-[#f4f6f9] w-[900px] relative">
        <Separator className="w-full" />

        <div className="w-full py-6">
          <div className="flex items-center justify-between px-6 mb-4">
            <h1 className="font-medium text-[22px] text-[#383839]">
              Edit Donor Profile - {donor.name}
            </h1>
            <Button onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Donor Profile
            </Button>
          </div>

          <Separator className="w-full" />
        </div>

        <div className="flex flex-col gap-6 px-6 pb-6">
          <EngagementHistorySection />
          <GivingHistorySection />
          <ProfileInformationSection />
        </div>
        
        <Separator className="w-full" />
      </div>
    </div>
  );
};

export default DonorProfile;
