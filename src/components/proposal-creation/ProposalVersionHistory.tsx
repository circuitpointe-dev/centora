
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, History } from "lucide-react";

interface Version {
  id: string;
  version: string;
  author: string;
  timestamp: string;
}

const versions: Version[] = [
  {
    id: "1",
    version: "V1.3",
    author: "Jane Doe",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    version: "V1.2", 
    author: "Jane Doe",
    timestamp: "2 hours ago"
  },
  {
    id: "3",
    version: "V1.1",
    author: "Jane Doe",
    timestamp: "2 hours ago"
  }
];

const ProposalVersionHistory: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Version History</h3>
      </div>

      <div className="space-y-3">
        {versions.map((version, index) => (
          <div key={version.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">{version.version}</p>
              <p className="text-xs text-gray-500">
                {version.author} • {version.timestamp}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalVersionHistory;
