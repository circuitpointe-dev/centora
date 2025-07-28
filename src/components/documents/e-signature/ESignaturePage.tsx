
import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SignatureTracking } from './SignatureTracking';
import { DocumentExpiryMonitor } from './DocumentExpiryMonitor';
import { CertificateOfCompletion } from './CertificateOfCompletion';
import { SignedDocumentHistory } from './SignedDocumentHistory';

const ESignaturePage = () => {
  const navigate = useNavigate();
  
  const navigationTabs = [
    { id: "tracking", label: "Signature Tracking" },
    { id: "expiry", label: "Document Expiry Monitor" },
    { id: "certificate", label: "Certificate of Completion" },
    { id: "history", label: "Signed Document History" },
  ];

  const handleRequestSignature = () => {
    navigate('/dashboard/documents/request-signature');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-gray-900">E-Signature</h1>
        <Button 
          onClick={handleRequestSignature}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-[5px] gap-2"
        >
          <Plus className="w-4 h-4" />
          Request for Signature
        </Button>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-8 border-b w-full justify-start">
          {navigationTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="inline-flex items-center justify-center gap-2.5 p-2.5 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=inactive]:text-[#38383880] data-[state=inactive]:border-b-0 bg-transparent shadow-none"
            >
              <span className="font-normal text-sm">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="tracking" className="mt-6">
          <SignatureTracking />
        </TabsContent>

        <TabsContent value="expiry" className="mt-6">
          <DocumentExpiryMonitor />
        </TabsContent>

        <TabsContent value="certificate" className="mt-6">
          <CertificateOfCompletion />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <SignedDocumentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESignaturePage;
