import { useMutation } from '@tanstack/react-query';
import signUpApi from '../api/signupApi';

const useSignup = () => {
  return useMutation({
    mutationFn: signUpApi,
    onSuccess: () => {
      alert('회원가입 성공:');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('회원가입 실패:', error.message);
        alert(`회원가입 실패: ${error.message}`);
      } else {
        console.error('회원가입 실패: 알 수 없는 오류');
      }
    },
  });
};

export default useSignup;
