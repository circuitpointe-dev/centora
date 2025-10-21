import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  ZoomOut,
  ZoomIn,
  Maximize,
  Download,
  FileText,
  Calendar,
  User
} from 'lucide-react';

interface DocumentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendReminder: () => void;
  onUploadRenewed: () => void;
  document?: {
    id: number;
    owner: string;
    department: string;
    type: string;
    country: string;
    number: string;
    expiry: string;
    status: string;
    daysUntilExpiry: number | null;
  };
}

const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  isOpen,
  onClose,
  onSendReminder,
  onUploadRenewed,
  document
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 25);
    }
  };

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 25);
    }
  };

  const handleFullscreen = () => {
    console.log('Toggle fullscreen');
  };

  const handleDownload = () => {
    console.log('Download document');
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSendRenewalReminder = () => {
    onSendReminder();
  };

  const handleUploadRenewedDocument = () => {
    onUploadRenewed();
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="fixed inset-0 backdrop-blur-md bg-white/30" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Document Details</h2>
            <p className="text-sm text-gray-600 mt-1">{document.owner} • {document.type}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600"
            onClick={handleCancel}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'preview'
                  ? 'text-gray-900 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'details'
                  ? 'text-gray-900 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'text-gray-900 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              History
            </button>
          </div>

            <div className="space-y-6 mt-6">
              {activeTab === 'preview' && (
                <>
                  {/* Document File Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Document File</span>
                        {document.status === 'expiring' && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Expiring in {document.daysUntilExpiry}d
                          </Badge>
                        )}
                        {document.status === 'expired' && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Expired
                          </Badge>
                        )}
                        {document.status === 'valid' && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Valid
                          </Badge>
                        )}
                      </div>
                      
                      {/* Document Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleZoomOut}
                          className="p-2"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                          {zoomLevel}%
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleZoomIn}
                          className="p-2"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleFullscreen}
                          className="p-2"
                        >
                          <Maximize className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDownload}
                          className="p-2"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Document Preview Area */}
                    <div className="border border-gray-200 rounded-lg bg-gray-50 min-h-[400px] flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">{document.type}</p>
                          <p className="text-sm text-gray-600">Document preview will be displayed here</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">File Type</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1">PDF</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                        <p className="text-sm font-semibold text-red-600 mt-1">{document.expiry}</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Document Number</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{document.number}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Owner</label>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{document.owner}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex justify-end">
                    {document.status === 'expiring' && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1">
                        Expiring in {document.daysUntilExpiry}d
                      </Badge>
                    )}
                    {document.status === 'expired' && (
                      <Badge className="bg-red-100 text-red-800 text-sm px-3 py-1">
                        Expired
                      </Badge>
                    )}
                    {document.status === 'valid' && (
                      <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                        Valid
                      </Badge>
                    )}
                  </div>

                  {/* Document Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Labels */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <p className="text-sm text-gray-900 mt-1">-</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Document type</label>
                        <p className="text-sm text-gray-900 mt-1">{document.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Country</label>
                        <p className="text-sm text-gray-900 mt-1">{document.country}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Document number</label>
                        <p className="text-sm text-gray-900 mt-1">{document.number}</p>
                      </div>
                    </div>

                    {/* Right Column - Values */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Owner</label>
                        <p className="text-sm text-gray-900 mt-1">{document.owner}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Department</label>
                        <p className="text-sm text-gray-900 mt-1">{document.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Issue date</label>
                        <p className="text-sm text-gray-900 mt-1">Jul 30, 2025</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Expiry date</label>
                        <p className="text-sm font-semibold text-red-600 mt-1">{document.expiry}</p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Message */}
                  {(document.status === 'expiring' || document.status === 'expired') && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-sm font-bold">!</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-semibold text-red-800">
                            Expiring Soon
                          </h3>
                          <p className="text-sm text-red-700 mt-1">
                            Action required to renew this document before expiry.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-8">
                  {/* Document Timeline Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Document timeline</h3>
                    
                    {/* Timeline */}
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {/* Timeline Entries */}
                      <div className="space-y-6">
                        {/* Document Uploaded */}
                        <div className="relative flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center relative z-10">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">Document Uploaded</p>
                              <p className="text-sm text-gray-500">2024-05-14</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Initial document upload by HR team</p>
                          </div>
                        </div>

                        {/* First Reminder Sent */}
                        <div className="relative flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center relative z-10">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">First Reminder Sent</p>
                              <p className="text-sm text-gray-500">2025-03-15</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">90-day expiry notification sent to Jane Doe</p>
                          </div>
                        </div>

                        {/* Follow-up Reminder */}
                        <div className="relative flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center relative z-10">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">Follow-up Reminder</p>
                              <p className="text-sm text-gray-500">2025-04-15</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">30-day expiry warning sent</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Access Log Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Access log</h3>
                    
                    {/* Access Log Entries */}
                    <div className="space-y-3">
                      {/* Viewed by HR Admin */}
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Viewed by HR Admin</p>
                          <p className="text-sm text-gray-600">Compliance review</p>
                        </div>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>

                      {/* Downloaded by Jane Doe */}
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Downloaded by Jane Doe</p>
                          <p className="text-sm text-gray-600">Employee self-service</p>
                        </div>
                        <p className="text-sm text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSendRenewalReminder}
              className="bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
            >
              Send renewal reminder
            </Button>
            <Button
              variant="outline"
              onClick={handleUploadRenewedDocument}
            >
              Upload renewed document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsModal;
