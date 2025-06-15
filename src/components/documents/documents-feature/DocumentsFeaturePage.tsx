
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Upload } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const DocumentsFeaturePage = () => {
  return (
    <div className="-mx-6 -my-2 flex h-full flex-col">
      <header className="flex h-[75px] w-full shrink-0 items-center justify-between border-b border-[#e6eff5] bg-white px-8 py-0">
        <h1 className="font-medium text-base text-[#383839]">All Documents</h1>

        <div className="flex items-center gap-[30px]">
          <TooltipProvider>
            <div className="flex w-[75px] items-center gap-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View in Grid</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <List className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View as list</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Button className="h-[43px] w-48 gap-1.5 rounded-[5px] bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {/* Page content will go here */}
      </main>
    </div>
  );
};

export default DocumentsFeaturePage;
