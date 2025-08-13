import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Donor {
  id: string;
  org_id: string;
  name: string;
  affiliation?: string;
  organization_url?: string;
  funding_start_date?: string;
  funding_end_date?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'potential';
  total_donations: number;
  last_donation_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  contacts?: DonorContact[];
  focus_areas?: DonorFocusArea[];
  documents?: DonorDocument[];
}

export interface DonorContact {
  id: string;
  donor_id: string;
  full_name: string;
  email: string;
  phone: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface DonorFocusArea {
  id: string;
  donor_id: string;
  focus_area_id: string;
  created_at: string;
  focus_areas?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface DonorDocument {
  id: string;
  donor_id: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface CreateDonorData {
  name: string;
  affiliation?: string;
  organization_url?: string;
  funding_start_date?: string;
  funding_end_date?: string;
  notes?: string;
  contacts: Omit<DonorContact, 'id' | 'donor_id' | 'created_at' | 'updated_at'>[];
  focus_area_ids: string[];
  documents?: File[];
}

export const useDonors = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['donors', user?.org_id],
    queryFn: async () => {
      if (!user?.org_id) throw new Error('No organization');
      
      const { data, error } = await supabase
        .from('donors')
        .select(`
          *,
          contacts:donor_contacts(*),
          focus_areas:donor_focus_areas(
            *,
            focus_areas(id, name, color)
          ),
          documents:donor_documents(*)
        `)
        .eq('org_id', user.org_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Donor[];
    },
    enabled: !!user?.org_id,
  });
};

export const useCreateDonor = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (donorData: CreateDonorData) => {
      if (!user?.org_id || !user?.id) {
        throw new Error('User not authenticated or no organization');
      }

      try {
        // Step 1: Create donor with all related data atomically using database function
        const { data: donorId, error: createError } = await supabase.rpc(
          'create_donor_with_details',
          {
            _org_id: user.org_id,
            _created_by: user.id,
            _name: donorData.name,
            _affiliation: donorData.affiliation,
            _organization_url: donorData.organization_url,
            _funding_start_date: donorData.funding_start_date,
            _funding_end_date: donorData.funding_end_date,
            _notes: donorData.notes,
            _contacts: JSON.stringify(donorData.contacts),
            _focus_area_ids: donorData.focus_area_ids,
          }
        );

        if (createError) {
          throw new Error(`Failed to create donor: ${createError.message}`);
        }

        // Step 2: Upload documents if any (separate from atomic transaction)
        const uploadedDocuments = [];
        if (donorData.documents && donorData.documents.length > 0) {
          for (const file of donorData.documents) {
            try {
              const fileName = `${Date.now()}-${file.name}`;
              const filePath = `${user.org_id}/${donorId}/${fileName}`;

              // Upload file to storage
              const { error: uploadError } = await supabase.storage
                .from('donor-documents')
                .upload(filePath, file);

              if (uploadError) {
                throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
              }

              // Create document record
              const { error: docError } = await supabase
                .from('donor_documents')
                .insert({
                  donor_id: donorId,
                  file_name: file.name,
                  file_path: filePath,
                  file_size: file.size,
                  mime_type: file.type,
                  uploaded_by: user.id,
                });

              if (docError) {
                // If document record creation fails, try to clean up the uploaded file
                await supabase.storage
                  .from('donor-documents')
                  .remove([filePath]);
                throw new Error(`Failed to save document record for ${file.name}: ${docError.message}`);
              }

              uploadedDocuments.push({ fileName: file.name, filePath });
            } catch (fileError) {
              // Log individual file errors but don't fail the entire operation
              console.error(`Error uploading file ${file.name}:`, fileError);
              throw fileError; // Re-throw to be caught by outer try-catch
            }
          }
        }

        // Fetch the complete created donor data
        const { data: donor, error: fetchError } = await supabase
          .from('donors')
          .select(`
            *,
            contacts:donor_contacts(*),
            focus_areas:donor_focus_areas(
              *,
              focus_areas(id, name, color)
            ),
            documents:donor_documents(*)
          `)
          .eq('id', donorId)
          .single();

        if (fetchError) {
          throw new Error(`Failed to fetch created donor: ${fetchError.message}`);
        }

        return donor;
      } catch (error) {
        // Enhanced error handling with more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('already exists')) {
            throw new Error('A donor with this name already exists in your organization');
          } else if (error.message.includes('not a member')) {
            throw new Error('You are not authorized to create donors for this organization');
          } else if (error.message.includes('upload')) {
            throw new Error(`File upload failed: ${error.message}`);
          } else {
            throw new Error(`Failed to create donor: ${error.message}`);
          }
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
};

export const useUpdateDonor = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, donorData }: { id: string; donorData: Partial<CreateDonorData> }) => {
      if (!user?.org_id) {
        throw new Error('User not authenticated or no organization');
      }

      // Check if donor name already exists (excluding current donor)
      if (donorData.name) {
        const { data: existingDonor } = await supabase
          .from('donors')
          .select('id')
          .eq('org_id', user.org_id)
          .eq('name', donorData.name)
          .neq('id', id)
          .maybeSingle();

        if (existingDonor) {
          throw new Error('A donor with this name already exists');
        }
      }

      // Update donor
      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .update({
          name: donorData.name,
          affiliation: donorData.affiliation,
          organization_url: donorData.organization_url,
          funding_start_date: donorData.funding_start_date,
          funding_end_date: donorData.funding_end_date,
          notes: donorData.notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (donorError) throw donorError;

      // Update contacts if provided
      if (donorData.contacts) {
        // Delete existing contacts
        await supabase
          .from('donor_contacts')
          .delete()
          .eq('donor_id', id);

        // Insert new contacts
        if (donorData.contacts.length > 0) {
          const { error: contactsError } = await supabase
            .from('donor_contacts')
            .insert(
              donorData.contacts.map(contact => ({
                donor_id: id,
                ...contact,
              }))
            );

          if (contactsError) throw contactsError;
        }
      }

      // Update focus areas if provided
      if (donorData.focus_area_ids) {
        // Delete existing focus area relationships
        await supabase
          .from('donor_focus_areas')
          .delete()
          .eq('donor_id', id);

        // Insert new focus area relationships
        if (donorData.focus_area_ids.length > 0) {
          const { error: focusAreasError } = await supabase
            .from('donor_focus_areas')
            .insert(
              donorData.focus_area_ids.map(focusAreaId => ({
                donor_id: id,
                focus_area_id: focusAreaId,
              }))
            );

          if (focusAreasError) throw focusAreasError;
        }
      }

      return donor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
};

export const useDeleteDonor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (donorId: string) => {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', donorId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] });
    },
  });
};