
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, X } from "lucide-react";
import { Document } from "./data";
import VersionHistoryDialog from "./VersionHistoryDialog";
import ShareDocumentDialog from "./ShareDocumentDialog";
import EditPermissionsDialog from "./EditPermissionsDialog";
import DocumentEditorDialog from "./DocumentEditorDialog";
import { useDocumentPreview } from "./useDocumentPreview";
import DocumentDetailsSection from "./preview-card-sections/DocumentDetailsSection";
import DocumentTagsSection from "./preview-card-sections/DocumentTagsSection";
import DocumentPermissionsSection from "./preview-card-sections/DocumentPermissionsSection";
import DocumentActionsSection from "./preview-card-sections/DocumentActionsSection";

interface DocumentPreviewCardProps {
  document: Document;
  onClose: () => void;
}

const DocumentPreviewCard = ({
  document,
  onClose,
}: DocumentPreviewCardProps): JSX.Element => {
  const {
    isVersionHistoryOpen,
    setIsVersionHistoryOpen,
    isShareDialogOpen,
    setIsShareDialogOpen,
    isEditPermissionsOpen,
    setIsEditPermissionsOpen,
    isDocumentEditorOpen,
    setIsDocumentEditorOpen,
    documentDetails,
    permissions,
    setPermissions,
    actionRows,
  } = useDocumentPreview(document);

  const handleSavePermissions = (newPermissions: any[]) => {
    setPermissions(newPermissions);
  };

  // Get user's current permission for the document
  const userPermission = permissions.find(p => p.group === "HR Team")?.permission || "View";

  return (
    <>
      <Card className="h-full flex flex-col border-gray-200 rounded-lg shadow-sm">
        <div className="flex h-[138px] items-center justify-center bg-[#f2f2f2] rounded-t-lg shrink-0">
          <FileText className="w-12 h-12 text-gray-500" />
        </div>

        <div className="flex-grow bg-white rounded-b-lg overflow-y-auto">
          <div className="flex flex-col h-full p-4">
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex w-full items-start justify-between">
                  <div className="font-medium text-[#383838] text-base">
                    Document Preview
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div
                  className="font-normal text-[#38383899] text-sm w-full truncate"
                  title={document.fileName}
                >
                  {document.fileName}
                </div>
              </div>

              <div className="flex flex-col items-start gap-8 w-full">
                <DocumentDetailsSection details={documentDetails} />
                <DocumentTagsSection tags={document.tags} />
                <DocumentPermissionsSection 
                  permissions={permissions} 
                  onEditPermissions={() => setIsEditPermissionsOpen(true)}
                />
              </div>
            </div>
            <DocumentActionsSection actionRows={actionRows} />
          </div>
        </div>
      </Card>

      <VersionHistoryDialog 
        open={isVersionHistoryOpen}
        onOpenChange={setIsVersionHistoryOpen}
        document={document}
      />
      <ShareDocumentDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        document={document}
      />
      <EditPermissionsDialog
        open={isEditPermissionsOpen}
        onOpenChange={setIsEditPermissionsOpen}
        document={document}
        initialPermissions={permissions}
        onSave={handleSavePermissions}
      />
      <DocumentEditorDialog
        open={isDocumentEditorOpen}
        onOpenChange={setIsDocumentEditorOpen}
        document={document}
        userPermissions={userPermission}
      />
    </>
  );
};

export default DocumentPreviewCard;
