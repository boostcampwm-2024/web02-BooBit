import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteOrderApi from '../api/deleteOrderApi';
import successMessages from '../../../shared/consts/successMessage';
import errorMessages from '../../../shared/consts/errorMessages';
import { useToast } from '../../../shared/store/ToastContext';

const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      addToast(successMessages.deleteOrder, 'success');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        addToast(errorMessages.default.deleteOrder, 'error');
      } else {
        addToast(errorMessages.default.general, 'error');
      }
    },
  });
};

export default useDeleteOrder;
