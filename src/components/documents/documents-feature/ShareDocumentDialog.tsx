
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Users, FileSignature } from 'lucide-react';
import { Document } from './data';
import InternalDepartmentShare from './share-components/InternalDepartmentShare';
import StaffShare from './share-components/StaffShare';
import ExternalSignatureShare from './share-components/ExternalSignatureShare';

interface ShareDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
}

const ShareDocumentDialog = ({ open, onOpenChange, document }: ShareDocumentDialogProps) => {
  const [activeTab, setActiveTab] = useState('departments');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl h-[600px] bg-white border border-gray-200 p-0 flex flex-col">
  <DialogHeader className="border-b border-gray-100 p-6 pb-4">
    <DialogTitle className="text-lg font-semibold text-gray-900">
      Share Document
    </DialogTitle>
    <p className="text-sm text-gray-600 mt-1">
      Share "{document.fileName}" with colleagues or external parties
    </p>
  </DialogHeader>

  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
    
    {/* ✅ Keep TabsList always visible */}
    <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-gray-200 mx-6 mt-4 mb-0 rounded-none p-0 h-auto shrink-0">
      <TabsTrigger value="departments" className="flex items-center gap-1 text-xs py-3 px-2 border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600">
        <Building2 className="w-3 h-3" />
        Dept
      </TabsTrigger>
      <TabsTrigger value="staff" className="flex items-center gap-1 text-xs py-3 px-2 border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600">
        <Users className="w-3 h-3" />
        Staff
      </TabsTrigger>
      <TabsTrigger value="signature" className="flex items-center gap-1 text-xs py-3 px-2 border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-600">
        <FileSignature className="w-3 h-3" />
        e-Sign
      </TabsTrigger>
    </TabsList>

    {/* ✅ Scrollable content area only */}
    <div className="flex-1 min-h-0 overflow-hidden">
      <TabsContent value="departments" className="h-full m-0 px-6">
        <ScrollArea className="h-full py-4">
          <InternalDepartmentShare document={document} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="staff" className="h-full m-0 px-6">
        <ScrollArea className="h-full py-4">
          <StaffShare document={document} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="signature" className="h-full m-0 px-6">
        <ScrollArea className="h-full py-4">
          <ExternalSignatureShare document={document} />
        </ScrollArea>
      </TabsContent>
    </div>

    {/* ✅ Footer always visible */}
    <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-100 bg-white shrink-0">
      <Button
        variant="outline"
        onClick={() => onOpenChange(false)}
        className="border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </Button>
    </div>
  </Tabs>
</DialogContent>
    </Dialog>
  );
};

export default ShareDocumentDialog;
