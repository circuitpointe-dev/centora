import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types for subscription and billing
export interface OrganizationModule {
  module: string;
  is_enabled: boolean;
  name: string;
  price: number;
}

export interface SubscriptionDetails {
  plan: string;
  renewal_date: string;
  modules_active: number;
  total_cost: number;
  price_per_module: number;
}

// Hook to get organization modules and their billing status
export const useOrgModules = () => {
  return useQuery({
    queryKey: ['org-modules'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) {
        throw new Error('User organization not found');
      }

      // Get organization modules
      const { data: orgModules, error: orgModulesError } = await supabase
        .from('organization_modules')
        .select('module')
        .eq('org_id', profile.org_id);

      if (orgModulesError) {
        throw new Error(`Failed to fetch organization modules: ${orgModulesError.message}`);
      }

      // Module pricing (mock data)
      const modulePricing: Record<string, number> = {
        'finance': 49,
        'grants': 49, 
        'programme': 49,
        'inventory': 49,
        'hr': 49,
        'documents': 49,
      };

      const allModules = Object.keys(modulePricing);
      const enabledModules = new Set(orgModules?.map(m => String(m.module)) || []);

      return allModules.map(module => ({
        module,
        is_enabled: enabledModules.has(module),
        name: module.charAt(0).toUpperCase() + module.slice(1) + ' Management',
        price: modulePricing[module] || 49,
      }));
    },
  });
};

// Hook to get subscription details
export const useSubscriptionDetails = () => {
  return useQuery({
    queryKey: ['subscription-details'], 
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) {
        throw new Error('User organization not found');
      }

      // Get active modules count
      const { data: orgModules, error } = await supabase
        .from('organization_modules')
        .select('module', { count: 'exact' })
        .eq('org_id', profile.org_id);

      if (error) {
        throw new Error(`Failed to fetch subscription details: ${error.message}`);
      }

      const moduleCount = orgModules?.length || 0;
      const pricePerModule = 49;
      
      return {
        plan: 'Tier 1 - Small Teams',
        renewal_date: '10/10/2025',
        modules_active: moduleCount,
        total_cost: moduleCount * pricePerModule,
        price_per_module: pricePerModule,
      };
    },
  });
};

// Hook to toggle module subscription
export const useToggleModule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      module, 
      enabled 
    }: { 
      module: string; 
      enabled: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's organization
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single();

      if (!profile?.org_id) {
        throw new Error('User organization not found');
      }

      if (enabled) {
        // Add module - use type assertion to handle enum
        const moduleEnum = module as 'fundraising' | 'grants' | 'documents' | 'programme' | 'procurement' | 'inventory' | 'finance' | 'learning' | 'hr' | 'users';
        const { error } = await supabase
          .from('organization_modules')
          .insert({ 
            org_id: profile.org_id, 
            module: moduleEnum 
          });

        if (error) {
          throw new Error(`Failed to enable module: ${error.message}`);
        }
      } else {
        // Remove module - use type assertion for delete as well  
        const moduleEnum = module as 'fundraising' | 'grants' | 'documents' | 'programme' | 'procurement' | 'inventory' | 'finance' | 'learning' | 'hr' | 'users';
        const { error } = await supabase
          .from('organization_modules')
          .delete()
          .eq('org_id', profile.org_id)
          .eq('module', moduleEnum);

        if (error) {
          throw new Error(`Failed to disable module: ${error.message}`);
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['org-modules'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-details'] });
      toast({
        title: `Module ${variables.enabled ? 'enabled' : 'disabled'}`,
        description: `${variables.module} module has been ${variables.enabled ? 'enabled' : 'disabled'}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating module',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Hook to change subscription plan (mock implementation)
export const useChangePlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (planId: string) => {
      // Mock API call - in real implementation would call billing service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Could update organization record with new plan info
      return { success: true, planId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-details'] });
      toast({
        title: 'Plan updated',
        description: 'Your subscription plan has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating plan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};