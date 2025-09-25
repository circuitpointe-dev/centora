import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AuditLog } from '@/components/users/super-admin/types';

// Hook to get audit logs from backend
export const useSuperAdminAuditLogs = () => {
  return useQuery({
    queryKey: ['super-admin-audit-logs'],
    queryFn: async (): Promise<AuditLog[]> => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return (data || []).map((log: any) => ({
        id: log.id,
        at: log.created_at,
        action: log.action,
        actorId: log.actor_id,
        actorName: log.actor_name,
        actorEmail: log.actor_email,
        targetUserId: log.target_user_id,
        targetUserName: log.target_user_name,
        targetUserEmail: log.target_user_email,
        ip: log.ip_address,
        metadata: log.metadata,
      }));
    },
  });
};

// Hook to create audit log entry
export const useCreateAuditLog = () => {
  return async (logData: {
    action: string;
    target_user_id?: string;
    target_user_name?: string;
    target_user_email?: string;
    metadata?: any;
  }) => {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        action: logData.action,
        target_user_id: logData.target_user_id,
        target_user_name: logData.target_user_name,
        target_user_email: logData.target_user_email,
        metadata: logData.metadata || {},
      });

    if (error) throw error;
  };
};