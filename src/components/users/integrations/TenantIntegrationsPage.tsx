import React, { useState } from "react";
import IntegrationCategoryCard from './IntegrationCategoryCard';
import IntegrationProviderCard from './IntegrationProviderCard';
import IntegrationDetailsDialog from './IntegrationDetailsDialog';
import { useToast } from '@/hooks/use-toast';

export default function TenantIntegrationsPage() {
  const { toast } = useToast();
  
  // Empty arrays for now - would be populated from backend
  const integrationCategories: any[] = [];
  const integrationProviders: any[] = [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect Centora with your favorite third-party applications to streamline your workflow.
        </p>
      </div>

      <div className="py-8 text-center text-gray-500">
        <p>No integrations available. This feature allows connecting third-party services to your organization.</p>
      </div>
    </div>
  );
}
