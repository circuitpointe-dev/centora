export interface IntegrationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  providerCount: number;
}

export interface IntegrationProvider {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  icon: string;
  company: string;
  isConnected: boolean;
  lastSync?: string;
  features: string[];
  connectionType: 'oauth' | 'api-key' | 'webhook';
}

export interface IntegrationConnection {
  providerId: string;
  isConnected: boolean;
  connectedAt?: string;
  lastSync?: string;
  config?: Record<string, any>;
}