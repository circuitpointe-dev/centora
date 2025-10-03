import React, { useEffect, useRef, useState } from "react";
import { Search, Filter, Eye, Download, Upload, Loader2, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import BrowseTemplateDetailView from "./BrowseTemplateDetailView";
import { useTemplates, useSeedSampleTemplates } from "@/hooks/useTemplates";
import { Button } from "@/components/ui/button";
import UploadDocumentDialog from "@/components/documents/documents-feature/UploadDocumentDialog";

interface Template {
  id?: string;
  title: string;
  description: string;
  fileType: string;
  uses: number;
  imageSrc: string;
  rating?: number;
  file_path?: string;
  file_name?: string;
  preview_url?: string;
}

interface CreationContext {
  method: string;
  title: string;
  opportunityId: string;
  isTemplate: boolean;
}

interface BrowseTemplatesTabProps {
  creationContext?: CreationContext;
}

// No demo data - only real templates from database

const BrowseTemplateCard: React.FC<{
  template: Template;
  onPreview: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
  creationContext?: CreationContext;
}> = ({ template, onPreview, onUseTemplate, creationContext }) => {
  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-4 w-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "Word":
        return "bg-blue-100 text-blue-800";
      case "PowerPoint":
        return "bg-orange-100 text-orange-800";
      case "PDF":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={template.imageSrc}
          alt={template.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getFileTypeColor(template.fileType)}`}>
            {template.fileType}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {template.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {template.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {renderStars(template.rating)}
          </div>
          <span className="text-xs text-gray-500">{template.uses} uses</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => onUseTemplate(template)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            {creationContext ? "Use Template" : "Use Template"}
          </button>
        </div>
      </div>
    </div>
  );
};

const BrowseTemplatesTab: React.FC<BrowseTemplatesTabProps> = ({ creationContext }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const navigate = useNavigate();

  // Fetch real templates from backend
  const { data: backendTemplates = [], isLoading } = useTemplates({
    search: searchTerm,
  });

  const seedSamples = useSeedSampleTemplates();

  // Auto-seed once if empty
  const seededRef = useRef(false);
  useEffect(() => {
    if (!isLoading && backendTemplates.length === 0 && !seededRef.current && !seedSamples.isPending) {
      seededRef.current = true;
      seedSamples.mutate();
    }
  }, [isLoading, backendTemplates.length, seedSamples]);

  // Convert backend templates to display format
  const displayTemplates: Template[] = backendTemplates.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description || '',
    fileType: t.mime_type?.includes('word') ? 'Word' :
      t.mime_type?.includes('pdf') ? 'PDF' :
        t.mime_type?.includes('presentation') ? 'PowerPoint' : 'Document',
    uses: 0,
    imageSrc: t.preview_url || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    rating: 5,
    file_path: t.file_path,
    file_name: t.file_name
  }));

  const filteredTemplates = displayTemplates.filter((template) => {
    const matchesFileType =
      fileTypeFilter === "all" ||
      template.fileType.toLowerCase() === fileTypeFilter.toLowerCase();
    return matchesFileType;
  });

  const uniqueFileTypes = Array.from(new Set(displayTemplates.map(t => t.fileType)));

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = (template: Template) => {
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

  const handleBackToLibrary = () => {
    setSelectedTemplate(null);
  };

  if (selectedTemplate) {
    return (
      <BrowseTemplateDetailView
        template={selectedTemplate}
        onBack={handleBackToLibrary}
        creationContext={creationContext}
      />
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Browse Templates</h2>
            {creationContext && (
              <p className="text-sm text-gray-600 mt-1">
                Select a template to use for "{creationContext.title}"
              </p>
            )}
          </div>

          <Button
            onClick={() => setShowUploadDialog(true)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Template
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
            <SelectTrigger className="w-[140px] bg-white border-gray-200">
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueFileTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <BrowseTemplateCard
                key={template.id || index}
                template={template}
                onPreview={handlePreviewTemplate}
                onUseTemplate={handleUseTemplate}
                creationContext={creationContext}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Available</h3>
              <p className="text-gray-500 mb-4">
                {backendTemplates.length === 0
                  ? "Get started by uploading your first proposal template."
                  : "No templates match your current search or filter criteria."}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Template
              </Button>
              {backendTemplates.length === 0 && (
                <Button
                  variant="outline"
                  onClick={() => seedSamples.mutate()}
                  disabled={seedSamples.isPending}
                >
                  {seedSamples.isPending ? 'Seeding samples...' : 'Add Sample Templates'}
                </Button>
              )}
              <div className="text-sm text-gray-400">
                Supported formats: Word, PDF, PowerPoint
              </div>
            </div>
          </div>
        )}
      </div>

      <UploadDocumentDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
    </>
  );
};

export default BrowseTemplatesTab;
