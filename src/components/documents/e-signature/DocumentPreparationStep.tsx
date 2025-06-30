
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentCanvas } from "./review-step/DocumentCanvas";
import { FieldSelectionCard } from "./review-step/FieldSelectionCard";
import { PropertyCard } from "./review-step/PropertyCard";
import { User, Calendar, Mail, Edit, Type } from "lucide-react";

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email" | "text";
  icon: React.ReactNode;
}

interface Document {
  id: string;
  fileName: string;
  category: string;
  fileSize: string;
  addedTime: string;
  owner: {
    name: string;
    avatar: string;
  };
  tags: Array<{
    name: string;
    bgColor: string;
    textColor: string;
  }>;
}

interface UploadedFile {
  file: File;
  id: string;
}

interface DocumentPreparationStepProps {
  onSendForSignature: () => void;
  selectedDocument?: Document | null;
  uploadedFile?: UploadedFile | null;
}

export const DocumentPreparationStep = ({
  onSendForSignature,
  selectedDocument,
  uploadedFile,
}: DocumentPreparationStepProps) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeTab, setActiveTab] = useState("fields");

  const fieldTypes: Field[] = [
    {
      id: "signer",
      name: "Signer",
      type: "signer",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "signature",
      name: "Signature",
      type: "signature",
      icon: <Edit className="w-4 h-4" />,
    },
    {
      id: "name",
      name: "Full Name",
      type: "name",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "date",
      name: "Date Signed",
      type: "date",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "email",
      name: "Email",
      type: "email",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: "text",
      name: "Text",
      type: "text",
      icon: <Type className="w-4 h-4" />,
    },
  ];

  // Check if we have a document to work with
  const hasDocument = selectedDocument || uploadedFile;

  return (
    <div className="max-w-full mx-auto space-y-4">
      <Card className="rounded-[5px] shadow-none border-none">
        <CardContent className="p-4">
          {/* Two Column Layout */}
          <div className="grid grid-cols-12 gap-3 h-[500px] mb-4">
            {/* Document Canvas - Takes up most space */}
            <div className="col-span-9">
              <DocumentCanvas />
            </div>

            {/* Right Sidebar with Fields and Properties */}
            <div className="col-span-3 space-y-3">
              {/* Field Selection Card */}
              <div className="h-[250px]">
                <FieldSelectionCard
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  fieldTypes={fieldTypes}
                  selectedField={selectedField}
                  onFieldSelect={setSelectedField}
                />
              </div>

              {/* Property Card */}
              <div className="h-[240px]">
                <PropertyCard selectedField={selectedField} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Button - Only show when document is available */}
      {hasDocument && (
        <div className="flex justify-center">
          <Button
            onClick={onSendForSignature}
            className="gap-2 px-6 py-2 h-auto rounded-[5px] text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white"
          >
            Send For Signature
          </Button>
        </div>
      )}
    </div>
  );
};
