import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormStep =
  | "email"
  | "verification"
  | "securityQuestion"
  | "adminContact"
  | "success";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const verificationSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Verification code must be at least 6 characters" }),
});

const securitySchema = z.object({
  answer: z
    .string()
    .min(1, { message: "Please provide an answer to the security question" }),
});

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [step, setStep] = useState<FormStep>("email");
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(
    "What was the name of your first pet?"
  );

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleEmailSubmit = (data: z.infer<typeof emailSchema>) => {
    setEmail(data.email);

    // Simulate API call to check if email exists
    setTimeout(() => {
      setSecurityQuestion("What was the name of your first pet?");
      setStep("verification");
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code.",
        variant: "default",
      });
    }, 1000);
  };

  const handleVerificationSubmit = (
    data: z.infer<typeof verificationSchema>
  ) => {
    setTimeout(() => {
      if (data.code === "123456") {
        setStep("securityQuestion");
      } else {
        toast({
          title: "Invalid verification code",
          description: "Please check the code and try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const handleSecuritySubmit = (data: z.infer<typeof securitySchema>) => {
    setTimeout(() => {
      if (data.answer.toLowerCase() === "fluffy") {
        setStep("success");
        toast({
          title: "Password reset link sent",
          description: "Please check your email for the reset link.",
        });
      } else {
        setStep("adminContact");
        toast({
          title: "Answer incorrect",
          description:
            "You may need to contact your administrator for assistance.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const handleDialogClose = () => {
    setStep("email");
    emailForm.reset();
    verificationForm.reset();
    securityForm.reset();
    onOpenChange(false);
  };

  const renderFormStep = () => {
    switch (step) {
      case "email":
        return (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Continue
                </Button>
              </DialogFooter>
            </form>
          </Form>
        );
      case "verification":
        return (
          <Form {...verificationForm}>
            <form
              onSubmit={verificationForm.handleSubmit(handleVerificationSubmit)}
              className="space-y-4"
            >
              <div className="text-sm text-gray-600 mb-4">
                We've sent a verification code to{" "}
                <span className="font-medium">{email}</span>.
              </div>
              <FormField
                control={verificationForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter 6-digit code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("email")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Verify
                </Button>
              </DialogFooter>
            </form>
          </Form>
        );
      case "securityQuestion":
        return (
          <Form {...securityForm}>
            <form
              onSubmit={securityForm.handleSubmit(handleSecuritySubmit)}
              className="space-y-4"
            >
              <div className="text-sm text-gray-600 mb-4">
                Please answer your security question to reset your password.
              </div>
              <div className="font-medium text-sm">{securityQuestion}</div>
              <FormField
                control={securityForm.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("verification")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        );
      case "adminContact":
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                You've exhausted the automated recovery options. Please contact
                your organization's administrator to reset your password.
              </p>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-2">
                <p className="font-medium text-sm">
                  Organization Administrator Contact
                </p>
                <p className="text-sm mt-1">
                  Email: admin@yourorganization.com
                </p>
                <p className="text-sm">Phone: (123) 456-7890</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        );
      case "success":
        return (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200 mb-4">
                <p className="font-medium">Password Reset Link Sent!</p>
                <p className="text-sm mt-1">
                  We've sent a password reset link to your email. The link will
                  expire in 24 hours.
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Please check your inbox and follow the instructions to reset
                your password.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className="bg-violet-600 hover:bg-violet-700"
                onClick={handleDialogClose}
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md bg-white text-black fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>
            {step === "success" ? "Password Reset Sent" : "Reset Your Password"}
          </DialogTitle>
          <DialogDescription>
            {step === "email" &&
              "Enter your email to start the password reset process."}
            {step === "verification" &&
              "Enter the verification code sent to your email."}
            {step === "securityQuestion" &&
              "Answer your security question to verify your identity."}
            {step === "adminContact" &&
              "Get help from your organization administrator."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">{renderFormStep()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
