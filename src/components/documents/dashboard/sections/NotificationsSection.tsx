
import { CheckCircleIcon, ClockIcon, AlertTriangleIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NotificationsSection = (): JSX.Element => {
  // Notification data
  const notifications = [
    {
      title: "Document Expiring Soon",
      description: "Employee Handbook expires in 5 days",
      time: "2 Hours ago",
      icon: <AlertTriangleIcon className="w-4 h-4" />,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      type: "warning",
    },
    {
      title: "Overdue Signature",
      description: "Q4 Financial report awaiting signature",
      time: "3 Hours ago",
      icon: <ClockIcon className="w-4 h-4" />,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      type: "error",
    },
    {
      title: "Overdue Edit Request",
      description: "Policy document needs revision",
      time: "4 Hours ago",
      icon: <ClockIcon className="w-4 h-4" />,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      type: "error",
    },
    {
      title: "Policy Updated",
      description: "New security policy requires acknowledgment",
      time: "5 Hours ago",
      icon: <CheckCircleIcon className="w-4 h-4" />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      type: "success",
    },
    // ...feel free to add more notifications as necessary
  ];

  // Make height exactly match DocumentByDepartmentSection (around 412px including padding)
  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg h-[412px] min-h-[412px] flex flex-col">
      <CardHeader className="pb-4 pt-[33px] px-8">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col overflow-hidden px-8 pb-8">
        <ScrollArea className="h-full">
          <div className="space-y-4 pr-2"> {/* add pr-2 for scrollbar spacing */}
            {notifications.map((notification, index) => (
              <div
                key={`notification-${index}`}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div
                  className={`flex w-8 h-8 items-center justify-center rounded-lg ${notification.iconBg} flex-shrink-0`}
                >
                  <span className={notification.iconColor}>
                    {notification.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {notification.description}
                    </div>
                    <div className="text-xs text-gray-400">
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
