
import React, { useState, useEffect } from 'react';
import ManualProposalCreationDialog from '../proposal-management/ManualProposalCreationDialog';
import { useNavigate, useLocation } from 'react-router-dom';

const ManualProposalCreationPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const creationContext = location.state?.creationContext;

  useEffect(() => {
    // Open the dialog when the page loads
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back to proposal management when dialog closes
    navigate('/dashboard/fundraising/proposal-management');
  };

  return (
    <div>
      <ManualProposalCreationDialog 
        open={isOpen} 
        onOpenChange={handleClose}
        proposalTitle={creationContext?.title || "New Proposal"}
        opportunityName="Selected Opportunity"
      />
    </div>
  );
};

export default ManualProposalCreationPage;
