
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Upload } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DocumentCard from './DocumentCard';
import { documentsData } from './data';
import { Card } from '@/components/ui/card';

const DocumentsFeaturePage = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    documentsData[0]?.id || null
  );

  const handleSelectDocument = (id: string) => {
    setSelectedDocumentId(id);
  };

  const selectedDocument = documentsData.find(
    (doc) => doc.id === selectedDocumentId
  );

  return (
    <div className="-mx-6 -my-2 flex h-full flex-col">
      <header className="flex h-[75px] w-full shrink-0 items-center justify-between border-b border-[#e6eff5] bg-white px-8 py-0">
        <h1 className="font-medium text-base text-[#383839]">All Documents</h1>

        <div className="flex items-center gap-[30px]">
          <TooltipProvider>
            <div className="flex w-[75px] items-center gap-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View in Grid</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <List className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View as list</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Button className="h-[43px] w-48 gap-1.5 rounded-[5px] bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
          <div className="flex flex-wrap gap-6">
            {documentsData.map((doc) => (
              <DocumentCard
                key={doc.id}
                {...doc}
                selected={selectedDocumentId === doc.id}
                onSelect={() => handleSelectDocument(doc.id)}
              />
            ))}
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-3">
          <Card className="h-full sticky top-8">
            {selectedDocument ? (
              <div className="p-4">
                <h3 className="font-bold text-lg mb-4">Preview</h3>
                <p className="font-medium">{selectedDocument.fileName}</p>
                <p className="text-sm text-gray-500 mt-2">
                  More details for the selected document will be shown here.
                </p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center text-gray-500">
                <p>Select a document to see the preview</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DocumentsFeaturePage;
