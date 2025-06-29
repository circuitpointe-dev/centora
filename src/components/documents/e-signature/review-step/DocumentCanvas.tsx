
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DocumentCanvas = () => {
  return (
    <div className="col-span-6">
      <Card className="h-[500px] rounded-[5px] shadow-sm border">
        <CardContent className="p-4 h-full">
          <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Document Canvas
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-md">
                Your document will appear here. You can drag and drop signature fields, 
                text fields, and other elements onto the document.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
