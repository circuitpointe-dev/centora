
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import OpportunitySummaryCards from "./OpportunitySummaryCards";
import StageDonutChart from "./StageDonutChart";
import OpportunityCalendarCard from "./OpportunityCalendarCard";
import StaffOverloadCard from "./StaffOverloadCard";
import OpportunitiesByStaffCard from "./OpportunitiesByStaffCard";
import OpportunitiesByStaffDialog from "./OpportunitiesByStaffDialog";
import UpcomingFundingCyclesCard from "./UpcomingFundingCyclesCard";

interface OpportunityPipelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  allOpportunities: any[];
  month: number;
  year: number;
  setMonth: (m: number) => void;
  setYear: (y: number) => void;
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
  const [showStaffDialog, setShowStaffDialog] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent
        className="max-w-[98vw] sm:max-w-[1200px] max-h-[94vh] min-h-[320px] overflow-y-auto bg-[rgba(245,247,250,1)] p-0 rounded-lg shadow-xl"
      >
        <div className="p-8 pt-5">
          <h2 className="text-2xl font-bold mb-6">Opportunity Pipeline</h2>
          <OpportunitySummaryCards opportunities={allOpportunities} month={month} year={year} />
          {/* Row 2: Stage & Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <StageDonutChart opportunities={allOpportunities} />
            <OpportunityCalendarCard
              month={month}
              year={year}
              setMonth={setMonth}
              setYear={setYear}
            />
          </div>
          {/* Row 3: Staff Overload / Opportunities by Staff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <StaffOverloadCard />
            <OpportunitiesByStaffCard 
              onViewAll={() => setShowStaffDialog(true)} 
              month={month}
            />
          </div>
          {/* Row 4: Upcoming Funding Cycles */}
          <div className="mt-8">
            <UpcomingFundingCyclesCard />
          </div>
        </div>
        <OpportunitiesByStaffDialog
          isOpen={showStaffDialog}
          onClose={() => setShowStaffDialog(false)}
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityPipelineDialog;
