import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GrantDisbursement } from '@/types/grants';
import { useToast } from '@/hooks/use-toast';

export const useGrantDisbursements = (grantId?: string) => {
  const [disbursements, setDisbursements] = useState<GrantDisbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDisbursements = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('grant_disbursements')
        .select('*')
        .order('due_date', { ascending: true });

      if (grantId) {
        query = query.eq('grant_id', grantId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setDisbursements(data || []);
    } catch (err) {
      console.error('Error fetching disbursements:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch disbursement data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursements();
  }, [grantId]);

  const createDisbursement = async (disbursementData: Omit<GrantDisbursement, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('grant_disbursements')
        .insert({
          ...disbursementData,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setDisbursements(prev => [...prev, data]);
      toast({
        title: 'Success',
        description: 'Disbursement added successfully',
      });

      return data;
    } catch (err) {
      console.error('Error creating disbursement:', err);
      toast({
        title: 'Error',
        description: 'Failed to add disbursement',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateDisbursement = async (id: string, updates: Partial<GrantDisbursement>) => {
    try {
      const { data, error } = await supabase
        .from('grant_disbursements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDisbursements(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: 'Success',
        description: 'Disbursement updated successfully',
      });

      return data;
    } catch (err) {
      console.error('Error updating disbursement:', err);
      toast({
        title: 'Error',
        description: 'Failed to update disbursement',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteDisbursement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grant_disbursements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDisbursements(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Success',
        description: 'Disbursement deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting disbursement:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete disbursement',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    disbursements,
    loading,
    refetch: fetchDisbursements,
    createDisbursement,
    updateDisbursement,
    deleteDisbursement,
  };
};