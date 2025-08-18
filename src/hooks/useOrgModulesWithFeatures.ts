// src/hooks/useOrgModulesWithFeatures.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Feature {
  id: string;
  name: string;
  permissions: string[];
}

export interface ModuleWithFeatures {
  module: string;
  module_name: string;
  features: Feature[];
}

export const useOrgModulesWithFeatures = () => {
  return useQuery({
    queryKey: ['org-modules-with-features'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_org_modules_with_features');
      if (error) {
        // Logs will help if the function exists but throws
        console.error('get_org_modules_with_features error:', error);
        throw new Error(error.message);
      }
      return (data || []).map((module: any) => ({
        module: module.module,
        module_name: module.module_name,
        features: module.features as Feature[],
      })) as ModuleWithFeatures[];
    },
  });
};