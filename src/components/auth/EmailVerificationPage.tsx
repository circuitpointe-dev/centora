import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import EmailVerification from './EmailVerification';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const organizationName = searchParams.get('org');

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <EmailVerification 
      email={email} 
      organizationName={organizationName || undefined}
    />
  );
};

export default EmailVerificationPage;