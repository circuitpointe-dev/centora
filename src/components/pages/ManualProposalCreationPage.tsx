
import React, { useState, useEffect } from 'react';
import ManualProposalCreationDialog from '../proposal-management/ManualProposalCreationDialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOpportunities } from '@/hooks/useOpportunities';

const ManualProposalCreationPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const prefilledData = location.state?.prefilledData;
  const creationContext = prefilledData?.creationContext;
  const { data: opportunities = [] } = useOpportunities();

  useEffect(() => {
    // Open the dialog when the page loads
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back to proposal management when dialog closes
    navigate('/dashboard/fundraising/proposal-management');
  };

  // Get the proposal title - either from editing proposal or creation context
  const proposalTitle = prefilledData?.proposal?.title || 
                        prefilledData?.proposal?.name || 
                        creationContext?.title || 
                        "New Proposal";

  // Get opportunity name - look up from opportunities if we have an opportunity_id
  let opportunityName = "Selected Opportunity";
  if (prefilledData?.proposal?.opportunity_id) {
    const opportunity = opportunities.find(opp => opp.id === prefilledData.proposal.opportunity_id);
    if (opportunity) {
      opportunityName = opportunity.title;
    }
  } else if (creationContext?.opportunityName) {
    opportunityName = creationContext.opportunityName;
  }

  return (
    <div>
      <ManualProposalCreationDialog 
        open={isOpen} 
        onOpenChange={handleClose}
        proposalTitle={proposalTitle}
        opportunityName={opportunityName}
      />
    </div>
  );
};

export default ManualProposalCreationPage;
