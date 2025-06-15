import { CheckCircleIcon, ClockIcon } from "lucide-react";
import { Card, CardContent } from "../../../ui/card";

export const NotificationsSection = (): JSX.Element => {
  // Notification data
  const notifications = [
    {
      title: "Document Expiring Soon",
      description: "Employee Handbook expires in 5 days",
      time: "2 Hours ago",
      icon: "https://c.animaapp.com/TW9FeRSW/img/frame-1618876274.svg",
      type: "warning",
    },
    {
      title: "Overdue Signature",
      description: "Q4 Financial report awaiting signature",
      time: "3 Hours ago",
      icon: "clock",
      type: "error",
    },
    {
      title: "Overdue Edit Request",
      description: "Q4 Financial report awaiting signature",
      time: "3 Hours ago",
      icon: "clock",
      type: "error",
    },
    {
      title: "Policy Updated",
      description: "New security policy requires acknowledgment",
      time: "5 Hours ago",
      icon: "check",
      type: "success",
    },
  ];

  return (
    <div>
      {/* Nofitication Card */}
      <Card className="w-[382px] h-[448px] shadow-[0px_4px_16px_#eae2fd]">
        <CardContent className="p-6 pt-[33px] h-full">
          <h3 className="font-medium text-[#383839] text-lg mb-4">
            Notifications
          </h3>

          <div className="flex flex-col items-start gap-6">
            {notifications.map((notification, index) => (
              <div
                key={`notification-${index}`}
                className="flex items-start gap-2.5 w-full"
              >
                {notification.icon === "clock" ? (
                  <div className="flex w-8 h-8 items-center justify-center p-2.5 bg-[#fdecec] rounded-[42px]">
                    <ClockIcon className="w-3.5 h-3.5" />
                  </div>
                ) : notification.icon === "check" ? (
                  <div className="flex w-8 h-8 items-center justify-center p-2.5 bg-[#eaf9f0] rounded-[42px]">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <img
                    className="w-8 h-8"
                    alt="Notification icon"
                    src={notification.icon}
                  />
                )}

                <div className="flex flex-col w-[252px] gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-[#383839] text-base">
                      {notification.title}
                    </div>
                    <div className="font-normal text-[#383839a6] text-sm">
                      {notification.description}
                    </div>
                  </div>
                  <div className="font-normal text-[#38383980] text-xs">
                    {notification.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
