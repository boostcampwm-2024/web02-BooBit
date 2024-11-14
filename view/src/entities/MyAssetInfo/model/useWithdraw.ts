import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../../shared/store/auth/authActions';
import withdrawApi from '../api/withdrawApi';

const useWithdraw = () => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();

  return useMutation({
    mutationFn: withdrawApi,
    onSuccess: () => {
      alert('출금 성공');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message === '403') {
          logout();
          navigate('/signin');
        } else {
          alert('출금에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        alert('출금에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });
};

export default useWithdraw;
