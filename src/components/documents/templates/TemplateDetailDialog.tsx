import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Edit2, Play } from 'lucide-react';

interface TemplateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: any;
  onUseTemplate?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const TemplateDetailDialog: React.FC<TemplateDetailDialogProps> = ({
  open,
  onOpenChange,
  template,
  onUseTemplate,
  onEdit
}) => {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-violet-600" />
            Template Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Image */}
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={template.image}
              alt={`${template.title} Preview`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Template Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.title}
              </h3>
              <div className="flex items-center gap-4 mb-3">
                <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                  {template.category}
                </Badge>
                <span className="text-sm text-gray-600">{template.department}</span>
              </div>
              <p className="text-sm text-gray-600">
                Last updated {template.lastUpdated}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">
                This is a professional {template.category.toLowerCase()} template designed for the {template.department} department. 
                It includes all necessary sections and formatting to ensure compliance and consistency.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Professional formatting and layout</li>
                <li>• Customizable sections and fields</li>
                <li>• Department-specific compliance guidelines</li>
                <li>• Easy-to-use template structure</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              onClick={() => {
                onUseTemplate?.(template.id);
                onOpenChange(false);
              }}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Use as Template
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onEdit?.(template.id);
                onOpenChange(false);
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};