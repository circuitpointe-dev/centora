import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TemplateGallery } from './TemplateGallery';
import { SavedTemplates } from './SavedTemplates';
import { ReferenceMaterials } from './ReferenceMaterials';

const TemplatesPage = () => {
  const navigationTabs = [
    { id: "gallery", label: "Template Gallery" },
    { id: "saved", label: "Saved Templates" },
    { id: "reference", label: "Reference Materials" },
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-gray-900">Templates</h1>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="bg-white h-auto p-0 border-b w-full justify-start grid grid-cols-3">
          {navigationTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="inline-flex items-center justify-center gap-2.5 p-2.5 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600 data-[state=inactive]:text-[#38383880] data-[state=inactive]:border-b-0 bg-white shadow-none"
            >
              <span className="font-normal text-sm">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <TemplateGallery />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedTemplates />
        </TabsContent>

        <TabsContent value="reference" className="mt-6">
          <ReferenceMaterials />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesPage;