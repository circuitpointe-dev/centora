import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IntegrationCategory, IntegrationProvider } from './mock/types';
import { icons, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationCategoryCardProps {
  category: IntegrationCategory;
  isSelected: boolean;
  onClick: () => void;
  providers: IntegrationProvider[];
}

export default function IntegrationCategoryCard({
  category,
  isSelected,
  onClick,
  providers
}: IntegrationCategoryCardProps) {
  const IconComponent = icons[category.icon as keyof typeof icons];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected 
          ? "ring-2 ring-brand-purple bg-brand-purple/5" 
          : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={cn(
            "rounded-lg p-3",
            isSelected ? "bg-brand-purple text-brand-purple-foreground" : "bg-muted"
          )}>
            {IconComponent && <IconComponent className="h-6 w-6" />}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">{category.name}</h3>
              <span className="text-sm text-muted-foreground">
                {category.providerCount} providers
              </span>
            </div>
            <div className="space-y-1">
              {providers.slice(0, 3).map((provider) => (
                <div key={provider.id} className="flex items-center space-x-2 text-sm">
                  {provider.isConnected ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <Circle className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={cn(
                    "text-xs",
                    provider.isConnected ? "text-green-600" : "text-muted-foreground"
                  )}>
                    {provider.name} - {provider.isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              ))}
              {providers.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{providers.length - 3} more providers
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}