import React, { useState } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PolicyDocument } from './data/policyLibraryData';

interface PolicyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: PolicyDocument | null;
  onAcknowledge?: (policyId: string) => void;
}

export const PolicyDetailDialog: React.FC<PolicyDetailDialogProps> = ({
  open,
  onOpenChange,
  policy,
  onAcknowledge
}) => {
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);

  if (!policy) return null;

  const handleAcknowledge = () => {
    if (onAcknowledge) {
      onAcknowledge(policy.id);
    }
    setShowAcknowledgment(true);
  };

  const handleGoBack = () => {
    setShowAcknowledgment(false);
    onOpenChange(false);
  };

  const isPending = policy.status === 'Pending';

  if (showAcknowledgment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-white">
          <div className="text-center py-8">
            <div className="mx-auto mb-6 w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-violet-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Acknowledgment complete
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for reviewing this policy.
            </p>
            
            <Button 
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={handleGoBack}
            >
              Go Back to Policy Library
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white p-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {policy.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Version: {policy.version}</span>
                <span>•</span>
                <span>Last Updated: {new Date(policy.lastUpdated).toLocaleDateString()}</span>
                <span>•</span>
                <span>Status: {policy.status}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
            <p className="text-gray-700 leading-relaxed">
              {policy.content.overview}
            </p>
          </div>

          {/* Scope */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Scope</h3>
            <p className="text-gray-700 leading-relaxed">
              {policy.content.scope}
            </p>
          </div>

          {/* Key Guidelines */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Guidelines</h3>
            <ul className="space-y-2">
              {policy.content.keyGuidelines.map((guideline, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-violet-600 mt-1.5">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conflicts of Interest */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Conflicts of Interest</h3>
            <p className="text-gray-700 leading-relaxed">
              {policy.content.conflictsOfInterest}
            </p>
          </div>

          {/* Consequences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Consequences</h3>
            <p className="text-gray-700 leading-relaxed">
              {policy.content.consequences}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button 
              variant="link" 
              className="text-violet-600 hover:text-violet-700 p-0"
            >
              <Download className="w-4 h-4 mr-1" />
              Download PDF
            </Button>
            
            {isPending && (
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white"
                onClick={handleAcknowledge}
              >
                Acknowledge Policy
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};