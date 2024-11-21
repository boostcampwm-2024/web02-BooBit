import AuthLayout from '../../widgets/AuthLayout';
import logo from '../../shared/images/BuBuWithLogo.png';
import SubmitButton from '../../shared/UI/SubmitButton';
import { useNavigate } from 'react-router-dom';
import InputField from '../../shared/UI/InputFeild';
import useSigninForm from './model/useSigninForm';
import useSignin from './model/useSignin';

const SignIn = () => {
  const { formData, error, handleChange, validateForm, updateErrorMessage } = useSigninForm();
  const { mutate } = useSignin(updateErrorMessage);
  const navigate = useNavigate();

  const handleSumbit = () => {
    if (!validateForm()) return;

    mutate(formData);
  };

  const moveToSignup = () => {
    navigate('/signup');
  };

  return (
    <AuthLayout>
      <img src={logo} alt="logo" className="w-[9vw] mb-[2rem]" />
      <InputField
        type="text"
        placeholder="이메일"
        name="email"
        value={formData.email}
        onChange={handleChange}
        isError={error.isError}
        errorMessage={error.errorMessage}
      />
      <InputField
        type="password"
        placeholder="비밀번호"
        name="password"
        value={formData.password}
        onChange={handleChange}
        isError={error.isError}
        errorMessage={error.errorMessage}
      />
      <SubmitButton height="h-[7vh]" content="로그인" onClick={handleSumbit} />
      <div className="w-full text-end mb-[5rem] ">
        <button
          className="text-available-medium-16 text-text-dark hover:underline"
          onClick={moveToSignup}
        >
          아직 계정이 없다면? 회원가입하기
        </button>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
