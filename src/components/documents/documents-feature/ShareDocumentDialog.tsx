
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
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white border border-gray-200 p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="border-b border-gray-100 p-6 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Share Document
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Share "{document.fileName}" with colleagues or external parties
            </p>
          </DialogHeader>

          <div className="flex-1 min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-50 mx-6 mt-4 mb-0 rounded-md">
                <TabsTrigger 
                  value="departments" 
                  className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  <Building2 className="w-4 h-4" />
                  Departments
                </TabsTrigger>
                <TabsTrigger 
                  value="staff" 
                  className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  <Users className="w-4 h-4" />
                  Staff
                </TabsTrigger>
                <TabsTrigger 
                  value="signature" 
                  className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  <FileSignature className="w-4 h-4" />
                  e-Signature
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 px-6">
                <ScrollArea className="h-full">
                  <div className="py-4">
                    <TabsContent value="departments" className="mt-0 h-full">
                      <InternalDepartmentShare document={document} />
                    </TabsContent>

                    <TabsContent value="staff" className="mt-0 h-full">
                      <StaffShare document={document} />
                    </TabsContent>

                    <TabsContent value="signature" className="mt-0 h-full">
                      <ExternalSignatureShare document={document} />
                    </TabsContent>
                  </div>
                </ScrollArea>
              </div>

              <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-100 bg-white">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentDialog;
