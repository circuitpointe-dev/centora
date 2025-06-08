
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Opportunity } from "@/types/opportunity";

interface OpportunityPipelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  allOpportunities: Opportunity[];
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}

const OpportunityPipelineDialog: React.FC<OpportunityPipelineDialogProps> = ({
  isOpen,
  onClose,
  allOpportunities,
  month,
  year,
  setMonth,
  setYear,
}) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const totalValue = allOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const totalCount = allOpportunities.length;

  const statusCounts = allOpportunities.reduce((acc, opp) => {
    acc[opp.status] = (acc[opp.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black">
            Opportunity Pipeline Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pipeline Overview</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                {monthNames[month]} {year}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-violet-50 p-4 rounded-lg border">
              <div className="text-2xl font-bold text-violet-600">
                {totalCount}
              </div>
              <div className="text-sm text-gray-600">Total Opportunities</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                ${totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {statusCounts["In Progress"] || 0}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Status Breakdown</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="bg-gray-50 p-3 rounded border text-center">
                  <div className="font-medium text-lg">{count}</div>
                  <div className="text-xs text-gray-600">{status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityPipelineDialog;
