
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import DocumentPreviewCard from './DocumentPreviewCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const DocumentsFeaturePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const documentType = searchParams.get('type');

  const filteredDocuments = useMemo(
    () =>
      documentType && documentType !== 'all'
        ? documentsData.filter((doc) => doc.category === documentType)
        : documentsData,
    [documentType]
  );

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (filteredDocuments.length > 0) {
      setSelectedDocumentId(filteredDocuments[0].id);
    } else {
      setSelectedDocumentId(null);
    }
  }, [filteredDocuments]);

  const handleSelectDocument = (id: string) => {
    setSelectedDocumentId(id);
  };

  const handleClosePreview = () => {
    setSelectedDocumentId(null);
  };

  const selectedDocument = useMemo(
    () => documentsData.find((doc) => doc.id === selectedDocumentId),
    [selectedDocumentId]
  );

  return (
    <div className="flex flex-col h-full gap-6 pb-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
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
                  <p>Grid View</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <List className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List View</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Button className="h-[43px] w-48 gap-1.5 rounded-[5px] bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* Page Content */}
      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="col-span-12 lg:col-span-9">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pr-6">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    {...doc}
                    selected={selectedDocumentId === doc.id}
                    onSelect={() => handleSelectDocument(doc.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  <p>No documents found in this category.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="hidden lg:block lg:col-span-3">
          {selectedDocument ? (
            <DocumentPreviewCard
              document={selectedDocument}
              onClose={handleClosePreview}
            />
          ) : (
            <Card className="h-full">
              <div className="flex h-full items-center justify-center p-4 text-center text-gray-500">
                <p>Select a document to see the preview</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsFeaturePage;
