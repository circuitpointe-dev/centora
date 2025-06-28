import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RequestSignatureWizard } from './RequestSignatureWizard';

const ESignaturePage: React.FC = () => {
  const navigationTabs = [
    { id: "request",   label: "Request Signature Wizard" },
    { id: "tracking",  label: "Signature Tracking" },
    { id: "expiry",    label: "Document Expiry Monitor" },
    { id: "certificate", label: "Certificate of Completion" },
    { id: "history",   label: "Signed Document History" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">E-Signature</h1>
        <div className="flex items-center space-x-2 border border-gray-200 rounded-full px-3">
          <Input
            placeholder="Search documents, templates..."
            className="border-0 p-0 h-auto text-sm placeholder-gray-400 focus:ring-0"
          />
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-0">
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="flex space-x-4 border-b border-gray-200">
              {navigationTabs.map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="
                    text-sm font-medium text-gray-600
                    data-[state=active]:text-violet-600
                    data-[state=active]:border-b-2
                    data-[state=active]:border-violet-600
                  "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-4">
          <Tabs defaultValue="request">
            <TabsContent value="request">
              <RequestSignatureWizard />
            </TabsContent>
            <TabsContent value="tracking">
              <div className="h-64 flex items-center justify-center text-gray-500">
                Signature Tracking content coming soon…
              </div>
            </TabsContent>
            <TabsContent value="expiry">
              <div className="h-64 flex items-center justify-center text-gray-500">
                Document Expiry Monitor coming soon…
              </div>
            </TabsContent>
            <TabsContent value="certificate">
              <div className="h-64 flex items-center justify-center text-gray-500">
                Certificate of Completion coming soon…
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="h-64 flex items-center justify-center text-gray-500">
                Signed Document History coming soon…
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ESignaturePage;
