
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  Edit,
  FileText,
  Lock,
  PenLine,
  RotateCw,
  Share2,
  X,
} from "lucide-react";
import { Document } from "./data";

interface DocumentPreviewCardProps {
  document: Document;
  onClose: () => void;
}

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

const DocumentPreviewCard = ({
  document,
  onClose,
}: DocumentPreviewCardProps): JSX.Element => {
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
      { label: "Version History", icon: <RotateCw className="w-5 h-5" /> },
      { label: "Edit", icon: <Edit className="w-[18px] h-[18px]" /> },
    ],
    [
      {
        label: "Request Signature",
        icon: <PenLine className="w-[18px] h-[18px]" />,
      },
      { label: "Share", icon: <Share2 className="w-[18px] h-[18px]" /> },
    ],
  ];

  return (
    <Card className="h-full sticky top-8 flex flex-col border-gray-200 rounded-lg shadow-sm">
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
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="font-medium text-[#383838cc] text-base">
                  Details
                </div>
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col items-start gap-[18px]">
                    {documentDetails.map((detail) => (
                      <div
                        key={detail.label}
                        className="font-normal text-[#38383880] text-[13px]"
                      >
                        {detail.label}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-end gap-[18px]">
                    {documentDetails.map((detail) => (
                      <div
                        key={detail.label}
                        className="font-normal text-[#383838e6] text-[13px] text-right"
                      >
                        {detail.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 w-full">
                <div className="font-medium text-[#383838cc] text-base">
                  Tags
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {document.tags.map((tag) => (
                    <Badge
                      key={tag.name}
                      className={`${tag.bgColor} ${tag.textColor} h-[25px] px-2.5 py-1 rounded-[5px] font-medium text-xs border-0`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 w-full">
                <div className="font-medium text-[#383838cc] text-base">
                  Permissions
                </div>
                <div className="flex flex-col items-start gap-4 w-full">
                  {permissions.map((item) => (
                    <div
                      key={item.group}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <div className="font-medium text-[#383838cc] text-[13px]">
                          {item.group}
                        </div>
                      </div>
                      <Badge className="bg-[#f2f2f2] text-[#383839b2] h-[25px] px-2.5 py-1 rounded-[5px] font-medium text-xs border-0">
                        {item.permission}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 mt-auto pt-6">
            <Button className="h-[43px] w-full gap-1.5 rounded-[5px] bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700">
              <Download className="h-4 w-4" />
              <span>Download Document</span>
            </Button>
            <div className="flex flex-col items-start gap-2">
              {actionRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-[13px]">
                  {row.map((action) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      className="flex items-center gap-2 p-2.5 h-auto"
                    >
                      {action.icon}
                      <span className="font-normal text-[#38383880] text-sm">
                        {action.label}
                      </span>
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DocumentPreviewCard;
