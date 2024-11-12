import { useMutation } from '@tanstack/react-query';
import signinApi from '../api/signinApi';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../../shared/store/auth/authActions';

const useSignin = () => {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  return useMutation({
    mutationFn: signinApi,
    onSuccess: () => {
      alert('로그인 성공:');
      navigate('/');
      login();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('로그인 실패:', error.message);
        alert(`로그인 실패: ${error.message}`);
      } else {
        console.error('회원가입 실패: 알 수 없는 오류');
      }
    },
  });
};

export default useSignin;
