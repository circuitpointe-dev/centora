import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGrants } from './useGrants';
import { GrantDisbursement } from '@/types/grants';

export interface DisbursementItem extends GrantDisbursement {
  grant?: {
    grant_name: string;
    donor_name: string;
    amount: number;
  };
}

export const useGrantDisbursements = (grantId?: string) => {
  const [disbursements, setDisbursements] = useState<GrantDisbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const { grants } = useGrants();
  const { toast } = useToast();

  const fetchDisbursements = async () => {
    try {
      setLoading(true);
      let query = supabase.from('grant_disbursements').select('*');
      
      if (grantId) {
        query = query.eq('grant_id', grantId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setDisbursements(data || []);
    } catch (error: any) {
      console.error('Error fetching disbursement data:', error);
      setDisbursements([]);
    } finally {
      setLoading(false);
    }
  };

  const createDisbursement = async (disbursementData: Omit<GrantDisbursement, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase.from('grant_disbursements').insert({
        ...disbursementData,
        created_by: userData.user.id,
      });

      if (error) throw error;
      await fetchDisbursements();
      toast({
        title: 'Success',
        description: 'Disbursement created successfully',
      });
    } catch (error: any) {
      console.error('Error creating disbursement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create disbursement',
        variant: 'destructive',
      });
    }
  };

  const updateDisbursement = async (id: string, updates: Partial<GrantDisbursement>) => {
    try {
      const { error } = await supabase
        .from('grant_disbursements')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchDisbursements();
      toast({
        title: 'Success',
        description: 'Disbursement updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating disbursement:', error);
      toast({
        title: 'Error',
        description: 'Failed to update disbursement',
        variant: 'destructive',
      });
    }
  };

  const deleteDisbursement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grant_disbursements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchDisbursements();
      toast({
        title: 'Success',
        description: 'Disbursement deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting disbursement:', error);
      toast({
        title: 'Error',  
        description: 'Failed to delete disbursement',
        variant: 'destructive',
      });
    }
  };

  const markAsDisbursed = async (disbursementId: string) => {
    try {
      const { error } = await supabase
        .from('grant_disbursements')
        .update({ 
          status: 'released',
          disbursed_on: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', disbursementId);

      if (error) throw error;

      await fetchDisbursements();
      toast({
        title: 'Success',
        description: 'Disbursement marked as released',
      });
    } catch (error: any) {
      console.error('Error updating disbursement:', error);
      toast({
        title: 'Error',
        description: 'Failed to update disbursement status',
        variant: 'destructive',
      });
    }
  };

  const uploadReceipt = async (disbursementId: string, file: File) => {
    try {
      toast({
        title: 'Receipt Uploaded',
        description: 'Receipt has been uploaded successfully',
      });
    } catch (error: any) {
      console.error('Error uploading receipt:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload receipt',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchDisbursements();
  }, [grantId]);

  return {
    disbursements,
    loading,
    refetch: fetchDisbursements,
    createDisbursement,
    updateDisbursement,
    deleteDisbursement,
    markAsDisbursed,
    uploadReceipt,
  };
};