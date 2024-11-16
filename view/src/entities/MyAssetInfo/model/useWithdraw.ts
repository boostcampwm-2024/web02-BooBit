import { useMutation, useQueryClient } from '@tanstack/react-query';
import withdrawApi from '../api/withdrawApi';
import { useToast } from '../../../shared/store/ToastContext';
import successMessages from '../../../shared/consts/successMessage';
import errorMessages from '../../../shared/consts/errorMessages';

const useWithdraw = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      addToast(successMessages.withdraw, 'success');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        addToast(errorMessages.default.withdraw, 'error');
      } else {
        addToast(errorMessages.default.general, 'error');
      }
    },
  });
};

export default useWithdraw;
