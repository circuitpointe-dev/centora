import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IntegrationProvider } from './types';
import { icons, ExternalLink, Shield, Zap } from 'lucide-react';

interface IntegrationDetailsDialogProps {
  provider: IntegrationProvider | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export default function IntegrationDetailsDialog({
  provider,
  isOpen,
  onClose,
  onConnect
}: IntegrationDetailsDialogProps) {
  if (!provider) return null;

  const IconComponent = icons[provider.icon as keyof typeof icons];

  const getConnectionTypeInfo = (type: string) => {
    switch (type) {
      case 'oauth':
        return {
          icon: Shield,
          title: 'OAuth 2.0',
          description: 'Secure authentication through the provider\'s login system'
        };
      case 'api-key':
        return {
          icon: Zap,
          title: 'API Key',
          description: 'Connect using your API key from the provider'
        };
      case 'webhook':
        return {
          icon: ExternalLink,
          title: 'Webhook',
          description: 'Real-time data sync through webhooks'
        };
      default:
        return {
          icon: Shield,
          title: 'Standard',
          description: 'Standard connection method'
        };
    }
  };

  const connectionInfo = getConnectionTypeInfo(provider.connectionType);
  const ConnectionIcon = connectionInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="rounded-lg bg-muted p-2">
              {IconComponent && <IconComponent className="h-5 w-5" />}
            </div>
            <div>
              <DialogTitle className="text-lg">{provider.name}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                by {provider.company}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">About this integration</h4>
            <p className="text-sm text-muted-foreground">
              {provider.description}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Features</h4>
            <ul className="space-y-1">
              {provider.features.map((feature) => (
                <li key={feature} className="text-sm text-muted-foreground flex items-center">
                  <div className="w-1 h-1 bg-brand-purple rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Connection Method</h4>
            <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <ConnectionIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{connectionInfo.title}</p>
                <p className="text-xs text-muted-foreground">{connectionInfo.description}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onConnect} className="flex-1 bg-brand-purple hover:bg-brand-purple/90">
              {provider.isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}