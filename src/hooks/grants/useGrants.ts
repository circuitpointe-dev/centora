import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Grant, GrantFilters } from '@/types/grants';
import { useToast } from '@/hooks/use-toast';

export const useGrants = (filters?: GrantFilters) => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGrants = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('grants')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters if provided
      if (filters) {
        if (filters.grant_name) {
          query = query.ilike('grant_name', `%${filters.grant_name}%`);
        }
        if (filters.donor_name) {
          query = query.ilike('donor_name', `%${filters.donor_name}%`);
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status as Grant['status']);
        }
        if (filters.region && filters.region !== 'all') {
          query = query.eq('region', filters.region);
        }
        if (filters.program_area && filters.program_area !== 'all') {
          query = query.eq('program_area', filters.program_area);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      setGrants(data || []);
    } catch (err) {
      console.error('Error fetching grants:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch grants');
      toast({
        title: 'Error',
        description: 'Failed to fetch grants. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, [filters]);

  const createGrant = async (grantData: Omit<Grant, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'org_id'>) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, org_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      const { data, error } = await supabase
        .from('grants')
        .insert({
          ...grantData,
          created_by: profile.id,
          org_id: profile.org_id,
        })
        .select()
        .single();

      if (error) throw error;

      setGrants(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Grant created successfully',
      });

      return data;
    } catch (err) {
      console.error('Error creating grant:', err);
      toast({
        title: 'Error',
        description: 'Failed to create grant. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateGrant = async (id: string, updates: Partial<Grant>) => {
    try {
      const { data, error } = await supabase
        .from('grants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setGrants(prev => prev.map(grant => grant.id === id ? data : grant));
      toast({
        title: 'Success',
        description: 'Grant updated successfully',
      });

      return data;
    } catch (err) {
      console.error('Error updating grant:', err);
      toast({
        title: 'Error',
        description: 'Failed to update grant. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteGrant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGrants(prev => prev.filter(grant => grant.id !== id));
      toast({
        title: 'Success',
        description: 'Grant deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting grant:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete grant. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    grants,
    loading,
    error,
    refetch: fetchGrants,
    createGrant,
    updateGrant,
    deleteGrant,
  };
};