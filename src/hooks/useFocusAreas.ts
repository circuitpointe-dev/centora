import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FocusAreaDB {
  id: string;
  org_id: string;
  created_by: string;
  name: string;
  description: string | null;
  color: string;
  funding_start_date: string;
  funding_end_date: string;
  interest_tags: string[];
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface FocusArea {
  id: string;
  name: string;
  description: string;
  color: string;
  fundingStartDate: string;
  fundingEndDate: string;
  interestTags: string[];
  amount: number;
  currency: string;
}

const transformFromDB = (dbData: FocusAreaDB): FocusArea => ({
  id: dbData.id,
  name: dbData.name,
  description: dbData.description || '',
  color: dbData.color,
  fundingStartDate: dbData.funding_start_date,
  fundingEndDate: dbData.funding_end_date,
  interestTags: dbData.interest_tags || [],
  amount: Number(dbData.amount),
  currency: dbData.currency,
});

const transformToDB = (data: Omit<FocusArea, 'id'>, orgId: string, createdBy: string) => ({
  org_id: orgId,
  created_by: createdBy,
  name: data.name,
  description: data.description,
  color: data.color,
  funding_start_date: data.fundingStartDate,
  funding_end_date: data.fundingEndDate,
  interest_tags: data.interestTags,
  amount: data.amount,
  currency: data.currency,
});

export const useFocusAreas = () => {
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFocusAreas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('focus_areas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFocusAreas(data?.map(transformFromDB) || []);
    } catch (err) {
      console.error('Error fetching focus areas:', err);
      setError('Failed to load focus areas');
      toast({
        title: "Error",
        description: "Failed to load focus areas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFocusArea = async (data: Omit<FocusArea, 'id'>) => {
    try {
      // Get the current session and user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('User must be authenticated to create focus areas');
      }

      // Get user's profile to find org_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Could not find user profile');
      }

      const orgId = profile.org_id;
      const createdBy = session.user.id;
      
      const { data: newFocusArea, error } = await supabase
        .from('focus_areas')
        .insert([transformToDB(data, orgId, createdBy)])
        .select()
        .single();

      if (error) throw error;

      const transformedData = transformFromDB(newFocusArea);
      setFocusAreas(prev => [transformedData, ...prev]);
      
      toast({
        title: "Focus Area Created",
        description: `${data.name} has been successfully created.`,
      });

      return transformedData;
    } catch (err) {
      console.error('Error creating focus area:', err);
      toast({
        title: "Error",
        description: "Failed to create focus area. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateFocusArea = async (id: string, data: Omit<FocusArea, 'id'>) => {
    try {
      const { data: updatedFocusArea, error } = await supabase
        .from('focus_areas')
        .update({
          name: data.name,
          description: data.description,
          color: data.color,
          funding_start_date: data.fundingStartDate,
          funding_end_date: data.fundingEndDate,
          interest_tags: data.interestTags,
          amount: data.amount,
          currency: data.currency,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const transformedData = transformFromDB(updatedFocusArea);
      setFocusAreas(prev => prev.map(area => area.id === id ? transformedData : area));
      
      toast({
        title: "Focus Area Updated",
        description: `${data.name} has been successfully updated.`,
      });

      return transformedData;
    } catch (err) {
      console.error('Error updating focus area:', err);
      toast({
        title: "Error",
        description: "Failed to update focus area. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteFocusArea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('focus_areas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFocusAreas(prev => prev.filter(area => area.id !== id));
      
      toast({
        title: "Focus Area Deleted",
        description: "The focus area has been successfully deleted.",
      });
    } catch (err) {
      console.error('Error deleting focus area:', err);
      toast({
        title: "Error",
        description: "Failed to delete focus area. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchFocusAreas();
  }, []);

  return {
    focusAreas,
    loading,
    error,
    createFocusArea,
    updateFocusArea,
    deleteFocusArea,
    refetch: fetchFocusAreas,
  };
};