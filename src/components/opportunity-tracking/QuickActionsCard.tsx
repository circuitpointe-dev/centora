
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsCardProps {
  sectionHeight?: string;
  contactEmail?: string;
  contactName?: string;
  opportunityTitle?: string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  sectionHeight = "h-auto",
  contactEmail,
  contactName,
  opportunityTitle
}) => {
  const { toast } = useToast();

  const handleEmailContact = () => {
    if (!contactEmail) {
      toast({
        title: "No Email Available",
        description: "Contact email is not available for this opportunity.",
        variant: "destructive",
      });
      return;
    }

    try {
      const subject = encodeURIComponent(
        opportunityTitle
          ? `Regarding: ${opportunityTitle}`
          : "Opportunity Inquiry"
      );
      const body = encodeURIComponent(
        `Dear ${contactName || 'Contact'},\n\nI hope this message finds you well.\n\nI would like to discuss the opportunity in more detail.\n\nBest regards`
      );

      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

      toast({
        title: "Email Client Opened",
        description: `Opening email to ${contactName || contactEmail}`,
      });
    } catch (error) {
      console.error("Error opening email client:", error);
      toast({
        title: "Error",
        description: "Failed to open email client. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col ${sectionHeight}`}>
      <h3 className="text-md font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={handleEmailContact}
          disabled={!contactEmail}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email Contact
        </Button>
        {contactEmail ? (
          <p className="text-xs text-muted-foreground break-all">
            Contact: <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">No contact email available</p>
        )}
      </div>
    </div>
  );
};

export default QuickActionsCard;
