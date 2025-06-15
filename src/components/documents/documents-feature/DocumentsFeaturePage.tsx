
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Upload } from 'lucide-react';

const DocumentsFeaturePage = () => {
  return (
    <header className="flex h-[75px] w-full items-center justify-between border-b border-[#e6eff5] bg-white px-8 py-0">
      <h1 className="font-medium text-lg text-[#383839]">All Documents</h1>

      <div className="flex items-center gap-[30px]">
        <div className="flex items-center gap-6 w-[75px]">
          <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
            <List className="h-5 w-5" />
          </Button>
        </div>

        <Button className="h-[43px] w-48 gap-1.5 rounded-[5px] bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700">
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </Button>
      </div>
    </header>
  );
};

export default DocumentsFeaturePage;
