import React, { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Progress } from "@/components/ui/progress"

interface ToastWithProgressProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  [key: string]: any;
}

function ToastWithProgress({ id, title, description, action, ...props }: ToastWithProgressProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const progressValue = (remaining / duration) * 100;
      
      setProgress(progressValue);
      
      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
  }, []);

  return (
    <Toast {...props}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && (
            <ToastDescription>{description}</ToastDescription>
          )}
        </div>
        <Progress value={progress} className="h-1" />
      </div>
      {action}
      <ToastClose />
    </Toast>
  );
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <ToastWithProgress
            key={id}
            id={id}
            title={title}
            description={description}
            action={action}
            {...props}
          />
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
