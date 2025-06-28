
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RequestSignatureWizard } from './RequestSignatureWizard';
import { SignatureTracking } from './SignatureTracking';

const ESignaturePage = () => {
  const navigationTabs = [
    { id: "request", label: "Request Signature Wizard" },
    { id: "tracking", label: "Signature Tracking" },
    { id: "expiry", label: "Document Expiry Monitor" },
    { id: "certificate", label: "Certificate of Completion" },
    { id: "history", label: "Signed Document History" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-gray-900">E-Signature</h1>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="request" className="w-full">
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

        <TabsContent value="request" className="mt-6">
          <RequestSignatureWizard />
        </TabsContent>

        <TabsContent value="tracking" className="mt-6">
          <SignatureTracking />
        </TabsContent>

        <TabsContent value="expiry" className="mt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Document Expiry Monitor content coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="certificate" className="mt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Certificate of Completion content coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Signed Document History content coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESignaturePage;
