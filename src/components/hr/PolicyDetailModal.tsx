import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';

interface PolicyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
  onSendReminders: () => void;
  policy?: {
    id: number;
    title: string;
    category: string;
    updated: string;
    version: string;
    ackRate: number;
    hasLowAck: boolean;
  };
}

const PolicyDetailModal: React.FC<PolicyDetailModalProps> = ({
  isOpen,
  onClose,
  onAcknowledge,
  onSendReminders,
  policy
}) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (!isOpen || !policy) return null;

  const formatDate = (dateString: string) => {
    // Convert "Jul 2, 2025" to "2025-03-22" format for display
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/src/assets/documents/dashboard-report-2025-09-30.pdf';
    link.download = `${policy?.title || 'policy'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle PDF print
  const handlePrintPDF = () => {
    window.open('/src/assets/documents/dashboard-report-2025-09-30.pdf', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="fixed inset-0 backdrop-blur-md bg-white/30" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{policy.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {policy.category} • {policy.version} • Updated {formatDate(policy.updated)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-gray-200">
              <TabsList className="h-auto p-0 bg-transparent flex space-x-8 justify-start">
                <TabsTrigger 
                  value="summary" 
                  className="relative px-0 py-3 text-sm font-medium text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:rounded-none"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="document" 
                  className="relative px-0 py-3 text-sm font-medium text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:rounded-none"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger 
                  value="assignments" 
                  className="relative px-0 py-3 text-sm font-medium text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:rounded-none"
                >
                  Assignments
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="summary" className="space-y-6">
              <div>
                <p className="text-gray-700 mb-6">
                  Defines expected behaviors and ethical standards for all employees and contractors.
                </p>
                
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Key changes in {policy.version}</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Updated social media guidelines</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Added remote work conduct section</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="document" className="space-y-6">
              <div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Policy Document</h4>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={handleDownloadPDF}
                        >
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={handlePrintPDF}
                        >
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="h-96">
                    <iframe
                      src="/src/assets/documents/dashboard-report-2025-09-30.pdf"
                      className="w-full h-full border-0"
                      title="Policy Document"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acknowledgement Status</h3>
                
                <div className="space-y-4">
                  {/* Total Assigned Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Total Assigned</h4>
                        <p className="text-sm text-gray-600 mt-1">124 people</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Acknowledged Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Acknowledged</h4>
                        <p className="text-sm text-gray-600 mt-1">119 people</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">96%</span>
                      </div>
                    </div>
                  </div>

                  {/* Pending Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Pending</h4>
                        <p className="text-sm text-gray-600 mt-1">5 people</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-white bg-red-600 px-2 py-1 rounded">4%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex space-x-3">
            <Button 
              onClick={onAcknowledge}
              className="bg-gray-900 hover:bg-gray-800"
            >
              I acknowledge
            </Button>
            <Button 
              variant="outline" 
              onClick={onSendReminders}
            >
              Send remainders (HR)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailModal;
