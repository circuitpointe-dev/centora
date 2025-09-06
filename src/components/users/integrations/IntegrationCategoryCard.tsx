import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IntegrationCategory } from './mock/types';
import { icons } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegrationCategoryCardProps {
  category: IntegrationCategory;
  isSelected: boolean;
  onClick: () => void;
}

export default function IntegrationCategoryCard({
  category,
  isSelected,
  onClick
}: IntegrationCategoryCardProps) {
  const IconComponent = icons[category.icon as keyof typeof icons];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected 
          ? "ring-2 ring-primary bg-primary/5" 
          : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={cn(
            "rounded-lg p-3",
            isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}