
import {
  FileTextIcon,
  FolderIcon,
  SettingsIcon,
  ShieldIcon,
  UploadIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const QuickLinksSection = (): JSX.Element => {
  // Quick links data
  const quickLinks = [
    {
      icon: <UploadIcon className="h-4 w-4" />,
      text: "Upload Document",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: <FileTextIcon className="h-4 w-4" />,
      text: "Go to Document Repository",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: <FolderIcon className="h-4 w-4" />,
      text: "Access Templates & Library",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: <ShieldIcon className="h-4 w-4" />,
      text: "View Compliance Summary",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: <SettingsIcon className="h-4 w-4" />,
      text: "Open Settings",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
    },
  ];

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              className="flex items-center w-full gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div
                className={`flex w-8 h-8 items-center justify-center rounded-lg ${link.bgColor} group-hover:scale-105 transition-transform`}
              >
                <span className={link.iconColor}>
                  {link.icon}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {link.text}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
