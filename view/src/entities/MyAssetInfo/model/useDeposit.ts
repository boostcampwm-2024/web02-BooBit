import { useMutation } from '@tanstack/react-query';
import depositApi from '../api/depositApi';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../../shared/store/auth/authActions';

const useDeposit = () => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();

  return useMutation({
    mutationFn: depositApi,
    onSuccess: () => {
      alert('입금 성공');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message === '403') {
          logout();
          navigate('/signin');
        } else {
          alert('입금에 실패했습니다. 다시 시도해주세요.');
        }
      } else {
        alert('입금에 실패했습니다. 다시 시도해주세요.');
      }
    },
  });
};

export default useDeposit;
