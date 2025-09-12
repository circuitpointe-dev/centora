import { useNavigate } from 'react-router-dom';
import ModalSignup from '@/components/auth/ModalSignup';

const SignupPage = () => {
  const navigate = useNavigate();
  return <ModalSignup onClose={() => navigate('/')} />;
};

export default SignupPage;