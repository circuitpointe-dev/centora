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
          ? "ring-2 ring-brand-purple" 
          : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className={cn(
              "rounded-lg p-3",
              isSelected ? "bg-brand-purple text-brand-purple-foreground" : "bg-muted"
            )}>
              {IconComponent && <IconComponent className="h-6 w-6" />}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold tracking-tight">{category.name}</h3>
            </div>
          </div>
          
          <div className="border rounded-lg p-3 bg-muted/30 space-y-2">
            {providers.slice(0, 3).map((provider) => (
              <div key={provider.id} className="flex items-center justify-between text-sm">
                <span className="text-sm font-medium">{provider.name}</span>
                <div className="flex items-center space-x-1">
                  {provider.isConnected ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Disconnected</span>
                  )}
                </div>
              </div>
            ))}
            {providers.length > 3 && (
              <div className="text-xs text-muted-foreground text-center pt-1 border-t">
                +{providers.length - 3} more providers
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}