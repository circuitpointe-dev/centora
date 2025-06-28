
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  id: string;
  label: string;
}

interface GrantFormTabNavigationProps {
  tabs: Tab[];
}

export const GrantFormTabNavigation: React.FC<GrantFormTabNavigationProps> = ({ tabs }) => {
  return (
    <TabsList className="
      flex justify-between flex-nowrap w-full mb-8 p-1
      border-b border-gray-200 bg-transparent rounded-none
      overflow-x-hidden
      overflow-y-hidden
    ">
      {tabs.map(tab => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          className="
            flex-grow
            text-sm whitespace-nowrap pb-3 font-medium
            border-b-2 border-transparent
            data-[state=active]:border-purple-600
            data-[state=active]:text-purple-600
            data-[state=active]:font-semibold
          "
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
