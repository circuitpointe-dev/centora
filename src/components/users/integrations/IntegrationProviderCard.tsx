import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IntegrationProvider } from './mock/types';
import { icons, CheckCircle, Circle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationProviderCardProps {
  provider: IntegrationProvider;
  onConnect: () => void;
  onConfigure: () => void;
}

export default function IntegrationProviderCard({
  provider,
  onConnect,
  onConfigure
}: IntegrationProviderCardProps) {
  const IconComponent = icons[provider.icon as keyof typeof icons];

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `Last sync: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="rounded-lg bg-muted p-3">
              {IconComponent && <IconComponent className="h-6 w-6" />}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-base">{provider.name}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {provider.company}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {provider.description}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  {provider.isConnected ? (
                    <CheckCircle className="h-3 w-3 text-brand-purple" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  <span>{provider.isConnected ? 'Connected' : 'Not connected'}</span>
                </div>
                
                {provider.lastSync && (
                  <span>{formatLastSync(provider.lastSync)}</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {provider.features.slice(0, 3).map((feature) => (
                  <span 
                    key={feature}
                    className="text-xs bg-brand-purple/10 text-brand-purple px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {provider.isConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={onConfigure}
                className="h-8"
              >
                <Settings className="h-3 w-3 mr-1" />
                Configure
              </Button>
            )}
            
            <Button
              variant={provider.isConnected ? "outline" : "brand-purple"}
              size="sm"
              onClick={onConnect}
              className="h-8"
            >
              {provider.isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}