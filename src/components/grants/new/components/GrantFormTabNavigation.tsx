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
    <TabsList className="grid w-full grid-cols-5 mb-6">
      {tabs.map((tab) => (
        <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};