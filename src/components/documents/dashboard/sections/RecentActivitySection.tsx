
import { CheckSquareIcon, FileIcon, PenToolIcon, UploadIcon, Loader2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecentActivity } from "@/hooks/useDashboardStats";
import { formatDistanceToNow } from "date-fns";

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'document_uploaded':
      return <UploadIcon className="w-4 h-4" />;
    case 'document_updated':
      return <FileIcon className="w-4 h-4" />;
    case 'policy_acknowledged':
      return <CheckSquareIcon className="w-4 h-4" />;
    case 'document_signed':
      return <PenToolIcon className="w-4 h-4" />;
    default:
      return <FileIcon className="w-4 h-4" />;
  }
};

const getActivityStyle = (type: string) => {
  switch (type) {
    case 'document_uploaded':
      return { iconBg: "bg-blue-50", iconColor: "text-blue-600" };
    case 'document_updated':
      return { iconBg: "bg-yellow-50", iconColor: "text-yellow-600" };
    case 'policy_acknowledged':
      return { iconBg: "bg-green-50", iconColor: "text-green-600" };
    case 'document_signed':
      return { iconBg: "bg-purple-50", iconColor: "text-purple-600" };
    default:
      return { iconBg: "bg-gray-50", iconColor: "text-gray-600" };
  }
};

export const RecentActivitySection = (): JSX.Element => {
  const { data: activities, isLoading, error } = useRecentActivity();
  const navigate = useNavigate();

  const handleActivityClick = (activity: any) => {
    if (activity.type === 'document_uploaded' || activity.type === 'document_updated') {
      navigate('/dashboard/documents/documents');
    } else if (activity.type === 'policy_acknowledged') {
      navigate('/dashboard/documents/compliance');
    } else if (activity.type === 'document_signed') {
      navigate('/dashboard/documents/e-signature');
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-gray-200 shadow-sm rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Your Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !activities || activities.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Your Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8">
            <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No recent activity found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Your Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const style = getActivityStyle(activity.type);
            const icon = getActivityIcon(activity.type);
            
            return (
              <button
                key={index}
                onClick={() => handleActivityClick(activity)}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg ${style.iconBg} flex-shrink-0`}
                >
                  <span className={style.iconColor}>
                    {icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.description}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
