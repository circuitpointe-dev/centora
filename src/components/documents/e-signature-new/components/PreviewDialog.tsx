import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, Mail, PenTool } from 'lucide-react';
import type { FieldData } from '../EditorNewPage';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldData[];
  documentTitle?: string;
}

const getFieldIcon = (type: string) => {
  switch (type) {
    case 'signature':
      return <PenTool className="h-4 w-4" />;
    case 'name':
      return <User className="h-4 w-4" />;
    case 'date':
      return <Calendar className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getFieldColor = (type: string) => {
  switch (type) {
    case 'signature':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'name':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'date':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'email':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'text':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  fields,
  documentTitle = 'Document'
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-none shadow-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            E-Signature Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <Card className="p-4 rounded-sm">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">{documentTitle}</h3>
                <p className="text-sm text-gray-500">Ready for signature collection</p>
              </div>
            </div>
          </Card>

          {/* Fields Summary */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Fields ({fields.length})</h4>
            
            {fields.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No fields added yet</p>
                <p className="text-sm text-gray-400">Add signature fields to continue</p>
              </Card>
            ) : (
              <div className="grid gap-3">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-3 rounded-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getFieldIcon(field.type)}
                          <span className="text-sm font-medium">{field.label}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getFieldColor(field.type)}`}
                        >
                          {field.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {field.required && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                            Required
                          </Badge>
                        )}
                        <Badge 
                          variant={field.isConfigured ? "default" : "outline"} 
                          className="text-xs"
                        >
                          {field.isConfigured ? 'Configured' : 'Needs Setup'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Back to Editor
            </Button>
            {fields.length > 0 && (
              <Button 
                variant="secondary"
                onClick={() => {
                  // TODO: Switch to fill mode
                  console.log('Switch to fill mode');
                }}
              >
                Fill Document
              </Button>
            )}
            <Button 
              disabled={fields.length === 0}
              onClick={() => {
                // TODO: Implement send for signature
                console.log('Send for signature');
                onOpenChange(false);
              }}
            >
              Send for Signature
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};