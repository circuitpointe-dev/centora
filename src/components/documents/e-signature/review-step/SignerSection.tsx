
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const SignerSection: React.FC = () => {
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="font-medium text-gray-800 text-sm leading-[21px]">
        Signer
      </div>
      <div className="flex items-center gap-2 p-2.5 w-full rounded-[5px] border border-gray-200 bg-gray-50">
        <Avatar className="w-[22px] h-[22px] bg-blue-100 rounded-full">
          <AvatarFallback className="font-medium text-blue-600 text-xs">
            CI
          </AvatarFallback>
        </Avatar>
        <span className="font-normal text-gray-700 text-sm">
          Chioma Ike
        </span>
      </div>
    </div>
  );
};
