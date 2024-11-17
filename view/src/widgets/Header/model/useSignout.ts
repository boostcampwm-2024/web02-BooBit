import { useMutation } from '@tanstack/react-query';
import { useAuthActions } from '../../../shared/store/auth/authActions';
import signoutApi from '../api/signoutApi';
import { useNavigate } from 'react-router-dom';
import errorMessages from '../../../shared/consts/errorMessages';
import { useToast } from '../../../shared/store/ToastContext';

const useSignout = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { logout } = useAuthActions();
  return useMutation({
    mutationFn: signoutApi,
    onSuccess: () => {
      navigate('/');
      logout();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        addToast(errorMessages.default.signout, 'error');
      } else {
        addToast(errorMessages.default.general, 'error');
      }
    },
  });
};

export default useSignout;
