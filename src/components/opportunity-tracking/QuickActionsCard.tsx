
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar } from "lucide-react";

interface QuickActionsCardProps {
  sectionHeight?: string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  sectionHeight = "h-auto"
}) => {
  const handleEmailContact = () => {
    console.log("Opening email client...");
  };

  const handlePhoneContact = () => {
    console.log("Initiating phone call...");
  };

  const handleScheduleMeeting = () => {
    console.log("Opening calendar...");
  };

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight}`}>
      <h3 className="text-md font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleEmailContact}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email Contact
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handlePhoneContact}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Contact
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleScheduleMeeting}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsCard;
