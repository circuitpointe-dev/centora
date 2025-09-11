import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types for audit logs
export interface AuditLog {
  id: string;
  timestamp: string;
  actor_user_id: string;
  target_user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata: Record<string, any>;
  actor: {
    full_name: string;
    email: string;
  };
  target?: {
    full_name: string;
    email: string;
  };
}

export interface AuditLogFilters {
  actor_user_id?: string;
  resource_type?: string;
  action?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

// Mock audit log data for demonstration
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    actor_user_id: 'user1',
    target_user_id: 'user2',
    action: 'user_role_assigned',
    resource_type: 'user',
    resource_id: 'user2',
    metadata: { role: 'Admin', previous_role: 'Viewer' },
    actor: { full_name: 'John Admin', email: 'admin@example.com' },
    target: { full_name: 'Jane User', email: 'jane@example.com' },
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    actor_user_id: 'user1',
    action: 'module_enabled',
    resource_type: 'organization_module',
    resource_id: 'finance',
    metadata: { module: 'finance', enabled: true },
    actor: { full_name: 'John Admin', email: 'admin@example.com' },
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    actor_user_id: 'user1',
    target_user_id: 'user3',
    action: 'user_status_changed',
    resource_type: 'user',
    resource_id: 'user3',
    metadata: { status: 'suspended', reason: 'Policy violation', previous_status: 'active' },
    actor: { full_name: 'John Admin', email: 'admin@example.com' },
    target: { full_name: 'Bob User', email: 'bob@example.com' },
  },
];

// Hook to get audit logs with filtering and pagination
export const useAuditLogs = (filters: AuditLogFilters = {}) => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      // For now, return mock data
      // In real implementation, this would call a Supabase function or query audit_logs table
      
      let filteredLogs = [...mockAuditLogs];

      // Apply filters
      if (filters.actor_user_id) {
        filteredLogs = filteredLogs.filter(log => log.actor_user_id === filters.actor_user_id);
      }

      if (filters.resource_type) {
        filteredLogs = filteredLogs.filter(log => log.resource_type === filters.resource_type);
      }

      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action.includes(filters.action));
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.actor.full_name.toLowerCase().includes(searchTerm) ||
          log.actor.email.toLowerCase().includes(searchTerm) ||
          log.action.toLowerCase().includes(searchTerm) ||
          (log.target?.full_name?.toLowerCase().includes(searchTerm)) ||
          (log.target?.email?.toLowerCase().includes(searchTerm))
        );
      }

      if (filters.date_from) {
        const fromDate = new Date(filters.date_from);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate);
      }

      if (filters.date_to) {
        const toDate = new Date(filters.date_to);
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate);
      }

      // Sort by timestamp desc
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Apply pagination
      const page = filters.page || 1;
      const pageSize = filters.page_size || 20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      return {
        data: filteredLogs.slice(startIndex, endIndex),
        total: filteredLogs.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredLogs.length / pageSize),
      };
    },
  });
};

// Hook to create audit log entry
export const useCreateAuditLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      resource_type,
      resource_id,
      target_user_id,
      metadata = {},
    }: {
      action: string;
      resource_type: string;
      resource_id?: string;
      target_user_id?: string;
      metadata?: Record<string, any>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // In a real implementation, this would insert into an audit_logs table
      // For now, we'll just simulate the behavior
      const newLog: AuditLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString(),
        actor_user_id: user.id,
        target_user_id,
        action,
        resource_type,
        resource_id,
        metadata,
        actor: { full_name: 'Current User', email: user.email || '' },
      };

      // Add to mock data (in real app this would be persisted to DB)
      mockAuditLogs.unshift(newLog);

      return newLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};

// Hook to export audit logs to CSV
export const useExportAuditLogs = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (filters: AuditLogFilters = {}) => {
      // Get the filtered logs
      const { data: logsResponse } = await useAuditLogs({ ...filters, page_size: 10000 });
      const logs = logsResponse?.data || [];

      // Convert to CSV format
      const headers = [
        'Timestamp',
        'Actor',
        'Action', 
        'Resource Type',
        'Resource ID',
        'Target User',
        'Details'
      ];

      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          log.timestamp,
          `"${log.actor.full_name} (${log.actor.email})"`,
          log.action,
          log.resource_type,
          log.resource_id || '',
          log.target ? `"${log.target.full_name} (${log.target.email})"` : '',
          `"${JSON.stringify(log.metadata)}"`,
        ].join(','))
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, count: logs.length };
    },
    onSuccess: (result) => {
      toast({
        title: 'Export successful',
        description: `Exported ${result.count} audit log entries to CSV.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Export failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Utility function to log user actions
export const logUserAction = async (
  action: string,
  resourceType: string,
  resourceId?: string,
  targetUserId?: string,
  metadata: Record<string, any> = {}
) => {
  // This would typically be called automatically from mutation hooks
  // but can also be called manually for important actions
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // In real implementation, insert into audit_logs table
    console.log('Audit Log:', {
      timestamp: new Date().toISOString(),
      actor_user_id: user.id,
      target_user_id: targetUserId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
    });
  } catch (error) {
    console.error('Failed to log user action:', error);
  }
};