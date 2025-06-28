
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
      <Card className="h-full flex flex-col border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white shadow-lg">
        {/* Header with accent */}
        <div className="bg-violet-100 border-b border-violet-200 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-200 rounded-lg">
                <FileText className="w-5 h-5 text-violet-700" />
              </div>
              <div>
                <div className="font-semibold text-violet-900 text-base">
                  Document Preview
                </div>
                <div className="text-sm text-violet-700">
                  Selected Document
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document thumbnail */}
        <div className="flex h-[120px] items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200 shrink-0">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>

        <div className="flex-grow bg-white overflow-y-auto">
          <div className="flex flex-col h-full p-4">
            <div className="flex flex-col items-start gap-6">
              <div className="flex flex-col items-start gap-2 w-full">
                <div
                  className="font-semibold text-gray-900 text-lg w-full truncate"
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
