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
    id: string | number;
    title: string;
    category?: string;
    updated_at_date?: string | null;
    version?: string;
    document_url?: string | null;
    ackRate?: number;
    hasLowAck?: boolean;
  };
  assignedCount?: number;
  acknowledgedCount?: number;
  pendingCount?: number;
}

const PolicyDetailModal: React.FC<PolicyDetailModalProps> = ({
  isOpen,
  onClose,
  onAcknowledge,
  onSendReminders,
  policy,
  assignedCount = 0,
  acknowledgedCount = 0,
  pendingCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState('summary');

  if (!isOpen || !policy) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString();
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
      <div className="fixed inset-0 backdrop-blur-md bg-card/30" />

      {/* Modal Content */}
      <div className="relative bg-card rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{policy.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {(policy.category || '—')} • {(policy.version || '—')} • Updated {formatDate(policy.updated_at_date)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="border-b border-border">
              <TabsList className="h-auto p-0 bg-transparent flex space-x-8 justify-start">
                <TabsTrigger
                  value="summary"
                  className="relative px-0 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:rounded-none"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="document"
                  className="relative px-0 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:rounded-none"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="assignments"
                  className="relative px-0 py-3 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:rounded-none"
                >
                  Assignments
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="summary" className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-6">
                  Defines expected behaviors and ethical standards for all employees and contractors.
                </p>

                <div>
                  <h4 className="text-md font-semibold text-foreground mb-3">Key changes in {policy.version}</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-muted rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Updated social media guidelines</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-muted rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span>Added remote work conduct section</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="document" className="space-y-6">
              <div>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-muted-foreground">Policy Document</h4>
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
                    {policy.document_url ? (
                      <iframe
                        src={policy.document_url}
                        className="w-full h-full border-0"
                        title="Policy Document"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        No document uploaded for this policy.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Acknowledgement Status</h3>

                <div className="space-y-4">
                  {/* Total Assigned Card */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">Total Assigned</h4>
                        <p className="text-sm text-muted-foreground mt-1">{(assignedCount ?? 0)} people</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-foreground">{(assignedCount ?? 0) > 0 ? '100%' : '0%'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acknowledged Card */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">Acknowledged</h4>
                        <p className="text-sm text-muted-foreground mt-1">{(acknowledgedCount ?? 0)} people</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-foreground">{(assignedCount ?? 0) > 0 ? Math.round(((acknowledgedCount ?? 0) / (assignedCount ?? 0)) * 100) + '%' : '0%'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pending Card */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-foreground">Pending</h4>
                        <p className="text-sm text-muted-foreground mt-1">{(pendingCount ?? 0)} people</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-white bg-red-600 px-2 py-1 rounded">{(assignedCount ?? 0) > 0 ? Math.round(((pendingCount ?? 0) / (assignedCount ?? 0)) * 100) + '%' : '0%'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-muted/50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex space-x-3">
            <Button
              onClick={onAcknowledge}
              className="bg-foreground hover:bg-muted-foreground"
            >
              I acknowledge
            </Button>
            <Button
              variant="outline"
              onClick={onSendReminders}
            >
              Send reminders (HR)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailModal;
