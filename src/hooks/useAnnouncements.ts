import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'maintenance' | 'update' | 'urgent';
  is_active: boolean;
  created_at: string;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAnnouncements((data || []) as Announcement[]);
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch announcements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (announcementData: {
    title: string;
    message: string;
    type: 'info' | 'maintenance' | 'update' | 'urgent';
  }) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', userData.user.id)
        .single();

      if (!profile?.org_id) throw new Error('User profile not found');

      const { error } = await supabase.from('announcements').insert({
        ...announcementData,
        org_id: profile.org_id,
        created_by: userData.user.id,
      });

      if (error) throw error;
      
      await fetchAnnouncements();
      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      });
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    // Set up real-time subscription for announcements
    const channel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
        },
        () => {
          fetchAnnouncements(); // Refetch when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    announcements,
    loading,
    createAnnouncement,
    refetch: fetchAnnouncements,
  };
};