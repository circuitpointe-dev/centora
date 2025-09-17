import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Grant } from '@/types/grants';
import { useToast } from '@/hooks/use-toast';

export const useGrants = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGrants = async () => {
    try {
      setLoading(true);

      // Get current user and their organization
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.org_id) throw new Error('User organization not found');

      const { data, error } = await supabase
        .from('grants')
        .select('*')
        .eq('org_id', profile.org_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGrants(data || []);
    } catch (err) {
      console.error('Error fetching grants:', err);
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
  }, []);

  const createGrant = async (grantData: Omit<Grant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.org_id) throw new Error('User organization not found');

      const { data, error } = await supabase
        .from('grants')
        .insert({
          ...grantData,
          org_id: profile.org_id,
          created_by: user.user.id,
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
        description: 'Failed to create grant',
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

      setGrants(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: 'Success',
        description: 'Grant updated successfully',
      });

      return data;
    } catch (err) {
      console.error('Error updating grant:', err);
      toast({
        title: 'Error',
        description: 'Failed to update grant',
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

      setGrants(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Success',
        description: 'Grant deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting grant:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete grant',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    grants,
    loading,
    refetch: fetchGrants,
    createGrant,
    updateGrant,
    deleteGrant,
  };
};