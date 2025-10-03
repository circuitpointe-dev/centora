import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProposalDetailHeader from "./ProposalDetailHeader";
import ProposalOverviewCard from "./ProposalOverviewCard";
import ProposalLogframeCard from "./ProposalLogframeCard";
import ProposalNarrativeCard from "./ProposalNarrativeCard";
import ProposalBudgetCard from "./ProposalBudgetCard";
import ProposalTeamCard from "./ProposalTeamCard";
import ProposalAttachmentsCard from "./ProposalAttachmentsCard";
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface CreationContext {
  method: string;
  title: string;
  opportunityId: string;
  isTemplate: boolean;
}

interface BrowseTemplateDetailViewProps {
  template: {
    title: string;
    description: string;
    fileType: string;
    uses: number;
    imageSrc: string;
    rating?: number;
    file_path?: string;
    file_name?: string;
    preview_url?: string;
    office_preview_url?: string;
  };
  onBack: () => void;
  creationContext?: CreationContext;
}

const BrowseTemplateDetailView: React.FC<BrowseTemplateDetailViewProps> = ({
  template,
  onBack,
  creationContext,
}) => {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);

  const isPdf = useMemo(() => template.fileType?.toLowerCase() === 'pdf' || template.file_name?.toLowerCase().endsWith('.pdf'), [template]);
  const previewUrl = useMemo(() => {
    // If file_path is an absolute URL, use it directly
    if (template.file_path && /^https?:\/\//i.test(template.file_path)) return template.file_path;
    // Prefer signed preview urls if present
    if (template.office_preview_url) return template.office_preview_url;
    if (template.preview_url) return template.preview_url;
    // Otherwise, we don't know the storage URL here; return undefined to show fallback
    return undefined;
  }, [template.file_path]);

  const handleUseTemplate = () => {
    // Navigate to manual proposal creation with template data
    const templateData = {
      source: "template",
      template: template,
      creationContext: creationContext
    };

    navigate("/dashboard/fundraising/manual-proposal-creation", {
      state: { prefilledData: templateData }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <ProposalDetailHeader
        onBack={onBack}
        onReuse={handleUseTemplate}
        title={template.title}
        description={creationContext ? `Using template for "${creationContext.title}"` : template.description}
        buttonText="Use Template"
        buttonIcon={<Download className="h-4 w-4 mr-2" />}
      />

      {/* Preview Section */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Template Preview</h3>
        {isPdf && previewUrl ? (
          <div className="border rounded-md overflow-hidden">
            <PdfDocument file={previewUrl} onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}>
              <Page pageNumber={1} width={900} />
            </PdfDocument>
            {numPages > 1 && (
              <div className="text-xs text-gray-500 p-2">Showing page 1 of {numPages}</div>
            )}
          </div>
        ) : previewUrl ? (
          <iframe src={previewUrl} title="template-preview" className="w-full h-[600px] border rounded-md" />
        ) : (
          <div className="text-sm text-gray-600">
            Preview is unavailable for this file type or storage path. You can still use this template or download it from Documents.
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ProposalOverviewCard />
          <ProposalLogframeCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ProposalNarrativeCard narrativeTitle="Template Narrative" />
          <ProposalBudgetCard budgetDescription="Template budget" />
          <ProposalTeamCard />
        </div>
      </div>

      {/* Attachments Card */}
      <ProposalAttachmentsCard />
    </div>
  );
};

export default BrowseTemplateDetailView;
