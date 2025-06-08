import React, { useState } from "react";
import { Search, Filter, Eye, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import BrowseTemplateDetailView from "./BrowseTemplateDetailView";

interface Template {
  title: string;
  description: string;
  fileType: string;
  uses: number;
  imageSrc: string;
  rating?: number;
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

const sampleTemplates: Template[] = [
  {
    title: "Empower Change: A Fundraising Proposal",
    description: "Hey there! Have you ever thought about exploring new horizons together?",
    fileType: "Word",
    uses: 742,
    imageSrc: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    rating: 5,
  },
  {
    title: "Together We Rise: Community Support Initiative",
    description: "Imagine the possibilities if we teamed up on this project!",
    fileType: "PowerPoint",
    uses: 1256,
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    rating: 5,
  },
  {
    title: "Seeds of Hope: A Green Fundraising Campaign",
    description: "What if we joined forces to create something truly amazing?",
    fileType: "Word",
    uses: 934,
    imageSrc: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    rating: 5,
  },
  {
    title: "Building Futures: Education Fundraising Proposal",
    description: "Let's brainstorm some exciting ideas that could transform our community.",
    fileType: "Word",
    uses: 389,
    imageSrc: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop",
    rating: 5,
  },
  {
    title: "Hearts United: A Charitable Giving Proposal",
    description: "How about we collaborate and bring innovative solutions to life?",
    fileType: "PowerPoint",
    uses: 1024,
    imageSrc: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    rating: 5,
  },
  {
    title: "Voices for Change: Advocacy Fundraising Proposal",
    description: "I have a vision that I think we could turn into reality together.",
    fileType: "Word",
    uses: 562,
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    rating: 5,
  },
];

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
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "word":
        return "bg-blue-100 text-blue-800";
      case "powerpoint":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="w-full h-48 bg-gray-100">
        <img
          src={template.imageSrc}
          alt={template.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${getFileTypeColor(template.fileType)}`}>
            {template.fileType}
          </span>
          {template.rating && (
            <div className="flex items-center gap-1">
              {renderStars(template.rating)}
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 truncate">
          {template.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 overflow-hidden">
          <span className="line-clamp-2">{template.description}</span>
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {template.uses} uses
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPreview(template)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button 
              onClick={() => onUseTemplate(template)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-violet-600 rounded hover:bg-violet-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              {creationContext ? "Use Template" : "Use Template"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrowseTemplatesTab: React.FC<BrowseTemplatesTabProps> = ({ creationContext }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const navigate = useNavigate();

  const filteredTemplates = sampleTemplates.filter((template) => {
    const matchesSearch = 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFileType = 
      fileTypeFilter === "all" || template.fileType === fileTypeFilter;
    
    return matchesSearch && matchesFileType;
  });

  const uniqueFileTypes = Array.from(new Set(sampleTemplates.map(t => t.fileType)));

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
    
    navigate("/modules/fundraising/manual-proposal-creation", {
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
        
        <div className="flex items-center gap-4">
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

          <div className="relative w-64">
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
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredTemplates.length} of {sampleTemplates.length} templates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <BrowseTemplateCard
            key={index}
            template={template}
            onPreview={handlePreviewTemplate}
            onUseTemplate={handleUseTemplate}
            creationContext={creationContext}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found matching your criteria.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filter options.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseTemplatesTab;
