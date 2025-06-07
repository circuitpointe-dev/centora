
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Target } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { donorsData } from "@/data/donorData";
import { Donor } from "@/types/donor";

const DonorList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(donorsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDonors = donorsData.slice(startIndex, endIndex);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Potential':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Donor List</h2>
        
        <div className="flex gap-3">
          <SideDialog>
            <SideDialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Create Focus Areas
              </Button>
            </SideDialogTrigger>
            <SideDialogContent>
              <SideDialogHeader>
                <SideDialogTitle>Create Focus Area</SideDialogTitle>
              </SideDialogHeader>
              <div className="p-6">
                <p className="text-gray-600">Focus area creation form will be implemented here.</p>
              </div>
            </SideDialogContent>
          </SideDialog>
          
          <SideDialog>
            <SideDialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Donor
              </Button>
            </SideDialogTrigger>
            <SideDialogContent>
              <SideDialogHeader>
                <SideDialogTitle>Add New Donor</SideDialogTitle>
              </SideDialogHeader>
              <div className="p-6">
                <p className="text-gray-600">New donor form will be implemented here.</p>
              </div>
            </SideDialogContent>
          </SideDialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Last Donation</TableHead>
              <TableHead>Interest Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDonors.map((donor) => (
              <TableRow key={donor.id}>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold text-gray-900">{donor.name}</p>
                    <p className="text-sm text-gray-500">
                      Total: {formatCurrency(donor.totalDonations)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">{donor.contactInfo.email}</p>
                    <p className="text-sm text-gray-500">{donor.contactInfo.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDate(donor.lastDonation)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {donor.interestTags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {donor.interestTags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{donor.interestTags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(donor.status)}>
                    {donor.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <SideDialog>
                      <SideDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </SideDialogTrigger>
                      <SideDialogContent>
                        <SideDialogHeader>
                          <SideDialogTitle>Edit Donor</SideDialogTitle>
                        </SideDialogHeader>
                        <div className="p-6">
                          <p className="text-gray-600">Edit donor form for {donor.name} will be implemented here.</p>
                        </div>
                      </SideDialogContent>
                    </SideDialog>
                    
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, donorsData.length)} of {donorsData.length} donors
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DonorList;
