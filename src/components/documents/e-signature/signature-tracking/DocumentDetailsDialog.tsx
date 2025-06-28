
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, FileText, X } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'declined';
  dateSent: string;
  dueDate: string;
  creator: string;
  signatureHistory: {
    status: string;
    person: string;
    date: string;
    completed: boolean;
  }[];
}

interface DocumentDetailsDialogProps {
  document: Document;
  onClose: () => void;
}

export const DocumentDetailsDialog = ({ document, onClose }: DocumentDetailsDialogProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-[#fef9cc] text-[#b9aa03] hover:bg-[#fef9cc] rounded-2xl px-4 py-2 h-[26px]">
            Pending
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 rounded-2xl px-4 py-2 h-[26px]">
            Completed
          </Badge>
        );
      case 'declined':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 rounded-2xl px-4 py-2 h-[26px]">
            Declined
          </Badge>
        );
      default:
        return <Badge className="rounded-2xl px-4 py-2 h-[26px]">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-start gap-6 pt-8 pb-[60px] px-6 relative bg-white">
      <div className="inline-flex items-center justify-between w-full relative">
        <h2 className="font-medium text-[#383838] text-xl">Document Details</h2>
        <Button variant="ghost" size="icon" className="p-0 h-6 w-6" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex flex-col items-end gap-12 relative self-stretch w-full">
        <div className="flex flex-col items-start gap-12 relative self-stretch w-full">
          {/* Document Info Section */}
          <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
            <div className="inline-flex items-center gap-2.5">
              <FileText className="w-[30px] h-[30px] text-gray-500" />
              <div className="flex flex-col items-start gap-1">
                <div className="font-medium text-[#383838] text-base">
                  {document.name}
                </div>
                <div className="text-[#38383899] text-xs">
                  Created by {document.creator}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-5 relative self-stretch w-full">
              <div className="flex items-center justify-between relative self-stretch w-full">
                <div className="text-[#38383866] text-sm">Status</div>
                {getStatusBadge(document.status)}
              </div>

              <div className="flex items-center justify-between relative self-stretch w-full">
                <div className="text-[#38383866] text-sm">Date Sent</div>
                <div className="text-[#38383866] text-sm">
                  {document.dateSent}
                </div>
              </div>

              <div className="flex items-center justify-between relative self-stretch w-full">
                <div className="text-[#38383866] text-sm">Due Date</div>
                <div className="text-[#38383866] text-sm">
                  {document.dueDate}
                </div>
              </div>
            </div>
          </div>

          {/* Signature History Section */}
          <div className="flex flex-col w-full items-start gap-4">
            <h3 className="font-medium text-[#383838] text-base">
              Signature History
            </h3>

            <div className="flex flex-col items-start gap-6 w-full">
              {document.signatureHistory.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5 w-full">
                  {item.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-500 mt-0.5" />
                  )}
                  <div className="flex flex-col items-start gap-1 flex-1">
                    <div className="font-medium text-[#383838e6] text-sm">
                      {item.status}
                    </div>
                    <div className="flex flex-col items-start gap-1 w-full">
                      <div className="text-[#38383899] text-xs">
                        {item.person}
                      </div>
                      <div className="text-[#38383866] text-[11px]">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-start gap-6 w-full">
          <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-[5px]">
            Download Document
          </Button>

          <Button
            variant="outline"
            className="w-full text-[#38383899] border-[#d9d9d9] rounded-[5px]"
          >
            Resend
          </Button>

          <Button
            variant="outline"
            className="w-full text-[#f76b6b] border-[#f76b6b] hover:bg-red-50 rounded-[5px]"
          >
            Cancel Request
          </Button>
        </div>
      </div>
    </div>
  );
};
