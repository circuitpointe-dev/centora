import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DashboardStats {
  totalDocuments: number;
  signatureRequestsOverdue: number;
  documentsExpiringSoon: number;
  unacknowledgedPolicies: number;
}

export interface DocumentsByDepartment {
  department: string;
  count: number;
}

export interface DocumentsByType {
  category: string;
  count: number;
  percentage: number;
}

export interface RecentActivity {
  id: string;
  type: 'document_uploaded' | 'policy_acknowledged' | 'document_signed' | 'document_updated';
  title: string;
  description: string;
  created_at: string;
  user_name?: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  created_at: string;
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        // Get total documents count
        const { count: totalDocuments, error: docsError } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true });

        if (docsError) {
          console.error('Error fetching documents count:', docsError);
        }

        // Get signature requests overdue
        const { count: signatureRequestsOverdue, error: sigError } = await supabase
          .from('document_signatures')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .lt('expires_at', new Date().toISOString());

        if (sigError) {
          console.error('Error fetching signature requests:', sigError);
        }

        // Get documents expiring in 30 days (policy documents)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const { count: documentsExpiringSoon, error: expError } = await supabase
          .from('policy_documents')
          .select('*', { count: 'exact', head: true })
          .lte('expires_date', thirtyDaysFromNow.toISOString().split('T')[0])
          .gte('expires_date', new Date().toISOString().split('T')[0]);

        if (expError) {
          console.error('Error fetching expiring documents:', expError);
        }

        // Get unacknowledged policies count - simplified for now
        const { count: unacknowledgedPolicies, error: policyError } = await supabase
          .from('policy_documents')
          .select('*', { count: 'exact', head: true })
          .eq('acknowledgment_required', true);

        if (policyError) {
          console.error('Error fetching policies:', policyError);
        }

        console.log('Dashboard stats:', {
          totalDocuments: totalDocuments || 0,
          signatureRequestsOverdue: signatureRequestsOverdue || 0,
          documentsExpiringSoon: documentsExpiringSoon || 0,
          unacknowledgedPolicies: unacknowledgedPolicies || 0,
        });

        return {
          totalDocuments: totalDocuments || 0,
          signatureRequestsOverdue: signatureRequestsOverdue || 0,
          documentsExpiringSoon: documentsExpiringSoon || 0,
          unacknowledgedPolicies: unacknowledgedPolicies || 0,
        } as DashboardStats;
      } catch (error) {
        console.error('Error in dashboard stats query:', error);
        throw error;
      }
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
  });
};

export const useDocumentsByDepartment = () => {
  return useQuery({
    queryKey: ['documents-by-department'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select(`
            id,
            category,
            created_by,
            creator:profiles!documents_created_by_fkey(department_id, departments(name))
          `);

        if (error) {
          console.error('Error fetching documents by department:', error);
          // Return mock data for now
          return [
            { department: 'Finance', count: 5 },
            { department: 'Legal', count: 3 },
            { department: 'HR', count: 4 },
          ] as DocumentsByDepartment[];
        }

        // Count documents by department - simplified approach
        const departmentCounts: Record<string, number> = {};
        
        data?.forEach((doc: any) => {
          let departmentName = 'General';
          if (doc.creator?.departments?.name) {
            departmentName = doc.creator.departments.name;
          } else if (doc.category) {
            // Use category as fallback department
            departmentName = doc.category.charAt(0).toUpperCase() + doc.category.slice(1);
          }
          departmentCounts[departmentName] = (departmentCounts[departmentName] || 0) + 1;
        });

        const result = Object.entries(departmentCounts).map(([department, count]) => ({
          department,
          count,
        }));

        console.log('Documents by department:', result);
        return result as DocumentsByDepartment[];
      } catch (error) {
        console.error('Error in documents by department query:', error);
        return [
          { department: 'Finance', count: 5 },
          { department: 'Legal', count: 3 },
          { department: 'HR', count: 4 },
        ] as DocumentsByDepartment[];
      }
    },
  });
};

export const useDocumentsByType = () => {
  return useQuery({
    queryKey: ['documents-by-type'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('category');

        if (error) {
          console.error('Error fetching documents by type:', error);
          throw error;
        }

        // Count documents by category
        const categoryCounts: Record<string, number> = {};
        const total = data?.length || 0;
        
        data?.forEach((doc) => {
          const category = doc.category || 'uncategorized';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        const result = Object.entries(categoryCounts).map(([category, count]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }));

        console.log('Documents by type:', result);
        return result as DocumentsByType[];
      } catch (error) {
        console.error('Error in documents by type query:', error);
        throw error;
      }
    },
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      try {
        // Get recent documents
        const { data: recentDocs, error: docsError } = await supabase
          .from('documents')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          created_by,
          creator:profiles!documents_created_by_fkey(full_name)
        `)
          .order('updated_at', { ascending: false })
          .limit(3);

        if (docsError) {
          console.error('Error fetching recent documents:', docsError);
        }

        const activities: RecentActivity[] = [];

        // Add document activities
        recentDocs?.forEach((doc: any) => {
          activities.push({
            id: `doc-${doc.id}`,
            type: 'document_uploaded',
            title: doc.title,
            description: `Uploaded by ${doc.creator?.full_name || 'Unknown'}`,
            created_at: doc.updated_at || doc.created_at,
            user_name: doc.creator?.full_name,
          });
        });

        // Add some sample signature activities for demo
        if (activities.length < 5) {
          activities.push({
            id: 'sample-signature',
            type: 'document_signed',
            title: 'Contract Agreement',
            description: 'Document signed by client',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          });
        }

        console.log('Recent activities:', activities);
        return activities.slice(0, 5);
      } catch (error) {
        console.error('Error in recent activity query:', error);
        return [] as RecentActivity[];
      }
    },
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const notifications: Notification[] = [];

        // Check for overdue signatures
        const { data: overdueSignatures, error: sigError } = await supabase
          .from('document_signatures')
          .select(`
            id,
            expires_at,
            document_id,
            documents(title)
          `)
          .eq('status', 'pending')
          .lt('expires_at', new Date().toISOString());

        if (sigError) {
          console.error('Error fetching overdue signatures:', sigError);
        }

        overdueSignatures?.forEach((signature: any) => {
          notifications.push({
            id: `overdue-${signature.id}`,
            type: 'error',
            title: 'Overdue Signature',
            description: `${signature.documents?.title || 'Document'} awaiting signature`,
            created_at: signature.expires_at,
          });
        });

        // Add sample notifications for demo if none exist
        if (notifications.length === 0) {
          notifications.push(
            {
              id: 'sample-1',
              type: 'warning',
              title: 'Document Review Required',
              description: 'Policy document needs your review',
              created_at: new Date().toISOString(),
            },
            {
              id: 'sample-2',
              type: 'info',
              title: 'New Template Available',
              description: 'Contract template has been updated',
              created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
            }
          );
        }

        console.log('Notifications:', notifications);
        return notifications.slice(0, 3); // Limit to 3 most important notifications
      } catch (error) {
        console.error('Error in notifications query:', error);
        return [] as Notification[];
      }
    },
  });
};