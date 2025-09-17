import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GrantDisbursement } from '@/types/grants';
import { toast } from 'sonner';

export const useGrantDisbursements = (grantId?: string) => {
  const [disbursements, setDisbursements] = useState<GrantDisbursement[]>([]);
  const [loading, setLoading] = useState(true);

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
      toast.error('Failed to fetch disbursement data');
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
      toast.success('Disbursement added successfully');

      return data;
    } catch (err) {
      console.error('Error creating disbursement:', err);
      toast.error('Failed to add disbursement');
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
      toast.success('Disbursement updated successfully');

      return data;
    } catch (err) {
      console.error('Error updating disbursement:', err);
      toast.error('Failed to update disbursement');
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
      toast.success('Disbursement deleted successfully');
    } catch (err) {
      console.error('Error deleting disbursement:', err);
      toast.error('Failed to delete disbursement');
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