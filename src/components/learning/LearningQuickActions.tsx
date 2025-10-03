import React, { useState } from 'react';
import { BookOpen, LayoutGrid, Award, FilePlus, ChevronRight } from 'lucide-react';
import BuildTrainingPlanModal from './BuildTrainingPlanModal';

interface QuickActionItemProps {
  icon: React.ElementType;
  label: string;
  actionIcon?: React.ElementType;
  onClick?: () => void;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ icon: Icon, label, actionIcon: ActionIcon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} className="text-gray-500" />
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      {ActionIcon && <ActionIcon size={16} className="text-gray-400" />}
    </button>
  );
};

const LearningQuickActions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Quick action</h2>
      </div>
      <div className="p-6 space-y-1">
        <QuickActionItem
          icon={BookOpen}
          label="Resume last course"
          actionIcon={ChevronRight}
          onClick={() => console.log('Resume last course')}
        />
        <QuickActionItem
          icon={LayoutGrid}
          label="Browse course catalog"
          actionIcon={ChevronRight}
          onClick={() => console.log('Browse course catalog')}
        />
        <QuickActionItem
          icon={Award}
          label="View my certificates"
          actionIcon={ChevronRight}
          onClick={() => console.log('View my certificates')}
        />
        <QuickActionItem
          icon={FilePlus}
          label="Add training plan"
          actionIcon={FilePlus}
          onClick={() => setIsModalOpen(true)}
        />
      </div>
    </div>

    <BuildTrainingPlanModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  );
};

export default LearningQuickActions;
