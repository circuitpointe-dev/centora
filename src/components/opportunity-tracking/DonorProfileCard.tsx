
import React from "react";
import { User, Mail, Phone, Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DonorProfileCardProps {
  donorName: string;
  createdAt: string;
  deadline: string;
  sector?: string;
  sectionHeight?: string;
  onViewProfile?: () => void;
}

const DonorProfileCard: React.FC<DonorProfileCardProps> = ({
  donorName,
  createdAt,
  deadline,
  sector,
  sectionHeight = "h-72",
  onViewProfile,
}) => {
  const formattedCreatedAt = format(new Date(createdAt), "MMM dd, yyyy");
  const formattedDeadline = format(new Date(deadline), "MMMM dd, yyyy");
  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-3 relative ${sectionHeight} overflow-y-auto`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-violet-100 p-2 rounded-full">
          <User className="h-6 w-6 text-violet-600" />
        </span>
        <h3 className="text-md font-semibold">Donor Profile</h3>
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <h4 className="font-lg">{donorName}</h4>
        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            View Full Donor Profile →
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>
            <span className="font-semibold mr-1">Opened:</span>
            {formattedCreatedAt}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>
            <span className="font-semibold mr-1">Deadline:</span>
            {formattedDeadline}
          </span>
        </div>
      </div>
      <div className="border-b border-gray-200 my-2"></div>
      <div className="flex flex-row items-center text-sm text-gray-600">
        <span className="font-medium min-w-[100px]">Funding Areas:</span>
        <span className="ml-2">
          {sector || "No funding area"}
        </span>
      </div>
    </div>
  );
};

export default DonorProfileCard;
