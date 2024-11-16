import { useMutation } from '@tanstack/react-query';
import signinApi from '../api/signinApi';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../../shared/store/auth/authActions';
import errorMessages from '../../../shared/consts/errorMessages';

const useSignin = (onErrorCallback: (message: string) => void) => {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  return useMutation({
    mutationFn: signinApi,
    onSuccess: () => {
      navigate('/');
      login();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message === '401') {
          onErrorCallback(errorMessages[401]);
        } else {
          onErrorCallback(errorMessages.default.signin);
        }
      } else {
        onErrorCallback(errorMessages.default.general);
      }
    },
  });
};

export default useSignin;
