import { useMutation } from '@tanstack/react-query';
import signinApi from '../api/signinApi';

const useSignin = () => {
  return useMutation({
    mutationFn: signinApi,
    onSuccess: () => {
      alert('로그인 성공:');
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
