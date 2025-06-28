
import React from 'react';
import { FileText, Upload, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ProgressIndicator } from './ProgressIndicator';

export const RequestSignatureWizard = () => {
  const progressSteps = [
    { id: 1, label: "Select Document", active: true },
    { id: 2, label: "Assign Recipient & Order", active: false },
    { id: 3, label: "Review & Send", active: false },
  ];

  return (
    <>
      {/* Progress Indicator */}
      <div className="flex justify-center mt-[110px]">
        <ProgressIndicator steps={progressSteps} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-[1042px] items-center gap-14 mx-8 mt-[124px]">
        {/* Document Selection Cards */}
        <div className="flex flex-col items-start gap-14 w-full">
          <div className="flex items-center gap-8 w-full">
            {/* Select Document Card */}
            <Card className="flex flex-col w-[505px] h-[312px] items-center justify-center gap-6 bg-white rounded-[5px] shadow-[0px_4px_16px_#eae2fd]">
              <CardContent className="flex flex-col items-center justify-center gap-6 pt-6 w-full h-full">
                <FileText className="w-10 h-10" />
                <div className="flex flex-col items-center gap-4 w-full">
                  <p className="text-[#383838b2] text-sm text-center">
                    Select a document from Document Folder
                  </p>
                  <Button className="bg-violet-600 text-white rounded-[5px] px-4 py-3 h-auto">
                    Select Document
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Document Card */}
            <Card className="flex flex-col w-[505px] h-[312px] items-center justify-center gap-6 bg-white rounded-[5px] shadow-[0px_4px_16px_#eae2fd]">
              <CardContent className="flex flex-col items-center justify-center gap-6 pt-6 w-full h-full">
                <Upload className="w-10 h-10" />
                <div className="flex flex-col items-center gap-6 w-full">
                  <div className="flex flex-col w-[218px] items-center gap-4">
                    <p className="text-[#383838b2] text-sm text-center">
                      Drag & Drop your document here
                    </p>
                    <p className="text-[#383838b2] text-sm text-center">or</p>
                  </div>

                  <div className="flex flex-col items-center gap-4 w-full">
                    <Button
                      variant="outline"
                      className="w-[147px] h-[43px] border-[#d9d9d9] text-[#38383899]"
                    >
                      Browse Files
                    </Button>
                    <p className="text-[#38383859] text-xs text-center">
                      Supported format: PDF (Max 25MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message to Recipients */}
          <div className="flex flex-col items-start gap-4 w-full">
            <label className="font-medium text-black text-sm">
              Message to Recipents
            </label>
            <Textarea
              className="h-[120px] bg-white rounded-[5px] shadow-[0px_4px_16px_#eae2fd] px-4 py-6"
              placeholder="Add a message for your recipients..."
            />
          </div>
        </div>

        {/* Proceed Button */}
        <Button className="bg-violet-600 text-white rounded-[5px] px-6 py-3 h-auto">
          Proceed to Recipients
          <ChevronRight className="w-6 h-6 ml-2" />
        </Button>
      </div>
    </>
  );
};
