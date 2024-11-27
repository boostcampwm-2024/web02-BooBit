import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteOrderApi from '../api/deleteOrderApi';
import successMessages from '../../../shared/consts/successMessage';
import errorMessages from '../../../shared/consts/errorMessages';
import { useToast } from '../../../shared/store/ToastContext';
import { useAuthActions } from '../../../shared/store/auth/authActions';
import { useNavigate } from 'react-router-dom';

const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending'] });
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });

      addToast(successMessages.deleteOrder, 'success');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message === '403') {
          addToast(errorMessages[403], 'error');
          logout();
          navigate('/signin');
          return;
        }
        addToast(errorMessages.default.deleteOrder, 'error');
      } else {
        addToast(errorMessages.default.general, 'error');
      }
    },
  });
};

export default useDeleteOrder;
