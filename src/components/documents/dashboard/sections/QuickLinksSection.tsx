import {
  FileTextIcon,
  FolderIcon,
  SettingsIcon,
  ShieldIcon,
  UploadIcon,
} from "lucide-react";
import { Card, CardContent } from "../../../ui/card";

export const QuickLinksSection = (): JSX.Element => {
  // Quick links data
  const quickLinks = [
    {
      icon: <UploadIcon className="h-3.5 w-3.5" />,
      text: "UploadIcon Document",
      bgColor: "bg-[#e7eefc]",
    },
    {
      icon: <FileTextIcon className="h-3.5 w-3.5" />,
      text: "Go to Document Repository",
      bgColor: "bg-[#e7fcf5]",
    },
    {
      icon: <FolderIcon className="h-3.5 w-3.5" />,
      text: "Access Templates & Library",
      bgColor: "bg-[#f2e7fc]",
    },
    {
      icon: <ShieldIcon className="h-3.5 w-3.5" />,
      text: "View Compliance Summary",
      bgColor: "bg-[#fdeee6]",
    },
    {
      icon: <SettingsIcon className="h-3.5 w-3.5" />,
      text: "Open Settings",
      bgColor: "bg-[#f2f2f2]",
    },
  ];

  return (
    <div>
      {/* Quick Links Card */}
      <Card className="w-[382px] shadow-[0px_4px_16px_#eae2fd] rounded-[10px]">
        <CardContent className="flex flex-col items-start gap-4 pl-6 pr-0 pt-[33px] pb-6">
          <h3 className="font-medium text-[#383839] text-lg font-['Inter',Helvetica]">
            Quick Links
          </h3>

          <div className="flex flex-col items-start gap-[18px]">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                className="flex items-center gap-2.5 hover:opacity-80 cursor-pointer"
              >
                <div
                  className={`flex w-8 h-8 items-center justify-center rounded-[42px] ${link.bgColor}`}
                >
                  {link.icon}
                </div>
                <span className="font-medium text-[#383839] text-sm font-['Inter',Helvetica]">
                  {link.text}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
