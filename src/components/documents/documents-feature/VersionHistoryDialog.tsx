
import React from 'react';
import {
  LargeSideDialog,
  LargeSideDialogContent,
  LargeSideDialogHeader,
  LargeSideDialogTitle,
} from '@/components/ui/large-side-dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock } from 'lucide-react';
import { Document } from './data';
import { useToast } from '@/components/ui/use-toast';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface VersionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
}

const historyData = [
    {
        user: { name: 'Chioma Ike', avatar: 'https://github.com/shadcn.png' },
        date: 'Apr 10, 2025, 12:00 PM',
        action: 'Updated Marketing Strategy'
    },
    {
        user: { name: 'Millicent ERP', avatar: 'https://github.com/shadcn.png' },
        date: 'Apr 8, 2025, 12:00 PM',
        action: 'Added KPIs'
    },
    {
        user: { name: 'Somachi ERP', avatar: 'https://github.com/shadcn.png' },
        date: 'Apr 8, 2025, 12:00 PM',
        action: 'Revised and edited paragraph 1'
    }
];

const VersionHistoryDialog: React.FC<VersionHistoryDialogProps> = ({ open, onOpenChange, document }) => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = React.useState(false);
  const [itemToRestore, setItemToRestore] = React.useState<(typeof historyData)[number] | null>(null);
  const { toast } = useToast();

  const handleAcceptChanges = () => {
    toast({
      title: "Changes Accepted",
      description: `The document "${document.fileName}" has been updated.`,
    });
    onOpenChange(false);
  };
  
  const onConfirm = () => {
    handleAcceptChanges();
    setIsConfirmOpen(false);
  }

  const handleRestoreClick = (item: (typeof historyData)[number]) => {
    setItemToRestore(item);
    setIsRestoreConfirmOpen(true);
  };

  const onRestoreConfirm = () => {
    if (itemToRestore) {
        toast({
            title: "Version Restored",
            description: `The document "${document.fileName}" has been restored to the version from ${itemToRestore.date}.`,
        });
    }
    setIsRestoreConfirmOpen(false);
    setItemToRestore(null);
  }


  return (
    <>
      <LargeSideDialog open={open} onOpenChange={onOpenChange}>
        <LargeSideDialogContent className="bg-gray-50 p-0">
          <LargeSideDialogHeader className="px-6 py-4 border-b bg-white">
            <LargeSideDialogTitle className="font-normal">Version History / {document.fileName}</LargeSideDialogTitle>
          </LargeSideDialogHeader>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto">
            {/* Previous Version */}
            <Card className="lg:col-span-4 flex flex-col h-full shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Previous Version</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <h3 className="text-lg font-semibold mb-2">Marketing Strategy 2025</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our marketing strategy for 2025 focuses on digital transformation and customer engagement.
                </p>
                <h4 className="font-semibold mb-2">Q1 Objectives</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                  <li>Increase social media engagement by 50%</li>
                  <li>Launch new product campaign</li>
                  <li>Expand email marketing reach</li>
                </ul>
              </CardContent>
            </Card>

            {/* Current Version */}
            <Card className="lg:col-span-4 flex flex-col h-full shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Current Version</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <h3 className="text-lg font-semibold mb-2">Marketing Strategy 2025</h3>
                <p className="text-sm text-gray-600 mb-4 space-y-2">
                  <span>Our marketing strategy for 2025 focuses on digital transformation and customer engagement.</span>
                  <span className="block bg-green-100 text-green-800 p-2 rounded">
                    We will leverage AI and data analytics to optimize our campaigns.
                  </span>
                </p>
                <h4 className="font-semibold mb-2">Q1 Objectives</h4>
                <ul className="list-disc list-inside text-sm space-y-2 text-gray-700">
                  <li className="bg-green-100 text-green-800 p-1 rounded">Increase social media engagement by 70%</li>
                  <li>Launch new product campaign</li>
                  <li>Expand email marketing reach</li>
                  <li className="bg-green-100 text-green-800 p-1 rounded">Implement AI-powered customer segmentation</li>
                </ul>
              </CardContent>
              <div className="p-6 pt-0">
                <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={() => setIsConfirmOpen(true)}>Accept Changes</Button>
              </div>
            </Card>

            {/* Current / Activity */}
            <Card className="lg:col-span-4 flex flex-col h-full shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Current</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow divide-y">
                {historyData.map((item, index) => (
                  <div key={index} className="py-4 first:pt-0">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.user.avatar} />
                        <AvatarFallback>{item.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{item.user.name}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{item.action}</p>
                    <Button variant="link" className="p-0 h-auto text-violet-600 text-sm font-normal" onClick={() => handleRestoreClick(item)}>Restore</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </LargeSideDialogContent>
      </LargeSideDialog>
      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Accept Changes"
        description="Are you sure you want to accept the changes? The current version will be updated."
        onConfirm={onConfirm}
        confirmText="Accept"
        variant="constructive"
      />
      <ConfirmationDialog
        open={isRestoreConfirmOpen}
        onOpenChange={setIsRestoreConfirmOpen}
        title="Restore Version"
        description="Are you sure you want to restore this version? This will overwrite the current version."
        onConfirm={onRestoreConfirm}
        confirmText="Restore"
        variant="destructive"
      />
    </>
  );
};

export default VersionHistoryDialog;
