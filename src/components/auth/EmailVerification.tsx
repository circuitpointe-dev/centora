import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmailVerificationProps {
  email: string;
  organizationName?: string;
  onVerified?: () => void;
}

const EmailVerification = ({ email, organizationName, onVerified }: EmailVerificationProps) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: { email, code }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        if (data.code === 'INVALID_CODE') {
          toast({
            title: "Invalid Code",
            description: "The verification code is invalid or has expired. Please try again.",
            variant: "destructive"
          });
        } else if (data.code === 'USER_NOT_FOUND') {
          toast({
            title: "Account Not Found",
            description: "Please complete the registration process first.",
            variant: "destructive"
          });
          navigate('/signup');
        } else {
          toast({
            title: "Verification Failed",
            description: data.error,
            variant: "destructive"
          });
        }
        return;
      }

      // Success
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified. You can now log in."
      });

      if (onVerified) {
        onVerified();
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "An error occurred while verifying your email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, organizationName }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        toast({
          title: "Failed to Send Code",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email."
      });

      // Reset timer
      setTimeLeft(15 * 60);
      setCode('');
    } catch (error: any) {
      console.error('Resend error:', error);
      toast({
        title: "Failed to Send Code",
        description: "An error occurred while sending the verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanedValue = value.replace(/\D/g, '').slice(0, 6);
    setCode(cleanedValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6) {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
            <Mail className="h-6 w-6 text-violet-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to
            <br />
            <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter 6-digit code"
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || code.length !== 6}
            className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <div className="text-center space-y-2">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-600">
                Code expires in: <strong>{formatTime(timeLeft)}</strong>
              </p>
            ) : (
              <p className="text-sm text-red-600">
                Your verification code has expired.
              </p>
            )}

            <Button
              variant="ghost"
              onClick={handleResendCode}
              disabled={isResending || timeLeft > 14 * 60} // Allow resend after 1 minute
              className="text-sm"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Resend Code
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;