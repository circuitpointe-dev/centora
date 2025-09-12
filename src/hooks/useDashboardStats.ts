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
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get total documents count
      const { count: totalDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      // Get signature requests overdue (for now, we'll use document signatures)
      const { count: signatureRequestsOverdue } = await supabase
        .from('document_signatures')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString());

      // Get documents expiring in 30 days (policy documents)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { count: documentsExpiringSoon } = await supabase
        .from('policy_documents')
        .select('*', { count: 'exact', head: true })
        .lte('expires_date', thirtyDaysFromNow.toISOString().split('T')[0])
        .gte('expires_date', new Date().toISOString().split('T')[0]);

      // Get unacknowledged policies count
      const { data: policies } = await supabase
        .from('policy_documents')
        .select('id')
        .eq('acknowledgment_required', true);
      
      let unacknowledgedPolicies = 0;
      if (policies) {
        for (const policy of policies) {
          const { count } = await supabase
            .from('policy_acknowledgments')
            .select('*', { count: 'exact', head: true })
            .eq('policy_document_id', policy.id)
            .eq('user_id', user.id);
          
          if (count === 0) {
            unacknowledgedPolicies++;
          }
        }
      }

      return {
        totalDocuments: totalDocuments || 0,
        signatureRequestsOverdue: signatureRequestsOverdue || 0,
        documentsExpiringSoon: documentsExpiringSoon || 0,
        unacknowledgedPolicies,
      } as DashboardStats;
    },
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useDocumentsByDepartment = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['documents-by-department'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          created_by,
          profiles!inner(department_id, departments!inner(name))
        `);

      if (error) throw error;

      // Count documents by department
      const departmentCounts: Record<string, number> = {};
      
      data?.forEach((doc: any) => {
        const departmentName = doc.profiles?.departments?.name || 'General';
        departmentCounts[departmentName] = (departmentCounts[departmentName] || 0) + 1;
      });

      return Object.entries(departmentCounts).map(([department, count]) => ({
        department,
        count,
      })) as DocumentsByDepartment[];
    },
    enabled: !!user,
  });
};

export const useDocumentsByType = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['documents-by-type'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('documents')
        .select('category');

      if (error) throw error;

      // Count documents by category
      const categoryCounts: Record<string, number> = {};
      const total = data?.length || 0;
      
      data?.forEach((doc) => {
        const category = doc.category || 'uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      return Object.entries(categoryCounts).map(([category, count]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      })) as DocumentsByType[];
    },
    enabled: !!user,
  });
};

export const useRecentActivity = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get recent documents
      const { data: recentDocs, error: docsError } = await supabase
        .from('documents')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          created_by,
          profiles!inner(full_name)
        `)
        .order('updated_at', { ascending: false })
        .limit(3);

      if (docsError) throw docsError;

      // Get recent policy acknowledgments
      const { data: recentAcks, error: acksError } = await supabase
        .from('policy_acknowledgments')
        .select(`
          id,
          acknowledged_at,
          policy_documents!inner(id),
          documents!inner(title)
        `)
        .order('acknowledged_at', { ascending: false })
        .limit(2);

      if (acksError) throw acksError;

      const activities: RecentActivity[] = [];

      // Add document activities
      recentDocs?.forEach((doc: any) => {
        activities.push({
          id: `doc-${doc.id}`,
          type: 'document_uploaded',
          title: doc.title,
          description: `Uploaded by ${doc.profiles?.full_name || 'Unknown'}`,
          created_at: doc.updated_at || doc.created_at,
          user_name: doc.profiles?.full_name,
        });
      });

      // Add acknowledgment activities
      recentAcks?.forEach((ack: any) => {
        activities.push({
          id: `ack-${ack.id}`,
          type: 'policy_acknowledged',
          title: ack.documents?.title || 'Policy Document',
          description: 'Policy acknowledged',
          created_at: ack.acknowledged_at,
        });
      });

      // Sort by created_at and limit to 5 most recent
      return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
    },
    enabled: !!user,
  });
};

export const useNotifications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const notifications: Notification[] = [];

      // Check for expiring documents
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { data: expiringPolicies } = await supabase
        .from('policy_documents')
        .select(`
          id,
          expires_date,
          documents!inner(title)
        `)
        .lte('expires_date', thirtyDaysFromNow.toISOString().split('T')[0])
        .gte('expires_date', new Date().toISOString().split('T')[0]);

      expiringPolicies?.forEach((policy: any) => {
        const daysUntilExpiry = Math.ceil(
          (new Date(policy.expires_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        notifications.push({
          id: `expiring-${policy.id}`,
          type: 'warning',
          title: 'Document Expiring Soon',
          description: `${policy.documents?.title} expires in ${daysUntilExpiry} days`,
          created_at: new Date().toISOString(),
        });
      });

      // Check for overdue signatures
      const { data: overdueSignatures } = await supabase
        .from('document_signatures')
        .select(`
          id,
          expires_at,
          document_id,
          documents!inner(title)
        `)
        .eq('status', 'pending')
        .lt('expires_at', new Date().toISOString());

      overdueSignatures?.forEach((signature: any) => {
        notifications.push({
          id: `overdue-${signature.id}`,
          type: 'error',
          title: 'Overdue Signature',
          description: `${signature.documents?.title} awaiting signature`,
          created_at: signature.expires_at,
        });
      });

      return notifications.slice(0, 3); // Limit to 3 most important notifications
    },
    enabled: !!user,
  });
};