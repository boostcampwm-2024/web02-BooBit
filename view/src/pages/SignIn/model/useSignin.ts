import { useMutation } from '@tanstack/react-query';
import signinApi from '../api/signinApi';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../../shared/store/auth/authActions';

const useSignin = (onErrorCallback: (message: string) => void) => {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  return useMutation({
    mutationFn: signinApi,
    onSuccess: () => {
      navigate('/');
      login();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message === '401') {
          onErrorCallback('이메일 혹은 비밀 번호를 확인해주세요.');
          console.error('로그인 실패:', error.message);
        }
      } else {
        console.error('로그인 실패: 알 수 없는 오류');
      }
    },
  });
};

export default useSignin;
