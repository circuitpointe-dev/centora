import React, { useState } from "react";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGrantReports } from "@/hooks/grants/useGrantReports";
import { GrantReport } from "@/types/grants";

interface ReportsTableProps {
  grantId: string;
  isEditMode?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted': return 'bg-green-100 text-green-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'upcoming': return 'bg-blue-100 text-blue-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const ReportsTable = ({ grantId, isEditMode = false }: ReportsTableProps) => {
  const { reports: grantReports } = useGrantReports(grantId);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(grantReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = grantReports.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (report: GrantReport) => {
    console.log('Viewing report:', report);
    // TODO: Implement view logic - could open a modal or navigate to report view
    alert(`Viewing ${report.report_type} - Due: ${report.due_date}`);
  };

  const handleDownload = (report: GrantReport) => {
    console.log('Downloading report:', report);
    if (report.submitted && report.file_name) {
      // TODO: Implement actual download logic
      alert(`Downloading ${report.file_name}`);
    } else {
      alert('Report not available for download');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-black">Report Type</TableHead>
              <TableHead className="font-semibold text-black">Due Date</TableHead>
              <TableHead className="font-semibold text-black">Submitted</TableHead>
              <TableHead className="font-semibold text-black">Status</TableHead>
              <TableHead className="font-semibold text-black text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReports.map((report) => (
              <TableRow key={report.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-black">
                  {report.report_type}
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(report.due_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-sm ${
                    report.submitted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {report.submitted ? 'Yes' : 'No'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(report.status)}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(report)}
                      className="h-8 w-8 p-0 hover:bg-purple-50"
                    >
                      <Eye className="h-4 w-4 text-purple-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(report)}
                      className="h-8 w-8 p-0 hover:bg-purple-50"
                      disabled={!report.submitted}
                    >
                      <Download className={`h-4 w-4 ${
                        report.submitted ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {grantReports.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No reports found for this grant.</p>
        </div>
      )}
    </div>
  );
};