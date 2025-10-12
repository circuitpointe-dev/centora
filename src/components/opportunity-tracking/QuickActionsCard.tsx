
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface QuickActionsCardProps {
  sectionHeight?: string;
  contactEmail?: string;
  contactName?: string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  sectionHeight = "h-auto",
  contactEmail,
  contactName
}) => {
  const handleEmailContact = () => {
    if (contactEmail) {
      const subject = encodeURIComponent(`Regarding Opportunity`);
      const body = encodeURIComponent(`Dear ${contactName || 'Contact'},\n\n`);
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight}`}>
      <h3 className="text-md font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleEmailContact}
          disabled={!contactEmail}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email Contact
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsCard;
