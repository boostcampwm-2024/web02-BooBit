import { useMutation } from '@tanstack/react-query';
import withdrawApi from '../api/withdrawApi';

const useWithdraw = () => {
  return useMutation({
    mutationFn: withdrawApi,
    onSuccess: () => {
      alert('출금 성공');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert('출금에 실패했습니다. 다시 시도해주세요.');
      } else {
        alert('출금에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });
};

export default useWithdraw;
