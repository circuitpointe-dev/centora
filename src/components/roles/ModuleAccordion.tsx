// src/components/roles/ModuleAccordion.tsx

import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RoleMembersTable } from './RoleMembersTable';
import { roleMemberships } from './mock/roles-permission.data';
import type { ModuleWithFeatures } from '@/types/roles-permission';

interface ModuleAccordionProps {
  modules: ModuleWithFeatures[];
  selectedRoleId: string;
}

export const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
  modules,
  selectedRoleId
}) => {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  const toggleFeature = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId);
    } else {
      newExpanded.add(featureId);
    }
    setExpandedFeatures(newExpanded);
  };

  const getUsersForFeature = (featureId: string) => {
    return roleMemberships[featureId]?.[selectedRoleId] || [];
  };

  const getFeatureMemberCount = (featureId: string) => {
    const users = getUsersForFeature(featureId);
    return users.length;
  };

  return (
    <Accordion type="multiple" className="space-y-4">
      {modules.map((module) => (
        <AccordionItem
          key={module.id}
          value={module.id}
          className="border rounded-lg"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">{module.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {module.features.length} feature{module.features.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-3">
              {module.features.map((feature) => {
                const isExpanded = expandedFeatures.has(feature.id);
                const memberCount = getFeatureMemberCount(feature.id);
                
                return (
                  <div key={feature.id} className="border rounded-lg">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleFeature(feature.id)}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="font-medium text-gray-900">{feature.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {memberCount} member{memberCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t bg-gray-50/50">
                        <div className="pt-4">
                          <RoleMembersTable users={getUsersForFeature(feature.id)} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};