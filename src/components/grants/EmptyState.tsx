import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  icon = <FileText className="h-12 w-12 text-muted-foreground" />
}) => {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {icon}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
        {actionText && actionLink && (
          <Button asChild className="mt-4">
            <Link to={actionLink}>
              <Plus className="h-4 w-4 mr-2" />
              {actionText}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};