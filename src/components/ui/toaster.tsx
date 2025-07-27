import React, { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

interface ToastWithProgressProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  [key: string]: any;
}

function ToastWithProgress({ id, title, description, action, ...props }: ToastWithProgressProps) {
  const { dismiss } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      dismiss(id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [id, dismiss]);

  return (
    <Toast {...props}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && (
            <ToastDescription>{description}</ToastDescription>
          )}
        </div>
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