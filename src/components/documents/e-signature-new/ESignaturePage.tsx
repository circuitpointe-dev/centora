import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Plus, Upload, PenTool } from 'lucide-react';
import { DocumentSelectionDialog } from './components/DocumentSelectionDialog';
import { useNavigate } from 'react-router-dom';

const ESignaturePage = () => {
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Select Document",
      description: "Choose an existing document to add signature fields",
      action: () => setIsDocumentDialogOpen(true),
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload & Sign",
      description: "Upload a new document and add signature fields",
      action: () => navigate('/dashboard/documents/documents'),
      bgColor: "bg-green-50", 
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          E-Signature Editor
        </h1>
        <p className="text-gray-600">
          Create and manage documents for electronic signature
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Card 
            key={index}
            className={`p-6 hover:shadow-md transition-shadow cursor-pointer border ${action.borderColor}`}
            onClick={action.action}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${action.bgColor}`}>
                <div className={action.iconColor}>
                  {action.icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                <Button variant="outline" size="sm" className="pointer-events-none">
                  Get Started
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Documents */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-gray-900">Recent E-Signature Activity</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        
        <div className="text-center py-8">
          <PenTool className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No signature requests yet</p>
          <p className="text-sm text-gray-400">Start by selecting a document above</p>
        </div>
      </Card>

      <DocumentSelectionDialog
        open={isDocumentDialogOpen}
        onOpenChange={setIsDocumentDialogOpen}
      />
    </div>
  );
};

export default ESignaturePage;