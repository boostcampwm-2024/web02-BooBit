import AuthLayout from '../../widgets/AuthLayout';
import logo from '../../shared/images/BuBuWithLogo.png';
import SubmitButton from '../../shared/UI/SubmitButton';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  const moveToSignup = () => {
    navigate('/signup');
  };

  return (
    <AuthLayout>
      <img src={logo} alt="logo" className="w-[12rem]" />
      <SubmitButton content="로그인" onClick={() => alert('로그인')} />
      <button className="ml-[52%] text-available-medium-16 text-text-dark" onClick={moveToSignup}>
        아직 계정이 없다면? 회원가입하기
      </button>
    </AuthLayout>
  );
};

export default SignIn;
