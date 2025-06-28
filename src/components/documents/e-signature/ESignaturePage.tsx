
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RequestSignatureWizard } from './RequestSignatureWizard';

const ESignaturePage = () => {
  const navigationTabs = [
    { id: "request", label: "Request Signature Wizard" },
    { id: "tracking", label: "Signature Tracking" },
    { id: "expiry", label: "Document Expiry Monitor" },
    { id: "certificate", label: "Certificate of Completion" },
    { id: "history", label: "Signed Document History" },
  ];

  return (
    <div className="bg-[#f4f6f9] flex flex-row justify-center w-full">
      <div className="bg-[#f4f6f9] w-[1120px] relative">
        {/* Header */}
        <header className="flex w-full h-[75px] items-center justify-between px-8 py-0 bg-white border-b border-[#e6eff5]">
          <h1 className="font-medium text-[#383839] text-xl">E-Signature</h1>

          <div className="inline-flex h-[30px] items-center gap-4 px-4 py-2 relative rounded-[20px] border border-solid border-[#e0e0e0]">
            <Input
              className="border-0 p-0 h-auto text-xs text-[#9b9b9b] placeholder:text-[#9b9b9b] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Search documents, templates, or policies..."
            />
            <Search className="w-4 h-4" />
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex w-full items-center gap-[39px] pt-6 pb-0 px-8 bg-white border-b">
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="bg-transparent h-auto p-0 gap-[39px]">
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

            <TabsContent value="request" className="mt-0">
              <RequestSignatureWizard />
            </TabsContent>

            <TabsContent value="tracking" className="mt-0">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Signature Tracking content coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="expiry" className="mt-0">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Document Expiry Monitor content coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="certificate" className="mt-0">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Certificate of Completion content coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Signed Document History content coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </nav>
      </div>
    </div>
  );
};

export default ESignaturePage;
