
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReportViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportViewDialog = ({ open, onOpenChange }: ReportViewDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black text-lg font-semibold">
            Final Report - Grant Manager Submission
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Submitted on December 5, 2025
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-6 text-black">
          <div>
            <h3 className="font-semibold mb-2">Executive Summary</h3>
            <p className="text-sm text-gray-700">
              This report summarizes the activities and outcomes achieved during the grant period. 
              The project has successfully met 85% of its intended objectives and has positively 
              impacted the target community through various initiatives.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Project Activities</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Community outreach programs conducted in 12 locations</li>
              <li>• Training sessions delivered to 150+ participants</li>
              <li>• Resource materials developed and distributed</li>
              <li>• Partnership agreements established with local organizations</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Financial Summary</h3>
            <div className="text-sm text-gray-700">
              <p>Total Budget: $30,000</p>
              <p>Amount Spent: $28,500</p>
              <p>Remaining Balance: $1,500</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Outcomes and Impact</h3>
            <p className="text-sm text-gray-700">
              The project has achieved significant impact in the target areas, with measurable 
              improvements in community engagement and capacity building. Beneficiaries reported 
              high satisfaction rates and expressed interest in continued programming.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Challenges and Lessons Learned</h3>
            <p className="text-sm text-gray-700">
              While the project faced some initial logistical challenges, the team successfully 
              adapted strategies to ensure project completion. Key lessons include the importance 
              of early stakeholder engagement and flexible implementation approaches.
            </p>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => onOpenChange(false)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Close Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
