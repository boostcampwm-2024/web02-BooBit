import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../shared/store/ToastContext';
import depositApi from '../api/depositApi';
import successMessages from '../../../shared/consts/successMessage';
import errorMessages from '../../../shared/consts/errorMessages';

const useDeposit = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: depositApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      addToast(successMessages.deposit, 'success');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        addToast(errorMessages.default.deposit, 'error');
      } else {
        addToast(errorMessages.default.general, 'error');
      }
    },
  });
};

export default useDeposit;
