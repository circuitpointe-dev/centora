import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const EnhancedTooltip = ({ 
  children, 
  content, 
  side = 'right', 
  className 
}: EnhancedTooltipProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className={cn(
            "max-w-xs p-3 text-sm leading-relaxed bg-popover border border-border shadow-lg",
            "whitespace-pre-wrap break-words",
            className
          )}
        >
          <p className="text-sm text-popover-foreground">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};