import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type Donor, useDonors, useDeleteDonor } from "@/hooks/useDonors";
import { useToast } from "@/hooks/use-toast";
import DonorProfile from "./DonorProfile";
import DonorTableRow from "./DonorTableRow";
import DonorTablePagination from "./DonorTablePagination";
import NewDonorDialog from "./NewDonorDialog";
import { EmptyDonorList } from "./EmptyDonorList";

interface DonorListProps {
  initialDonorId?: string;
}

const DonorList: React.FC<DonorListProps> = ({ initialDonorId }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: donors = [], isLoading } = useDonors();
  const deleteDonorMutation = useDeleteDonor();
  const { toast } = useToast();
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewDonorDialog, setShowNewDonorDialog] = useState(false);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(donors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDonors = donors.slice(startIndex, endIndex);

  const handleDelete = async (id: string) => {
    try {
      await deleteDonorMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Donor deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete donor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowProfile(true);
  };

  const handleEditDonor = () => {
    setShowProfile(false);
    // Edit logic will be implemented
  };

  // Handle initial donor ID from URL parameter
  useEffect(() => {
    if (initialDonorId && donors.length > 0) {
      const donor = donors.find(d => d.id === initialDonorId);
      if (donor) {
        setSelectedDonor(donor);
        setShowProfile(true);
        // Clear the query parameter after opening the profile
        navigate('/dashboard/fundraising/donor-management', { replace: true });
      }
    }
  }, [initialDonorId, donors, navigate]);

  return (
    <>
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-medium text-gray-900">Donor List</h2>
          <NewDonorDialog />
        </div>

        {donors.length === 0 ? (
          <EmptyDonorList onAddDonor={() => setShowNewDonorDialog(true)} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Last Donation</TableHead>
                    <TableHead>Interest Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDonors.map((donor) => (
                    <DonorTableRow
                      key={donor.id}
                      donor={donor}
                      onRowClick={handleRowClick}
                      onDelete={handleDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            <DonorTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalDonors={donors.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>

      {/* New Donor Dialog controlled by empty state */}
      <NewDonorDialog 
        open={showNewDonorDialog}
        onOpenChange={setShowNewDonorDialog}
        triggerButton={<div style={{ display: 'none' }} />}
      />

      {/* Donor Profile Centralized Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0">
          {selectedDonor && (
            <DonorProfile 
              donor={selectedDonor}
              onEdit={() => {
                // Handle edit action - could open edit dialog or inline editing
                console.log('Edit donor:', selectedDonor.id);
              }}
              onClose={() => setShowProfile(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonorList;
