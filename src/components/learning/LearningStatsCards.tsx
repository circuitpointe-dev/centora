import React from 'react';
import { BookOpen, CheckCircle, Box, Award } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, iconColor, value, label }) => {
  const bgColorClass = iconColor.replace('text-', 'bg-');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full bg-opacity-10 ${bgColorClass}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
};

const LearningStatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={BookOpen}
        iconColor="text-yellow-500"
        value="10"
        label="Ongoing courses"
      />
      <StatCard
        icon={CheckCircle}
        iconColor="text-green-500"
        value="20"
        label="Completed courses"
      />
      <StatCard
        icon={Box}
        iconColor="text-purple-500"
        value="8"
        label="Modules completed"
      />
      <StatCard
        icon={Award}
        iconColor="text-blue-500"
        value="2"
        label="Certificate earned"
      />
    </div>
  );
};

export default LearningStatsCards;
