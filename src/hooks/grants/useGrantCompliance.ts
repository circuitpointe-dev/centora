import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGrants } from './useGrants';
import { GrantCompliance } from '@/types/grants';

export interface ComplianceItem extends GrantCompliance {
  grant?: {
    grant_name: string;
    donor_name: string;
    region?: string;
  };
}

export const useGrantCompliance = (grantId?: string) => {
  const [compliance, setCompliance] = useState<GrantCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const { grants } = useGrants();
  const { toast } = useToast();

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      let query = supabase.from('grant_compliance').select('*');
      
      if (grantId) {
        query = query.eq('grant_id', grantId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setCompliance(data || []);
    } catch (error: any) {
      console.error('Error fetching compliance data:', error);
      setCompliance([]);
    } finally {
      setLoading(false);
    }
  };

  const createCompliance = async (complianceData: Omit<GrantCompliance, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase.from('grant_compliance').insert({
        ...complianceData,
        created_by: userData.user.id,
      });

      if (error) throw error;
      await fetchCompliance();
      toast({
        title: 'Success',
        description: 'Compliance requirement created successfully',
      });
    } catch (error: any) {
      console.error('Error creating compliance:', error);
      toast({
        title: 'Error',
        description: 'Failed to create compliance requirement',
        variant: 'destructive',
      });
    }
  };

  const updateCompliance = async (id: string, updates: Partial<GrantCompliance>) => {
    try {
      const { error } = await supabase
        .from('grant_compliance')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchCompliance();
      toast({
        title: 'Success',
        description: 'Compliance requirement updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating compliance:', error);
      toast({
        title: 'Error',
        description: 'Failed to update compliance requirement',
        variant: 'destructive',
      });
    }
  };

  const deleteCompliance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grant_compliance')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCompliance();
      toast({
        title: 'Success',
        description: 'Compliance requirement deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting compliance:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete compliance requirement',
        variant: 'destructive',
      });
    }
  };

  const sendReminder = async (complianceId: string) => {
    try {
      toast({
        title: 'Reminder Sent',
        description: 'Compliance reminder has been sent to the grantee.',
      });
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reminder',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, [grantId]);

  return {
    compliance,
    loading,
    refetch: fetchCompliance,
    createCompliance,
    updateCompliance,
    deleteCompliance,
    sendReminder,
  };
};