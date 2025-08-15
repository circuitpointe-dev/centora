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
  currency: string;
  total_donations: number;
  last_donation_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  contacts?: DonorContact[];
  focus_areas?: DonorFocusArea[];
  documents?: DonorDocument[];
  lastDonationInfo?: {
    amount: number;
    currency: string;
    donation_date: string;
  };
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

export interface FundingPeriod {
  name?: string;
  start_date: string;
  end_date: string;
}

export interface CreateDonorData {
  name: string;
  status: 'potential' | 'active';
  currency?: string;
  affiliation?: string;
  organization_url?: string;
  funding_periods: FundingPeriod[];
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

      // Get last donation info for each donor
      const donorsWithLastDonation = await Promise.all(
        (data || []).map(async (donor) => {
          const { data: lastDonation } = await supabase.rpc('get_last_donation_info', {
            donor_uuid: donor.id
          });

          return {
            ...donor,
            lastDonationInfo: lastDonation?.[0] || null
          };
        })
      );

      return donorsWithLastDonation as Donor[];
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

      let donorId: string | null = null;
      const uploadedFilePaths: string[] = [];

      try {
        // Step 1: Create donor with all related data atomically using database function
        const { data: createdDonorId, error: createError } = await supabase.rpc(
          'create_donor_with_details',
          {
            _org_id: user.org_id,
            _created_by: user.id,
            _name: donorData.name,
            _status: donorData.status,
            _affiliation: donorData.affiliation,
            _organization_url: donorData.organization_url,
            _funding_periods: JSON.stringify(donorData.funding_periods),
            _notes: donorData.notes,
            _contacts: JSON.stringify(donorData.contacts),
            _focus_area_ids: donorData.focus_area_ids,
            _currency: donorData.currency || 'USD',
          }
        );

        if (createError) {
          throw new Error(`Failed to create donor: ${createError.message}`);
        }

        donorId = createdDonorId;

        // Step 2: Upload documents if any with parallel uploads and atomic transaction
        if (donorData.documents && donorData.documents.length > 0) {
          const documentInserts: Array<{
            donor_id: string;
            file_name: string;
            file_path: string;
            file_size: number;
            mime_type: string;
            uploaded_by: string;
          }> = [];

          // Upload all files in parallel
          const uploadPromises = donorData.documents.map(async (file) => {
            const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
            const filePath = `${user.org_id}/${donorId}/${fileName}`;

            // Upload file to storage
            const { error: uploadError } = await supabase.storage
              .from('donor-documents')
              .upload(filePath, file);

            if (uploadError) {
              throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
            }

            uploadedFilePaths.push(filePath);

            return {
              donor_id: donorId!,
              file_name: file.name,
              file_path: filePath,
              file_size: file.size,
              mime_type: file.type || 'application/octet-stream',
              uploaded_by: user.id,
            };
          });

          // Wait for all uploads to complete
          const uploadResults = await Promise.all(uploadPromises);
          documentInserts.push(...uploadResults);

          // Insert all document records atomically
          const { error: docError } = await supabase
            .from('donor_documents')
            .insert(documentInserts);

          if (docError) {
            // If document record creation fails, clean up all uploaded files
            await Promise.all(
              uploadedFilePaths.map(filePath =>
                supabase.storage
                  .from('donor-documents')
                  .remove([filePath])
                  .catch(console.error) // Don't fail cleanup if file removal fails
              )
            );
            throw new Error(`Failed to save document records: ${docError.message}`);
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
        // If anything fails and we've created a donor, rollback everything
        if (donorId) {
          try {
            // Clean up uploaded files
            if (uploadedFilePaths.length > 0) {
              await Promise.all(
                uploadedFilePaths.map(filePath =>
                  supabase.storage
                    .from('donor-documents')
                    .remove([filePath])
                    .catch(console.error)
                )
              );
            }

            // Delete donor and all related records (cascades via foreign keys)
            await supabase
              .from('donors')
              .delete()
              .eq('id', donorId);
          } catch (rollbackError) {
            console.error('Failed to rollback donor creation:', rollbackError);
            // Even if rollback fails, we still want to throw the original error
          }
        }

        // Enhanced error handling with more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('already exists')) {
            throw new Error('A donor with this name already exists in your organization');
          } else if (error.message.includes('not a member')) {
            throw new Error('You are not authorized to create donors for this organization');
          } else if (error.message.includes('upload')) {
            throw new Error(`File upload failed: ${error.message}`);
          } else if (error.message.includes('row-level security')) {
            throw new Error('Permission denied. Please check your access rights.');
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
          status: donorData.status,
          currency: donorData.currency,
          affiliation: donorData.affiliation,
          organization_url: donorData.organization_url,
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
      // Get the donor and organization info for storage path
      const { data: donor, error: donorError } = await supabase
        .from('donors')
        .select('org_id')
        .eq('id', donorId)
        .single();

      if (donorError) throw donorError;

      // Delete all files from storage first
      const { data: documents, error: documentsError } = await supabase
        .from('donor_documents')
        .select('file_path')
        .eq('donor_id', donorId);

      if (documentsError) throw documentsError;

      // Delete files from storage bucket
      if (documents && documents.length > 0) {
        const filePaths = documents.map(doc => doc.file_path);
        const { error: storageError } = await supabase.storage
          .from('donor-documents')
          .remove(filePaths);

        if (storageError) {
          console.error('Error deleting files from storage:', storageError);
          // Continue with deletion even if storage deletion fails
        }
      }

      // Delete all related data in the correct order (child tables first)
      // Delete donor documents records
      const { error: documentsDeleteError } = await supabase
        .from('donor_documents')
        .delete()
        .eq('donor_id', donorId);

      if (documentsDeleteError) throw documentsDeleteError;

      // Delete donor notes
      const { error: notesError } = await supabase
        .from('donor_notes')
        .delete()
        .eq('donor_id', donorId);

      if (notesError) throw notesError;

      // Delete donor engagements
      const { error: engagementsError } = await supabase
        .from('donor_engagements')
        .delete()
        .eq('donor_id', donorId);

      if (engagementsError) throw engagementsError;

      // Delete donor giving records
      const { error: givingError } = await supabase
        .from('donor_giving_records')
        .delete()
        .eq('donor_id', donorId);

      if (givingError) throw givingError;

      // Delete donor funding cycles
      const { error: fundingCyclesError } = await supabase
        .from('donor_funding_cycles')
        .delete()
        .eq('donor_id', donorId);

      if (fundingCyclesError) throw fundingCyclesError;

      // Delete donor contacts
      const { error: contactsError } = await supabase
        .from('donor_contacts')
        .delete()
        .eq('donor_id', donorId);

      if (contactsError) throw contactsError;

      // Delete donor focus areas
      const { error: focusAreasError } = await supabase
        .from('donor_focus_areas')
        .delete()
        .eq('donor_id', donorId);

      if (focusAreasError) throw focusAreasError;

      // Finally, delete the donor
      const { error: donorDeleteError } = await supabase
        .from('donors')
        .delete()
        .eq('id', donorId);

      if (donorDeleteError) throw donorDeleteError;
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['donors'] });
      queryClient.invalidateQueries({ queryKey: ['donor-notes'] });
      queryClient.invalidateQueries({ queryKey: ['donor-engagements'] });
      queryClient.invalidateQueries({ queryKey: ['donor-giving-records'] });
      queryClient.invalidateQueries({ queryKey: ['donor-funding-cycles'] });
      queryClient.invalidateQueries({ queryKey: ['donor-documents'] });
    },
  });
};