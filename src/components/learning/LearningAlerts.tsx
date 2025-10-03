import React from 'react';
import { Calendar, Award } from 'lucide-react';

interface AlertItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor?: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ icon: Icon, title, description, iconColor = "text-gray-500" }) => {
  return (
    <div className="flex items-start space-x-3 py-4 border-b last:border-b-0 border-gray-100">
      <Icon size={20} className={`${iconColor} mt-0.5`} />
      <div className="min-w-0 flex-1">
        <div className="font-medium text-gray-900 text-sm">{title}</div>
        <div className="text-sm text-gray-500 mt-1">{description}</div>
      </div>
    </div>
  );
};

const LearningAlerts: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Alerts</h2>
      </div>
      <div className="p-6 pt-0">
        <AlertItem
          icon={Calendar}
          title="Upcoming training"
          description="Leadership workshop in Jul 2, 2025"
          iconColor="text-blue-500"
        />
        <AlertItem
          icon={Award}
          title="Your certification is about to expire soon!"
          description="Your safety training is due in 3 days."
          iconColor="text-red-500"
        />
        <AlertItem
          icon={Calendar}
          title="Upcoming training"
          description="Leadership workshop in Jul 2, 2025"
          iconColor="text-blue-500"
        />
      </div>
    </div>
  );
};

export default LearningAlerts;
