import { useMutation } from '@tanstack/react-query';
import signUpApi from '../api/signupApi';
import { useNavigate } from 'react-router-dom';
import FormValidationType from './formValidationType';

const useSignup = (
  onErrorCallback: (field: keyof FormValidationType, isError: boolean, message: string) => void
) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpApi,
    onSuccess: () => {
      alert('회원가입 성공:');
      navigate('/signin');
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message === '409') {
          onErrorCallback(
            'email',
            true,
            '이미 사용 중인 이메일 주소입니다. 다른 이메일을 사용해 주세요.'
          );
        } else if (error.message === '400')
          onErrorCallback(
            'email',
            true,
            '입력한 정보를 다시 확인해 주세요. 이메일 형식과 비밀번호 조건을 모두 충족해야 합니다.'
          );
        else {
          onErrorCallback('email', true, '회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
      } else {
        onErrorCallback('email', true, '회원가입에 실패했습니다. 다시 시도해 주세요.');
      }
    },
  });
};

export default useSignup;
