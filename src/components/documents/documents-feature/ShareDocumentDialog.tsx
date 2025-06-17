
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <DialogContent className="max-w-2xl bg-white border border-gray-200">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Share Document
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Share "{document.fileName}" with colleagues or external parties
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-50">
            <TabsTrigger 
              value="departments" 
              className="flex items-center gap-2 text-sm"
            >
              <Building2 className="w-4 h-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger 
              value="staff" 
              className="flex items-center gap-2 text-sm"
            >
              <Users className="w-4 h-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger 
              value="signature" 
              className="flex items-center gap-2 text-sm"
            >
              <FileSignature className="w-4 h-4" />
              e-Signature
            </TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="mt-6">
            <InternalDepartmentShare document={document} />
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <StaffShare document={document} />
          </TabsContent>

          <TabsContent value="signature" className="mt-6">
            <ExternalSignatureShare document={document} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentDialog;
