// src/components/users/integrations/types.ts

export interface IntegrationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface IntegrationProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  categoryId: string;
  isConnected: boolean;
  setupUrl?: string;
  features: string[];
  company?: string;
  connectionType?: string;
  lastSync?: string;
}