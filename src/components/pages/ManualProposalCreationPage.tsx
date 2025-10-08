
import React, { useState, useEffect } from 'react';
import ManualProposalCreationDialog from '../proposal-management/ManualProposalCreationDialog';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useProposalById } from '@/hooks/useProposals';

const ManualProposalCreationPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const prefilledData = location.state?.prefilledData;
  const proposalIdFromQuery = searchParams.get('proposalId') || undefined;
  const { data: fetchedProposal } = useProposalById(proposalIdFromQuery);
  const creationContext = prefilledData?.creationContext;
  const { data: opportunities = [] } = useOpportunities();

  useEffect(() => {
    // If editing by id, wait until the proposal is fetched before opening
    if (proposalIdFromQuery) {
      if (fetchedProposal) setIsOpen(true);
    } else {
      setIsOpen(true);
    }
  }, [proposalIdFromQuery, fetchedProposal]);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back to proposal management when dialog closes
    navigate('/dashboard/fundraising/proposal-management');
  };

  // Get the proposal title - from fetched proposal id, editing data, or creation context
  const proposalTitle = fetchedProposal?.title ||
    fetchedProposal?.name ||
    prefilledData?.proposal?.title ||
    prefilledData?.proposal?.name ||
    creationContext?.title ||
    "New Proposal";

  // Get opportunity name - look up from opportunities if we have an opportunity_id
  let opportunityName = "Selected Opportunity";
  if ((prefilledData?.proposal?.opportunity_id) || fetchedProposal?.opportunity_id) {
    const oppId = fetchedProposal?.opportunity_id || prefilledData?.proposal?.opportunity_id;
    const opportunity = opportunities.find(opp => opp.id === oppId);
    if (opportunity) {
      opportunityName = opportunity.title;
    }
  } else if (creationContext?.opportunityName) {
    opportunityName = creationContext.opportunityName;
  }

  // Loading state while fetching the proposal by id for professional UX
  if (proposalIdFromQuery && !fetchedProposal) {
    return (
      <div className="p-8">
        <div className="h-10 w-48 bg-gray-100 animate-pulse rounded mb-4" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ManualProposalCreationDialog
        open={isOpen}
        onOpenChange={handleClose}
        proposalTitle={proposalTitle}
        opportunityName={opportunityName}
        prefilledDataProp={proposalIdFromQuery && fetchedProposal ? {
          source: 'proposal',
          proposal: fetchedProposal,
          creationContext: { type: 'editing', title: fetchedProposal.title || fetchedProposal.name, opportunityId: fetchedProposal.opportunity_id }
        } : prefilledData}
      />
    </div>
  );
};

export default ManualProposalCreationPage;
