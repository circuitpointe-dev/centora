
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const LargeSideDialog = DialogPrimitive.Root

const LargeSideDialogTrigger = DialogPrimitive.Trigger

const LargeSideDialogPortal = DialogPrimitive.Portal

const LargeSideDialogClose = DialogPrimitive.Close

const LargeSideDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
LargeSideDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const LargeSideDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <LargeSideDialogPortal>
    <LargeSideDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed right-0 top-0 z-50 h-full bg-background shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right border-l flex flex-col overflow-hidden",
        "w-full max-w-[95vw] lg:max-w-[85vw] xl:max-w-[80vw] 2xl:max-w-[75vw]",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
      <div className="flex-1 flex flex-col overflow-hidden pt-12">
        {children}
      </div>
    </DialogPrimitive.Content>
  </LargeSideDialogPortal>
))
LargeSideDialogContent.displayName = DialogPrimitive.Content.displayName

const LargeSideDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left p-6 border-b flex-shrink-0",
      className
    )}
    {...props}
  />
)
LargeSideDialogHeader.displayName = "LargeSideDialogHeader"

const LargeSideDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t flex-shrink-0",
      className
    )}
    {...props}
  />
)
LargeSideDialogFooter.displayName = "LargeSideDialogFooter"

const LargeSideDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
LargeSideDialogTitle.displayName = DialogPrimitive.Title.displayName

const LargeSideDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
LargeSideDialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  LargeSideDialog,
  LargeSideDialogPortal,
  LargeSideDialogOverlay,
  LargeSideDialogClose,
  LargeSideDialogTrigger,
  LargeSideDialogContent,
  LargeSideDialogHeader,
  LargeSideDialogFooter,
  LargeSideDialogTitle,
  LargeSideDialogDescription,
}
