
import React from "react";
import {
  Edit,
  Lock,
  PenLine,
  RotateCw,
  Share2,
} from "lucide-react";
import { Document } from "./data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toUpperCase();
  if (!extension) return "Document";
  if (extension === "PDF") return "PDF Document";
  if (extension === "DOCX") return "Word Document";
  if (extension === "XLSX") return "Excel Spreadsheet";
  if (extension === "PPTX") return "PowerPoint Presentation";
  if (extension === "TXT") return "Text Document";
  return `${extension} File`;
};

const getFileSize = () => `${(Math.random() * 5 + 1).toFixed(1)} MB`;

export const useDocumentPreview = (document: Document) => {
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = React.useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = React.useState(false);

    const documentDetails = [
        { label: "Type", value: getFileType(document.fileName) },
        { label: "Size", value: getFileSize() },
        { label: "Owner", value: document.owner.name },
        { label: "Modified", value: "Jun 15, 2025" },
    ];

    const permissions = [
        {
        group: "HR Team",
        permission: "Edit",
        icon: (
            <Avatar className="w-5 h-5">
            <AvatarImage src="https://github.com/shadcn.png" alt="HR Team" />
            <AvatarFallback>HR</AvatarFallback>
            </Avatar>
        ),
        },
        {
        group: "Others",
        permission: "View",
        icon: <Lock className="w-5 h-5 text-gray-500" />,
        },
    ];

    const actionRows = [
        [
            { label: "Edit", icon: <Edit className="w-[18px] h-[18px]" /> },
            {
                label: "Request Signature",
                icon: <PenLine className="w-[18px] h-[18px]" />,
            },
        ],
        [
            { label: "Version History", icon: <RotateCw className="w-5 h-5" />, onClick: () => setIsVersionHistoryOpen(true) },
            { label: "Share", icon: <Share2 className="w-[18px] h-[18px]" />, onClick: () => setIsShareDialogOpen(true) },
        ],
    ];

    return {
        isVersionHistoryOpen,
        setIsVersionHistoryOpen,
        isShareDialogOpen,
        setIsShareDialogOpen,
        documentDetails,
        permissions,
        actionRows,
    };
}
