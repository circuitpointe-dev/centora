import React, { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { donorsData } from "@/data/donorData";
import { Donor } from "@/types/donor";
import DonorProfile from "./DonorProfile";
import DonorTableRow from "./DonorTableRow";
import DonorTablePagination from "./DonorTablePagination";
import NewDonorDialog from "./NewDonorDialog";
import { EmptyDonorList } from "./EmptyDonorList";

const DonorList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [donors, setDonors] = useState<Donor[]>([]); // Clear static data - will be replaced with backend data
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(donors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDonors = donors.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    setDonors(prev => prev.filter(donor => donor.id !== id));
  };

  const handleRowClick = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowProfile(true);
  };

  const handleEditDonor = () => {
    setShowProfile(false);
    // Edit logic will be implemented
  };

  return (
    <>
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-medium text-gray-900">Donor List</h2>
          <NewDonorDialog />
        </div>

        {donors.length === 0 ? (
          <EmptyDonorList onAddDonor={() => {/* Add donor logic */}} />
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

      {/* Donor Profile Centralized Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto p-0">
          {selectedDonor && (
            <DonorProfile 
              donor={selectedDonor} 
              onEdit={handleEditDonor}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonorList;
