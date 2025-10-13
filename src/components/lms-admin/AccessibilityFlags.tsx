import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import AccessibilityFlagsModal from './AccessibilityFlagsModal';

interface AccessibilityFlag {
  id: string;
  name: string;
  status: 'Pending' | 'Resolved' | 'In Progress';
  type: 'Video' | 'Audio' | 'Document';
}

const AccessibilityFlags = () => {
  const [selectedFlag, setSelectedFlag] = useState<AccessibilityFlag | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for accessibility flags
  const accessibilityFlags: AccessibilityFlag[] = [
    { id: '1', name: 'basics', status: 'Pending', type: 'Video' },
    { id: '2', name: 'uct demo', status: 'Pending', type: 'Video' },
    { id: '3', name: 'ion skills', status: 'Pending', type: 'Video' },
    { id: '4', name: 'advanced concepts', status: 'Pending', type: 'Video' },
    { id: '5', name: 'case study', status: 'Pending', type: 'Video' },
  ];

  const handleViewFlag = (flag: AccessibilityFlag) => {
    setSelectedFlag(flag);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlag(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Accessibility flags</h1>
        <Button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
          <Download className="h-4 w-4" />
          <span>Export flag report</span>
        </Button>
      </div>

      {/* Accessibility Flags Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Accessibility Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessibilityFlags.map((flag) => (
                  <tr key={flag.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{flag.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{flag.type}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(flag.status)}`}>
                        {flag.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFlag(flag)}
                        className="flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <AccessibilityFlagsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        videoTitle={selectedFlag ? `${selectedFlag.name}.mp4` : undefined}
      />
    </div>
  );
};

export default AccessibilityFlags;