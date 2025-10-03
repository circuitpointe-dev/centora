import React from 'react';
import LearningStatsCards from '../learning/LearningStatsCards';
import LearningAlerts from '../learning/LearningAlerts';
import LearningQuickActions from '../learning/LearningQuickActions';
import UpcomingTrainings from '../learning/UpcomingTrainings';

const LearningDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <LearningStatsCards />

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningAlerts />
        <LearningQuickActions />
      </div>

      {/* Upcoming Trainings */}
      <UpcomingTrainings />
    </div>
  );
};

export default LearningDashboard;
