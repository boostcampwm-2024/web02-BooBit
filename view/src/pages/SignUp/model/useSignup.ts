import { useMutation } from '@tanstack/react-query';
import signUpApi from '../api/signupApi';
import { useNavigate } from 'react-router-dom';
import FormValidationType from './formValidationType';
import { useToast } from '../../../shared/store/ToastContext';
import successMessages from '../../../shared/consts/successMessage';
import errorMessages from '../../../shared/consts/errorMessages';

const useSignup = (
  onErrorCallback: (field: keyof FormValidationType, isError: boolean, message: string) => void
) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: signUpApi,
    onSuccess: () => {
      addToast(successMessages.signup, 'success');
      navigate('/signin');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message === '400') onErrorCallback('total', true, errorMessages[400].general);
        else if (error.message === '409') onErrorCallback('email', true, errorMessages[409]);
        else onErrorCallback('total', true, errorMessages.default.signup);
      } else {
        onErrorCallback('total', true, errorMessages.default.general);
      }
    },
  });
};

export default useSignup;
