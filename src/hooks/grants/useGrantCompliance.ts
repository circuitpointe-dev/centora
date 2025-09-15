import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GrantCompliance } from '@/types/grants';
import { useToast } from '@/hooks/use-toast';

export const useGrantCompliance = (grantId?: string) => {
  const [compliance, setCompliance] = useState<GrantCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompliance = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('grant_compliance')
        .select('*')
        .order('due_date', { ascending: true });

      if (grantId) {
        query = query.eq('grant_id', grantId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setCompliance(data || []);
    } catch (err) {
      console.error('Error fetching compliance:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch compliance data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, [grantId]);

  const createCompliance = async (complianceData: Omit<GrantCompliance, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('grant_compliance')
        .insert({
          ...complianceData,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCompliance(prev => [...prev, data]);
      toast({
        title: 'Success',
        description: 'Compliance requirement added successfully',
      });

      return data;
    } catch (err) {
      console.error('Error creating compliance:', err);
      toast({
        title: 'Error',
        description: 'Failed to add compliance requirement',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCompliance = async (id: string, updates: Partial<GrantCompliance>) => {
    try {
      const { data, error } = await supabase
        .from('grant_compliance')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCompliance(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: 'Success',
        description: 'Compliance requirement updated successfully',
      });

      return data;
    } catch (err) {
      console.error('Error updating compliance:', err);
      toast({
        title: 'Error',
        description: 'Failed to update compliance requirement',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteCompliance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grant_compliance')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCompliance(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Success',
        description: 'Compliance requirement deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting compliance:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete compliance requirement',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    compliance,
    loading,
    refetch: fetchCompliance,
    createCompliance,
    updateCompliance,
    deleteCompliance,
  };
};