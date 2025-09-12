
import { CheckCircleIcon, ClockIcon, AlertTriangleIcon, Loader2, BellIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useDashboardStats";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return <AlertTriangleIcon className="w-4 h-4" />;
    case 'error':
      return <ClockIcon className="w-4 h-4" />;
    case 'info':
      return <CheckCircleIcon className="w-4 h-4" />;
    default:
      return <BellIcon className="w-4 h-4" />;
  }
};

const getNotificationStyle = (type: string) => {
  switch (type) {
    case 'warning':
      return { iconBg: "bg-yellow-50", iconColor: "text-yellow-600" };
    case 'error':
      return { iconBg: "bg-red-50", iconColor: "text-red-600" };
    case 'info':
      return { iconBg: "bg-blue-50", iconColor: "text-blue-600" };
    default:
      return { iconBg: "bg-gray-50", iconColor: "text-gray-600" };
  }
};

export const NotificationsSection = (): JSX.Element => {
  const { data: notifications, isLoading, error } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    if (notification.title.includes('Expiring') || notification.title.includes('Policy')) {
      navigate('/dashboard/documents/compliance');
    } else if (notification.title.includes('Signature')) {
      navigate('/dashboard/documents/e-signature');
    } else {
      navigate('/dashboard/documents/documents');
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm rounded-lg h-[412px] min-h-[412px] flex flex-col">
        <CardHeader className="pb-4 pt-[33px] px-8">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col overflow-hidden px-8 pb-8">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !notifications || notifications.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm rounded-lg h-[412px] min-h-[412px] flex flex-col">
        <CardHeader className="pb-4 pt-[33px] px-8">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col overflow-hidden px-8 pb-8">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BellIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No notifications</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg h-[412px] min-h-[412px] flex flex-col">
      <CardHeader className="pb-4 pt-[33px] px-8">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col overflow-hidden px-8 pb-8">
        <ScrollArea className="h-full">
          <div className="space-y-4 pr-2">
            {notifications.map((notification, index) => {
              const style = getNotificationStyle(notification.type);
              const icon = getNotificationIcon(notification.type);
              
              return (
                <button
                  key={`notification-${index}`}
                  onClick={() => handleNotificationClick(notification)}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                >
                  <div
                    className={`flex w-8 h-8 items-center justify-center rounded-lg ${style.iconBg} flex-shrink-0`}
                  >
                    <span className={style.iconColor}>
                      {icon}
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
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
