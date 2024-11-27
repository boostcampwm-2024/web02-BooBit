import { useMutation, useQueryClient } from '@tanstack/react-query';
import postBuyApi from '../api/postBuyApi';
import { useToast } from '../../../shared/store/ToastContext';
import errorMessages from '../../../shared/consts/errorMessages';
import successMessages from '../../../shared/consts/successMessage';

const usePostBuy = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postBuyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available'] });
      addToast(successMessages.buy, 'success');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message.startsWith('Not'))
          addToast(errorMessages[400].insufficientBalance, 'error');
        else if (error.message.startsWith('coin')) addToast(errorMessages[400].coinCode, 'error');
        else addToast(errorMessages.default.buy, 'error');
      } else {
        addToast(errorMessages.default.general, 'error');
      }
    },
  });
};

export default usePostBuy;
