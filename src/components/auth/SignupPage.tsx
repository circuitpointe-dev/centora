import ModalSignup from '@/components/auth/ModalSignup';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return <ModalSignup onClose={handleClose} />;
};

export default SignupPage;