import React from 'react';
import { X, Download, Share2, Printer } from 'lucide-react';
import image from '@/assets/images/cert.png';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  studentName?: string;
  completionDate?: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ 
  isOpen, 
  onClose, 
  courseTitle = "Responsive Design Principles",
  studentName = "Olivia Ford",
  completionDate = "January 1, 2027"
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    console.log('Downloading certificate...');
    // In a real implementation, this would trigger a PDF download
  };

  const handleShareLinkedIn = () => {
    console.log('Sharing on LinkedIn...');
    // In a real implementation, this would open LinkedIn sharing
  };

  const handlePrint = () => {
    console.log('Printing certificate...');
    // In a real implementation, this would trigger print dialog
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl w-[650px] max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">Certificate of completion</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Certificate Content */}
        <div className="p-6">
          {/* Certificate Container */}
          <div className="relative max-w-full mx-auto">
            {/* Certificate Image */}
            <img 
              src={image}
              alt="Certificate of Achievement"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-card-foreground rounded-lg font-medium transition-colors text-sm"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            
            <button
              onClick={handleShareLinkedIn}
              className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-card-foreground rounded-lg font-medium transition-colors text-sm"
            >
              <Share2 size={16} />
              <span>Share on LinkedIn</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-muted/80 text-card-foreground rounded-lg font-medium transition-colors text-sm"
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-card-foreground rounded-lg font-medium transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
