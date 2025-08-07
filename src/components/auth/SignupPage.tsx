import { useState } from 'react';
import ModalSignup from '@/components/auth/ModalSignup';

const SignupPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-white flex items-center justify-center">
      {isOpen && <ModalSignup onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default SignupPage;