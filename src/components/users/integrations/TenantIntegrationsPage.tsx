import React, { useState } from "react";
import { integrationCategories } from './mock/integrationCategories';
import { integrationProviders } from './mock/integrationProviders';
import IntegrationCategoryCard from './IntegrationCategoryCard';
import IntegrationProviderCard from './IntegrationProviderCard';
import IntegrationDetailsDialog from './IntegrationDetailsDialog';
import { IntegrationProvider } from './mock/types';
import { useToast } from '@/hooks/use-toast';

export default function TenantIntegrationsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('document-storage');
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null);
  const [providerConnections, setProviderConnections] = useState<Record<string, boolean>>({
    'sharepoint': true // Default connected state from mock data
  });
  const { toast } = useToast();

  const selectedCategory = integrationCategories.find(cat => cat.id === selectedCategoryId);
  const categoryProviders = integrationProviders.filter(provider => 
    provider.categoryId === selectedCategoryId
  ).map(provider => ({
    ...provider,
    isConnected: providerConnections[provider.id] || provider.isConnected
  }));

  const handleConnect = (provider: IntegrationProvider) => {
    const isConnected = providerConnections[provider.id] || provider.isConnected;
    
    setProviderConnections(prev => ({
      ...prev,
      [provider.id]: !isConnected
    }));

    toast({
      title: isConnected ? "Integration disconnected" : "Integration connected",
      description: `${provider.name} has been ${isConnected ? 'disconnected from' : 'connected to'} your account.`,
    });

    setSelectedProvider(null);
  };

  const handleConfigure = (provider: IntegrationProvider) => {
    toast({
      title: "Configuration opened",
      description: `Configure ${provider.name} integration settings.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect Centora with your favorite third-party applications to streamline your workflow.
        </p>
      </div>

      {/* Integration Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrationCategories.map((category) => (
          <IntegrationCategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategoryId === category.id}
            onClick={() => setSelectedCategoryId(category.id)}
          />
        ))}
      </div>

      {/* Selected Category Providers */}
      {selectedCategory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{selectedCategory.name} Integrations</h2>
              <p className="text-sm text-muted-foreground">
                Available integrations for {selectedCategory.name.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {categoryProviders.map((provider) => (
              <IntegrationProviderCard
                key={provider.id}
                provider={provider}
                onConnect={() => setSelectedProvider(provider)}
                onConfigure={() => handleConfigure(provider)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Integration Details Dialog */}
      <IntegrationDetailsDialog
        provider={selectedProvider}
        isOpen={!!selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onConnect={() => selectedProvider && handleConnect(selectedProvider)}
      />
    </div>
  );
}
