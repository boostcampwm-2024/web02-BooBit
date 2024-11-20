import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import signoutApi from '../api/signoutApi';
import { useAuthActions } from '../../../shared/store/auth/authActions';
import errorMessages from '../../../shared/consts/errorMessages';
import { useToast } from '../../../shared/store/ToastContext';

const useSignout = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { logout } = useAuthActions();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signoutApi,
    onSuccess: () => {
      navigate('/');
      logout();
      queryClient.removeQueries();
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
