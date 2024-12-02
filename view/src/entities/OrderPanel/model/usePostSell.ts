import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../shared/store/ToastContext';
import errorMessages from '../../../shared/consts/errorMessages';
import successMessages from '../../../shared/consts/successMessage';
import postSellApi from '../api/postSellApi';

const usePostSell = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postSellApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available'] });
      addToast(successMessages.sell, 'success');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message.startsWith('Not'))
          addToast(errorMessages[400].insufficientBalance, 'error');
        else if (error.message.startsWith('coin')) addToast(errorMessages[400].coinCode, 'error');
        else addToast(errorMessages.default.sell, 'error');
      } else {
        addToast(errorMessages.default.general, 'error');
      }
    },
  });
};

export default usePostSell;
