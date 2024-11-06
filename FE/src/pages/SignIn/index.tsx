import AuthLayout from '../../widgets/AuthLayout';
import logo from '../../shared/images/BuBuWithLogo.png';
import SubmitButton from '../../shared/UI/SubmitButton';

const SignIn = () => {
  return (
    <AuthLayout>
      <img src={logo} alt="logo" className="w-[13rem]" />
      <SubmitButton content="로그인" onClick={() => alert('로그인')} />
    </AuthLayout>
  );
};

export default SignIn;
