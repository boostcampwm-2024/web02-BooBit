import { useMutation } from '@tanstack/react-query';
import { useAuthActions } from '../../../shared/store/auth/authActions';
import signoutApi from '../api/signoutApi';

const useSignout = () => {
  const { logout } = useAuthActions();
  return useMutation({
    mutationFn: signoutApi,
    onSuccess: () => {
      alert('로그아웃 성공:');
      logout();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('로그아웃 실패:', error.message);
        alert(`로그아웃 실패: ${error.message}`);
      } else {
        console.error('로그아웃 실패: 알 수 없는 오류');
      }
    },
  });
};

export default useSignout;
